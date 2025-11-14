import express, { Request, Response, NextFunction } from "express";
import Space from "../schemas/space";
import { CreateSpaceRequest } from "../types/index";
import { isSpaceAvailable } from "../services/reservationServices.js";
import Reservation from "../schemas/reservation";

const router = express.Router();

router.post("/", createSpace);
router.get("/", getAllSpaces);
router.get("/:id/availability", availability);
router.get("/reservations/space/:id", reservationBySpaceId);
router.get("/:id", getSpaceById);
router.put("/:id", updateSpace);
router.delete("/:id", deleteSpace);

async function createSpace(
  req: Request<Record<string, never>, unknown, CreateSpaceRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("createSpace");
    try {
        const spaceData: CreateSpaceRequest & { isActive: boolean } = {
            pictureUrl: req.body.pictureUrl,
            building: req.body.building,
            spaceType: req.body.spaceType,
            description: req.body.description,
            capacity: req.body.capacity,
            pricePerDay: req.body.pricePerDay,
            isActive: true,
        };
        console.log("Valor recibido (raw):", req.body.spaceType);
        console.log("Valor recibido (JSON):", JSON.stringify(req.body.spaceType));
        console.log("Tipo:", typeof req.body.spaceType);

        const spaceCreate = await Space.create(spaceData);
        res.status(201).send(spaceCreate);
    } catch (err) {
        next(err);
    }
}

async function availability (
  req: Request<Record<string, never>, unknown, CreateSpaceRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
      res.status(400).json({ message: "dateFrom y dateTo son requeridos" })
      return 
    }

    const { id: spaceId } = req.params;

    if (!spaceId) {
      res.status(400).json({ message: "spaceId requerido" });
      return;
    }

    const available = await isSpaceAvailable(
      spaceId,
      new Date(dateFrom as string),
      new Date(dateTo as string)
    );

    res.json({ available });

  } catch (error) {
    next(error);
  }
}

async function reservationBySpaceId (
  req: Request<Record<string, never>, unknown, CreateSpaceRequest>,
  res: Response,
): Promise<void> {
  try {
    const reservations = await Reservation.find({ spaceId: req.params.id });
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo reservas" });
  }
}


async function getAllSpaces(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getAllSpaces");
    try {
        const spaces = await Space.find({ isActive: true }).populate({
        path: "building",
        select: "name", // solo traemos el nombre
        })
        console.log(spaces);
        res.send(spaces);
    } catch (err) {
        next(err);
    }
} 


async function getSpaceById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getSpace with id: ", req.params.id);
    if (!req.params.id) {
        res.status(500).send("The param id is not defined");
        return;
    }
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            res.status(404).send("Space not found");
            return;
        }
        res.send(space);
    } catch (err) {
        next(err);
    }
}

async function updateSpace(
    req: Request<{ id: string }, unknown, CreateSpaceRequest>,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("updateSpace with id: ", req.params.id);
    if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }
    try {
        const updatedSpace = await Space.findByIdAndUpdate(
            req.params.id,
            {
                pictureUrl: req.body.pictureUrl,
                spaceType: req.body.spaceType,
                description: req.body.description,
                capacity: req.body.capacity,
                pricePerDay: req.body.pricePerDay,
            },
            { new: true }
        );
        if (!updatedSpace) {
            res.status(404).send("Space not found");
            return;
        }
        res.send(updatedSpace);
    } catch (err) {
        next(err);
    }
}

async function deleteSpace(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    console.log('deleteSpace with id: ', req.params.id)
    if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }
    try {   
        const deletedSpace = await Space.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!deletedSpace) {
            res.status(404).send("Space not found");
            return;
        }
        res.send(deletedSpace);
    } catch (err) {
        next(err);
    }
}

router.get("/available", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ message: "Fechas requeridas" });
    }

    const spaces = await Space.find({ isActive: true });

    const disponibles = [];

    for (const space of spaces) {
      const estaLibre = await isSpaceAvailable(
        space._id.toString(),
        new Date(dateFrom as string),
        new Date(dateTo as string)
      );

      if (estaLibre) disponibles.push(space);
    }

    res.json(disponibles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo disponibilidad" });
  }
});

export default router;

