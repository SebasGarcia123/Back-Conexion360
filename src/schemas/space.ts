import mongoose, { Schema } from 'mongoose';
import { ISpace } from '../types/index';

const spaceSchema = new Schema<ISpace>(
    {
        pictureUrl: { type: String, required: true },
        spaceType: { type: String, enum: ['floor', 'office', 'desk'], required: true },
        description: { type: String, required: true },
        capacity: { type: Number, required: true },
        pricePerHour: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true } // Genera automáticamente createdAt y updatedAt para saber cuándo se creó y actualizó el espacio
)
const Space = mongoose.model<ISpace>('Space', spaceSchema);

export default Space;