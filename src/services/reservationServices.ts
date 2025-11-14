import Reservation from "../schemas/reservation";

export async function isSpaceAvailable(
  spaceId: string,
  dateFrom: Date,
  dateTo: Date,
  ignoreReservationId?: string
): Promise<boolean> {

  if (dateTo <= dateFrom) return false;

  const query: any = {
    spaceId,
    $or: [
      {
        dateFrom: { $lte: dateTo },
        dateTo: { $gte: dateFrom }
      }
    ]
  };

  // Excluir la reserva actual (cuando se edita)
  if (ignoreReservationId) {
    query._id = { $ne: ignoreReservationId };
  }

  const overlapping = await Reservation.findOne(query);

  return !overlapping;
}
