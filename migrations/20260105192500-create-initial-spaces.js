import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialSpaces = [
  {
    _id: new ObjectId('69062d6f9234dbc10e7ec2c5'),
    pictureUrl: 'http://localhost:4000/images/oficinaCatalinas.jpg',
    building: new ObjectId('693f346b0132ea1c2faf42ed'),
    spaceType: 'Oficina',
    description: 'Oficina',
    capacity: 10,
    pricePerDay: 50000,
    isActive: true,
    createdAt: new Date('2025-11-01T15:55:27.496Z'),
    updatedAt: new Date('2025-11-01T15:55:27.496Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('6910b666bcf97b5d88bac4af'),
    pictureUrl: 'http://localhost:4000/images/puestoBarolo.jpg',
    building: new ObjectId('693f34e50132ea1c2faf42ef'),
    spaceType: 'Escritorio co-working',
    description: 'Escritorio co-working',
    capacity: 1,
    pricePerDay: 15000,
    isActive: true,
    createdAt: new Date('2025-11-09T15:42:30.044Z'),
    updatedAt: new Date('2025-11-09T15:42:30.044Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('6916534ad5c705ac44e583bd'),
    pictureUrl: 'http://localhost:4000/images/oficinaBarolo.jpg',
    building: new ObjectId('693f34e50132ea1c2faf42ef'),
    spaceType: 'Oficina',
    description: 'Oficina',
    capacity: 12,
    pricePerDay: 15000,
    isActive: true,
    createdAt: new Date('2025-11-13T21:53:14.870Z'),
    updatedAt: new Date('2025-11-13T21:53:14.870Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('6918a6fec7898fbcf52f6057'),
    pictureUrl: 'http://localhost:4000/images/puestoLibertador.png',
    building: new ObjectId('693f35470132ea1c2faf42f1'),
    spaceType: 'Escritorio co-working',
    description: 'Escritorio co-working',
    capacity: 1,
    pricePerDay: 18000,
    isActive: true,
    createdAt: new Date('2025-11-15T16:14:54.959Z'),
    updatedAt: new Date('2025-11-15T16:14:54.959Z'),
    __v: 0,
  },
  {
  _id: new ObjectId('6918ab48c7898fbcf52f60ad'),
  pictureUrl: 'http://localhost:4000/images/pisoLibertador.png',
  building: new ObjectId('693f35470132ea1c2faf42f1'),
  spaceType: 'Piso',
  description: 'Piso completo',
  capacity: 25,
  pricePerDay: 80000,
  isActive: true,
  createdAt: new Date('2025-11-15T16:33:12.977Z'),
  updatedAt: new Date('2025-11-15T16:33:12.977Z'),
  __v: 0,
},
{
  _id: new ObjectId('691b9e855bd66aaa2127a105'),
  pictureUrl: 'http://localhost:4000/images/puestoDefault.png',
  building: new ObjectId('693f346b0132ea1c2faf42ed'),
  spaceType: 'Escritorio co-working',
  description: 'Escritorio co-working',
  capacity: 1,
  pricePerDay: 20000,
  isActive: true,
  createdAt: new Date('2025-11-17T22:15:33.991Z'),
  updatedAt: new Date('2025-11-17T22:15:33.991Z'),
  __v: 0,
},
{
  _id: new ObjectId('691ba0275bd66aaa2127a116'),
  pictureUrl: 'http://localhost:4000/images/oficinaDefault.png',
  building: new ObjectId('693f346b0132ea1c2faf42ed'),
  spaceType: 'Oficina',
  description: 'Oficina',
  capacity: 10,
  pricePerDay: 60000,
  isActive: true,
  createdAt: new Date('2025-11-17T22:22:31.074Z'),
  updatedAt: new Date('2025-11-17T22:22:31.074Z'),
  __v: 0,
}

]

export const up = async (db) => {
  const count = await db.collection('spaces').countDocuments()
  if (count === 0) {
    await db.collection('spaces').insertMany(initialSpaces)
  }
}

export const down = async (db) => {
  await db.collection('spaces').deleteMany({
    _id: { $in: initialSpaces.map(s => s._id) },
  })
}
