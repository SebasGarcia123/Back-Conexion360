import express, { Request, Response, NextFunction } from "express";
import Reservation from "../schemas/reservation";
import { CreateReservationRequest } from "../types";
import { isSpaceAvailable } from "../services/reservationServices";

const router = express.Router();

/* ---------------------------------------------------------
 * 🔹 CREATE – Nueva reserva
 * --------------------------------------------------------- */
router.post("/", createReservation);

/* ---------------------------------------------------------
 * 🔹 GET – Reservas del usuario autenticado
 * --------------------------------------------------------- */
router.get("/my", getMyReservations);

/* ---------------------------------------------------------
 * 🔹 CRUD básico
 * --------------------------------------------------------- */
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

export default router;


/* =========================================================
 * CONTROLLERS
 * ========================================================= */

async function createReservation(
  req: Request<Record<string, never>, unknown, CreateReservationRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const { spaceId, dateFrom, dateTo, totalPrice, rentType } = req.body;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (to <= from) {
      res.status(400).json({ message: "dateTo debe ser mayor a dateFrom" });
      return;
    }

    const available = await isSpaceAvailable(spaceId, from, to);

    if (!available) {
      res.status(409).json({ message: "Espacio NO disponible en ese rango" });
      return;
    }

    const reservation = await Reservation.create({
      userId: req.user._id,
      spaceId,
      dateFrom: from,
      dateTo: to,
      totalPrice,
      rentType,
    });

    res.status(201).json(reservation);

  } catch (err) {
    next(err);
  }
}


/* ---------------------------------------------------------
 * 🔹 GET – Reservas del usuario logueado
 * --------------------------------------------------------- */
async function getMyReservations(req: Request, res: Response): Promise<void> {

  if (!req.user) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  const reservations = await Reservation.find({ userId: req.user._id })
    .populate({
      path: "spaceId",
      populate: { path: "building", model: "Building" }
    });

  res.json(reservations);
}


/* ---------------------------------------------------------
 * 🔹 LIST ALL
 * --------------------------------------------------------- */
async function getAllReservations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const reservations = await Reservation.find()
      .populate("spaceId")
      .populate("userId");
    
    res.json(reservations);

  } catch (err) {
    next(err);
  }
}


/* ---------------------------------------------------------
 * 🔹 GET by ID
 * --------------------------------------------------------- */
async function getReservationById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }

    res.json(reservation);

  } catch (err) {
    next(err);
  }
}


/* ---------------------------------------------------------
 * 🔹 UPDATE
 * --------------------------------------------------------- */
async function updateReservation(
  req: Request<{ id: string }, unknown, CreateReservationRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const { id } = req.params;
    const { spaceId, dateFrom, dateTo, totalPrice, rentType } = req.body;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (to <= from) {
      res.status(400).json({ message: "dateTo debe ser mayor a dateFrom" });
      return;
    }

    // Verificar disponibilidad excluyendo la propia reserva
    const available = await isSpaceAvailable(spaceId, from, to, id);

    if (!available) {
      res.status(409).json({ message: "Espacio NO disponible en ese rango" });
      return;
    }

    const updated = await Reservation.findByIdAndUpdate(
      id,
      { spaceId, dateFrom: from, dateTo: to, totalPrice, rentType },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }

    res.json(updated);

  } catch (err) {
    next(err);
  }
}


/* ---------------------------------------------------------
 * 🔹 DELETE
 * --------------------------------------------------------- */
async function deleteReservation(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }

    res.json(deleted);

  } catch (err) {
    next(err);
  }
}
