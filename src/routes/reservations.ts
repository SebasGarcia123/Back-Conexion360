import express, { Request, Response, NextFunction } from "express";
import Reservation from "../schemas/reservation";
import { CreateReservationRequest } from "../types/index";

const router = express.Router();

router.post("/", createReservation);
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

async function createReservation(
  req: Request<Record<string, never>, unknown, CreateReservationRequest>,
  res: Response,
    next: NextFunction  
): Promise<void> {
  console.log("createReservation");
    try {
        const reservationData: CreateReservationRequest = {
            userId: req.body.userId,
            spaceId: req.body.spaceId,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo,
            totalPrice: req.body.totalPrice,
            rentTipe: req.body.rentTipe,
        };
        const reservationCreate = await Reservation.create(reservationData);
        res.status(201).send(reservationCreate);
    } catch (err) {
        next(err);
    }
}

async function getAllReservations(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getAllReservations");
    try {
        const reservations = await Reservation.find();
        res.send(reservations);
    } catch (err) {
        next(err);
    }
}   
async function getReservationById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getReservation with id: ", req.params.id);
    if (!req.params.id) {
        res.status(500).send("The param id is not defined");
        return;
    }   
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

async function updateReservation(
    req: Request<{ id: string }, unknown, CreateReservationRequest>,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("updateReservation with id: ", req.params.id);
    if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            {
                userId: req.body.userId,
                spaceId: req.body.spaceId,
                startDate: req.body.dateFrom,
                endDate: req.body.dateTo,
            },
            { new: true }
        );
        if (!updatedReservation) {
            res.status(404).send("Reservation not found");
            return;
        }
        res.send(updatedReservation);
    } catch (err) {
        next(err);
    }
} 

async function deleteReservation(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    console.log('deleteReservation with id: ', req.params.id)
    if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(
            req.params.id
        );
        if (!deletedReservation) {
            res.status(404).send("Reservation not found");
            return;
        }
        res.send(deletedReservation);
    } catch (err) {
        next(err);
    }
}

export default router;