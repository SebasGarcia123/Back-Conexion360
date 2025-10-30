import mongoose, { Schema } from 'mongoose';
import { IReservation } from '../types/index';

const reservationSchema = new Schema<IReservation>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        dateFrom: { type: Date, required: true },
        dateTo: { type: Date, required: true },
        space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
        totalPrice: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
        rentTipe: { type: String, enum: ['day', 'week', 'month', 'year'], required: true },
    },
    { timestamps: true } // Genera automáticamente createdAt y updatedAt para saber cuándo se creó y actualizó la reserva
)
const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;