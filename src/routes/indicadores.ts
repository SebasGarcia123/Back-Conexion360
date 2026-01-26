import express, { Request, Response, NextFunction } from 'express'
import mongoose, { PipelineStage } from 'mongoose'
import Reservation from '../schemas/reservation'
import Opinion from '../schemas/opinions'


const router = express.Router()

// GET /api/indicadores/edificios/reservas-por-mes
router.get('/edificios/reservas-por-mes', getReservasPorEdificioPorMes)
router.get('/edificios/valoracion-mensual', getValoracionMensualPorEdificio)

async function getReservasPorEdificioPorMes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { buildingId, desdeAnio, hastaAnio } = req.query

    const match: Record<string, any> = {
      status: { $in: ['Cumplida', 'Por Valorar'] }
    }

    if (desdeAnio || hastaAnio) {
      match.dateFrom = {}

      if (desdeAnio) {
        match.dateFrom.$gte = new Date(`${desdeAnio}-01-01`)
      }

      if (hastaAnio) {
        match.dateFrom.$lte = new Date(`${hastaAnio}-12-31`)
      }
    }

    const pipeline: PipelineStage[] = []

    pipeline.push({ $match: match })

    // Space
    pipeline.push(
      {
        $lookup: {
          from: 'spaces',
          localField: 'spaceId',
          foreignField: '_id',
          as: 'space'
        }
      },
      { $unwind: '$space' }
    )

    // Building
    pipeline.push(
      {
        $lookup: {
          from: 'buildings',
          localField: 'space.building',
          foreignField: '_id',
          as: 'building'
        }
      },
      { $unwind: '$building' }
    )

    // Filtro edificio opcional
    if (buildingId) {
      pipeline.push({
        $match: {
          'building._id': new mongoose.Types.ObjectId(buildingId as string)
        }
      })
    }

    // Año y mes
    pipeline.push(
      {
        $addFields: {
          year: { $year: '$dateFrom' },
          month: { $month: '$dateFrom' }
        }
      },
      {
        $group: {
          _id: {
            buildingId: '$building._id',
            buildingName: '$building.name',
            year: '$year',
            month: '$month'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            buildingId: '$_id.buildingId',
            buildingName: '$_id.buildingName',
            year: '$_id.year'
          },
          monthly: {
            $push: {
              month: '$_id.month',
              count: '$count'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          buildingId: '$_id.buildingId',
          buildingName: '$_id.buildingName',
          year: '$_id.year',
          monthly: 1
        }
      },
      {
        $sort: {
          buildingName: 1,
          year: 1
        }
      }
    )

    const result = await Reservation.aggregate(pipeline)
    res.send(result)
  } catch (err) {
    next(err)
  }
}

async function getValoracionMensualPorEdificio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { buildingId, desdeAnio, hastaAnio } = req.query

    const match: Record<string, any> = {}

    if (desdeAnio || hastaAnio) {
      match.date = {}
      if (desdeAnio) match.date.$gte = new Date(`${desdeAnio}-01-01`)
      if (hastaAnio) match.date.$lte = new Date(`${hastaAnio}-12-31`)
    }

    const pipeline: PipelineStage[] = [
      { $match: match },

      // Space
      {
        $lookup: {
          from: 'spaces',
          localField: 'space',
          foreignField: '_id',
          as: 'space'
        }
      },
      { $unwind: '$space' },

      // Building
      {
        $lookup: {
          from: 'buildings',
          localField: 'space.building',
          foreignField: '_id',
          as: 'building'
        }
      },
      { $unwind: '$building' },

      ...(buildingId
        ? [{
            $match: {
              'building._id': new mongoose.Types.ObjectId(buildingId as string)
            }
          }]
        : []),

      // Año y mes (ACÁ estaba el bug)
      {
        $addFields: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        }
      },

      // Agrupación mensual
      {
        $group: {
          _id: {
            buildingId: '$building._id',
            buildingName: '$building.name',
            year: '$year',
            month: '$month'
          },
          averageValoration: { $avg: '$valoration' }
        }
      },

      // Agrupación por año (igual que reservas)
      {
        $group: {
          _id: {
            buildingId: '$_id.buildingId',
            buildingName: '$_id.buildingName',
            year: '$_id.year'
          },
          monthly: {
            $push: {
              month: '$_id.month',
              averageValoration: '$averageValoration'
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          buildingId: '$_id.buildingId',
          buildingName: '$_id.buildingName',
          year: '$_id.year',
          monthly: 1
        }
      },

      { $sort: { buildingName: 1, year: 1 } }
    ]

    const result = await Opinion.aggregate(pipeline)
    res.json(result)
  } catch (err) {
    next(err)
  }
}


export default router

