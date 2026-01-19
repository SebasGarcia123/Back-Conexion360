import express, { NextFunction, Request, Response } from "express";
import Opinion from "../schemas/opinions";
import Reservation from "../schemas/reservation";

const router = express.Router();

router.post("/", createOpinion);
router.get("/", getAllOpinions);

export default router;

async function createOpinion (req: Request, res: Response) {
  try {
    const {
      reservation,
      space,
      name,
      position,
      company,
      comment,
      valoration,
    } = req.body

    if (!reservation || !valoration) {
      return res.status(400).json({ message: "Datos incompletos" })
    }

    const reserva = await Reservation.findById(reservation)

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" })
    }

    if (reserva.status !== "Por Valorar") {
      return res.status(400).json({
        message: "Esta reserva no puede valorarse",
      })
    }

    const opinion = await Opinion.create({
      name,
      position,
      company,
      comment,
      date: new Date(),
      reservation: reserva._id,
      space,
      valoration,
    })

    // actualizar estado de la reserva
    reserva.status = "Cumplida"
    await reserva.save()
    return res.status(201).json(opinion)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Error al crear la valoración" })
  }
}

async function getAllOpinions(req: Request, res: Response, next: NextFunction) : Promise<void>{
  console.log("getAllOpinions");
   try {
    const opinions = await Opinion.find()
      .populate({
        path: 'space',
        select: 'pictureUrl spaceType building',
        populate: {
          path: 'building',
          select: 'address name',
        },
      });
      console.log(opinions)
    res.send(opinions);
  } catch (err) {
    console.error('Error fetching opinions:', err);
    next(err);
  }
}
