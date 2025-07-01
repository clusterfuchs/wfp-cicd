import {Schema, model} from 'mongoose';

interface IEvent{
    title: string,
    start_date: Date,
    end_date: Date,
    color: String
}

const EventSchema = new Schema<IEvent>({
    title: {
        type: String, required: true
    },
    start_date: {
        type: Date, required: true
    },
    end_date: {
        type: Date, required: true
    },
    color: {
        type: String, required: true
    }
},{
    timestamps: true
})

export const Event = model<IEvent>('event', EventSchema); 