import express, { Request, Response, NextFunction } from "express";
import Building from "../schemas/buildings";
import { CreateBuildingRequest } from "../types";
import { MongoServerError } from 'mongodb'

const router = express.Router();

router.post("/", createBuilding);
router.get("/", getAllBuildings);
router.get("/admin", getAllBuildingsAdmin);
router.get("/:id", getBuildingById);
router.put("/:id", updateBuilding);
router.delete("/:id", deleteBuilding);
router.patch('/:id/reactivate', reactivateBuilding)

async function createBuilding(
  req: Request<Record<string, never>, unknown, CreateBuildingRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const exists = await Building.findOne({
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        })

        if (exists) {
        res.status(409).json({
            message: 'Ya existe un edificio con esa dirección',
        })
        return
        }
        const buildingData: CreateBuildingRequest & { isActive: boolean } = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            postalCode: req.body.postalCode,
            isActive: true,
        };
        const buildingCreate = await Building.create(buildingData);
        res.status(201).send(buildingCreate);
    } catch (err) {
        if (err instanceof MongoServerError && err.code === 11000) {
            res.status(409).json({
            message: 'Ya existe un edificio con esa dirección',
            })
            return 
        }
        next(err)
        }
}

async function getAllBuildings(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const buildings = await Building.find({ isActive: true });
        res.send(buildings);
    } catch (err) {
        next(err);
    }
}

// GET /admin/buildings
async function getAllBuildingsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const buildings = await Building.find()
    res.status(200).json(buildings)
  } catch (err) {
    next(err)
  }
}


async function getBuildingById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
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

  const { id } = req.params

  if (!id) {
    res.status(400).json({ message: 'Param id is required' })
    return
  }

  try {
    const building = await Building.findById(id)

    if (!building) {
      res.status(404).json({ message: 'Building not found' })
      return
    }

    if (!building.isActive) {
      res.status(409).json({ message: 'Building already inactive' })
      return
    }

    building.isActive = false
    await building.save()

    res.status(200).json({
      message: 'Building deactivated successfully',
      id: building._id,
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /buildings/:id/reactivate
async function reactivateBuilding(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    )

    if (!building) {
      res.status(404).json({ message: 'Building not found' })
      return
    }

    res.status(200).json(building)
  } catch (err) {
    next(err)
  }
}



export default router;
