import Reservation from "../schemas/reservation"

export async function isSpaceAvailable(spaceId: string, dateFrom: Date, dateTo: Date) {
  const existing = await Reservation.exists({
    spaceId,
    dateFrom: { $lt: dateTo }, // existing start < new end
    dateTo: { $gt: dateFrom }, // existing end > new start
  });

  return !existing; // true si NO hay reserva que choque
}