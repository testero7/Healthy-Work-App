import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
        },
        waterNoti:{
            type: Number,
            default: 15,
        },
        stretchNoti:{
            type: Number,
            default: 120,
        },
        eyeNoti:{
            type: Number,
            default: 30,
        },
        postureNoti:{
            type: Number,
            requred: true,
            default: 180,
        },
        lightNoti:{
            type: Number,
            requred: true,
            default: 60,
        }
    },
 {timestamps: true});

 const Notification = mongoose.model('Notification', notificationSchema);

 export default Notification;