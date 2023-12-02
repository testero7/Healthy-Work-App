import mongoose from 'mongoose';

const pomodoroSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' },
        confId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Configuration' },
        startTime:{
            type: Date,
            requred: true,
        },
        endTime:{
            type: Date,
            requred: true,
        },
        workTime:{
            type: Number,
        },
        breakTime:{
            type: Number,
            requred: true,
            default: 0,
        },
        breakCounter:{
            type: Number,
            requred: true,
            default: 0,
        },
        status:{
            type: String,
            requred: true,
            default: "In progress"
        }
    },
 {timestamps: true});

 const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

 export default Pomodoro;