import mongoose from 'mongoose';

const pomodoroSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' },
        name:{
            type: String,
            requred: true,
        },
        startTime:{
            type: Date,
            requred: true,
        },
        endTime:{
            type: Date,
            requred: true,
        },
        breakTime:{
            type: Number,
            requred: true,
            default: 15,
        },
        breakAfter:{
            type: Number,
            requred: true,
            default: 120,
        }
    },
 {timestamps: true});

 const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

 export default Pomodoro;