import express, { Request, Response, NextFunction } from "express";
import Reservation from "../schemas/reservation";
import { CreateReservationRequest } from "../types/index";
import { isSpaceAvailable } from "../services/reservationServices";
import Building from "../schemas/buildings";
import dayjs from 'dayjs'



const router = express.Router();

router.post("/", createReservation);
router.get("/", getAllReservations);
router.get("/my", getMyReservations);
router.get("/space/:id", getReservationsBySpaceId);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);
router.patch("/:id/cancel", cancelReservation);


export default router;

/* =========================================================
 * CREATE RESERVATION
 * ========================================================= */

async function createReservation(
  req: Request<Record<string, never>, unknown, CreateReservationRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("createReservation");

  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const { spaceId, dateFrom, dateTo, totalPrice, rentType } = req.body;
    console.log("BODY:", req.body);
    console.log("dateFrom recibido:", dateFrom);
    console.log("dateTo recibido:", dateTo);
    console.log("rentType:", rentType);

    const reservationData = {
      userId: req.user._id,
      spaceId: spaceId,
      dateFrom: dateFrom,
      dateTo: dateTo,
      totalPrice: totalPrice,
      rentType: rentType,
      status: 'Pendiente'
    };

    const reservation = await Reservation.create(reservationData);
    console.log("Collection usada:", Reservation.collection.name);
    console.log("Documento creado:", reservation);

    res.status(201).send(reservation);

  } catch (err) {
    next(err);
  }
}

/* =========================================================
 * GET ALL RESERVATIONS
 * ========================================================= */

async function getAllReservations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("getAllReservations");

  try {
    const reservations = await Reservation.find()
      .populate("userId", "email")
      .populate("spaceId");

    res.send(reservations);
  } catch (err) {
    next(err);
  }
}

/* =========================================================
 * GET RESERVATIONS OF LOGGED USER
 * ========================================================= */

async function getMyReservations(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

   const hoy = dayjs().startOf('day')

   await Reservation.updateMany(
    {
      userId: req.user._id,
      status: 'Pendiente',
      dateTo: { $lt: hoy.toDate() },
    },
    {
      $set: { status: 'Por Valorar' },
    }
  )

  const reservations = await Reservation.find({ userId: req.user._id })
    .populate({
      path: "spaceId",
      populate: { path: "building", model: Building },
    });
  console.log(JSON.stringify(reservations, null, 2))

  res.send(reservations);
}

/* =========================================================
 * GET BY SPACE ID
 * ========================================================= */

async function getReservationsBySpaceId(req: Request, res: Response): Promise<void> {
  try {
    const reservations = await Reservation.find({ spaceId: req.params.id });
    res.send(reservations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error obteniendo reservas del espacio" });
  }
}

/* =========================================================
 * GET BY ID
 * ========================================================= */

async function getReservationById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("getReservation id:", req.params.id);

  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).send("Reservation not found");
      return;
    }

    res.send(reservation);
  } catch (err) {
    next(err);
  }
}

/* =========================================================
 * UPDATE RESERVATION
 * ========================================================= */

async function updateReservation(
  req: Request<{ id: string }, unknown, CreateReservationRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("updateReservation id:", req.params.id);

  try {
    const { id } = req.params;
    const { spaceId, dateFrom, dateTo, totalPrice, rentType } = req.body;

    let from = new Date(dateFrom);
    let to = new Date(dateTo);

    if (rentType === "Dia") {
      to = new Date(from);
    }

    if (to < from) {
      res.status(400).json({ message: "dateTo no puede ser menor a dateFrom" });
      return;
    }

    const available = await isSpaceAvailable(spaceId, from, to, id);

    if (!available) {
      res.status(409).json({ message: "El espacio no está disponible." });
      return;
    }

    const updated = await Reservation.findByIdAndUpdate(
      id,
      { spaceId, dateFrom: from, dateTo: to, totalPrice, rentType },
      { new: true }
    );

    if (!updated) {
      res.status(404).send("Reservation not found");
      return;
    }

    res.send(updated);

  } catch (err) {
    next(err);
  }
}

/* =========================================================
 * DELETE RESERVATION
 * ========================================================= */

async function deleteReservation(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("deleteReservation id:", req.params.id);

  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).send("Reservation not found");
      return;
    }

    res.send(deleted);

  } catch (err) {
    next(err);
  }
}

async function cancelReservation(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelada" },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cancelar la reserva" });
  }
}


