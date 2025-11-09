import mongoose, { Schema } from 'mongoose';
import { IReservation } from '../types/index';

const reservationSchema = new Schema<IReservation>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        dateFrom: { type: Date, required: true },
        dateTo: { type: Date, required: true },
        spaceId: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
        totalPrice: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
        rentType: { type: String, enum: ['Dia', 'Semana', 'Mes', 'Año'], required: true }

    },
    { timestamps: true } // Genera automáticamente createdAt y updatedAt para saber cuándo se creó y actualizó la reserva
)
const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;