import express, { Request, Response, NextFunction } from "express";
import Space from "../schemas/space";
import { CreateSpaceRequest } from "../types/index";

const router = express.Router();

router.post("/", createSpace);
router.get("/", getAllSpaces);
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
        const spaceCreate = await Space.create(spaceData);
        res.status(201).send(spaceCreate);
    } catch (err) {
        next(err);
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

export default router;

