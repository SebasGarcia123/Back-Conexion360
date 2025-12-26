import mongoose, { Schema } from 'mongoose';
import { IOpinion } from '../types/index';

const opinionSchema = new Schema<IOpinion>(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        company: { type: String, required: true },
        date: { type: Date, required: true },
        reservation: { type: Schema.Types.ObjectId, ref: "Reservation", required: true},
        space: { type: Schema.Types.ObjectId, ref: "Space", required: true },
        valoration: { type: Number, required: true, min: 0, max: 10 },
    },
    { timestamps: true }
)
const Opinion = mongoose.model<IOpinion>('Opinion', opinionSchema)

export default Opinion;

