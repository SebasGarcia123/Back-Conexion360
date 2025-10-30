import express, { Request, Response, NextFunction } from "express";
import Building from "../schemas/buildings";
import { CreateBuildingRequest } from "../types";

const router = express.Router();

router.post("/", createBuilding);
router.get("/", getAllBuildings);
router.get("/:id", getBuildingById);
router.put("/:id", updateBuilding);
router.delete("/:id", deleteBuilding);

async function createBuilding(
  req: Request<Record<string, never>, unknown, CreateBuildingRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("createBuilding");
    try {
        const buildingData: CreateBuildingRequest & { isActive: boolean } = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            postalCode: req.body.postalCode,
            isActive: true,
        };
        const buildingCreate = await Building.create(buildingData);
        res.status(201).send(buildingCreate);
    } catch (err) {
        next(err);
    }
}

async function getAllBuildings(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getAllBuildings");
    try {
        const buildings = await Building.find({ isActive: true });
        res.send(buildings);
    } catch (err) {
        next(err);
    }
}

async function getBuildingById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getBuilding with id: ", req.params.id);
    if (!req.params.id) {
        res.status(500).send("The param id is not defined");
        return;
    }
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            res.status(404).send("Building not found");
            return;
        }
        res.send(building);
    } catch (err) {
        next(err);
    }   
}

async function updateBuilding(  
    req: Request<{ id: string }, unknown, CreateBuildingRequest>,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("updateBuilding with id: ", req.params.id);
    if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }
    try {
        const updatedBuilding = await Building.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                country: req.body.country,
                postalCode: req.body.postalCode,
            },
            { new: true }
        );
        if (!updatedBuilding) {
            res.status(404).send("Building not found");
            return;
        }
        res.send(updatedBuilding);
    } catch (err) {
        next(err);
    }
}

async function deleteBuilding(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    console.log('deleteBuilding with id: ', req.params.id)
    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
        return
    }
    try {
        const deletedBuilding = await Building.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        )
        if (!deletedBuilding) {
            res.status(404).send('Building not found')
            return
        }
        res.send(`Building deleted :  ${req.params.id}`)
    } catch (err) {
        next(err)
    }   
}

export default router;
