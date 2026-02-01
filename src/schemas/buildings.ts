import mongoose, { Schema } from 'mongoose';
import { IBuilding } from '../types/index';

const buildingSchema = new Schema<IBuilding>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        latitude: { type: Number, required: true},
        longitude: { type: Number, required: true},
        postalCode: { type: String, required: true },
        urlImage: { type: String, default: 'http://localhost:4000/images/EdificioDefault.jpg' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true } // Genera automáticamente createdAt y updatedAt para saber cuándo se creó y actualizó el edificio
)
const Building = mongoose.model<IBuilding>('Building', buildingSchema)

export default Building;