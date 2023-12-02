import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' },
        name:{
            type: String,
            requred: true,
        },
        durationTime:{
            type: Number,
        },
        breakTime:{
            type: Number,
            requred: true,
            default: 15,
        },
        breakAfter:{
            type: Number,
            requred: true,
            default: 0,
        }
    },
 {timestamps: true});

 const Configuration = mongoose.model('Configuration', configurationSchema);

 export default Configuration;