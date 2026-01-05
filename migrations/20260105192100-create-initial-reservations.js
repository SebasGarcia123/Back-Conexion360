import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialReservations = [
  {
    _id: new ObjectId('69514ae5c6a900898e36048b'),
    userId: new ObjectId('69075cb68fceafd65a38f90f'),
    spaceId: new ObjectId('69062d6f9234dbc10e7ec2c5'),
    dateFrom: new Date('2025-11-28T03:00:00.000Z'),
    dateTo: new Date('2025-11-29T02:59:59.999Z'),
    totalPrice: 50000,
    rentType: 'Dia',
    status: 'Cumplida',
    createdAt: new Date('2025-12-28T15:21:09.900Z'),
    updatedAt: new Date('2025-12-28T16:52:06.314Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('69518e8c08273ad54af021c4'),
    userId: new ObjectId('69075cb68fceafd65a38f90f'),
    spaceId: new ObjectId('6918ab48c7898fbcf52f60ad'),
    dateFrom: new Date('2025-12-28T03:00:00.000Z'),
    dateTo: new Date('2025-12-29T02:59:59.999Z'),
    totalPrice: 80000,
    rentType: 'Dia',
    status: 'Cancelada',
    createdAt: new Date('2025-12-28T20:09:48.031Z'),
    updatedAt: new Date('2025-12-28T20:16:22.960Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('69518eb808273ad54af021dc'),
    userId: new ObjectId('69075cb68fceafd65a38f90f'),
    spaceId: new ObjectId('6916534ad5c705ac44e583bd'),
    dateFrom: new Date('2025-12-10T03:00:00.000Z'),
    dateTo: new Date('2025-12-10T02:59:59.999Z'),
    totalPrice: 15000,
    rentType: 'Dia',
    status: 'Cumplida',
    createdAt: new Date('2025-12-28T20:10:33.000Z'),
    updatedAt: new Date('2025-12-28T20:15:49.588Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('695ae43f9c9e8f50270062ab'),
    userId: new ObjectId('69075cb68fceafd65a38f90f'),
    spaceId: new ObjectId('6910b666bcf97b5d88bac4af'),
    dateFrom: new Date('2026-01-04T03:00:00.000Z'),
    dateTo: new Date('2026-01-05T02:59:59.999Z'),
    totalPrice: 15000,
    rentType: 'Dia',
    status: 'Cumplida',
    createdAt: new Date('2026-01-04T22:05:51.242Z'),
    updatedAt: new Date('2026-01-05T21:31:34.392Z'),
    __v: 0,
  },
]

export const up = async (db) => {
  const count = await db.collection('reservations').countDocuments()
  if (count === 0) {
    await db.collection('reservations').insertMany(initialReservations)
  }
}

export const down = async (db) => {
  await db.collection('reservations').deleteMany({
    _id: { $in: initialReservations.map(r => r._id) },
  })
}
