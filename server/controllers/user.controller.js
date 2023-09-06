import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
export const test = (req, res) => {
        res.json({
            message: "Api test",
        });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can update only your account!'));
    }
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            photo: req.body.photo,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };


  export const deleteUser = async (req, res, next) => {
    if( req.user.id !== req.params.id){
      return next(errorHandler(401, "You cant delete other people accounts!"));
      
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted!");
    }catch (error){
      next(error);
    }
  }
