import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialBuildings = [
  {
    _id: new ObjectId('693f2605f2ee306ae57ef21a'),
    name: 'Casa de Seba',
    address: 'Venezuela 2346',
    city: 'Buenos Aires',
    country: 'Argentina',
    latitude: -34.615596,
    longitude: -58.4005126,
    postalCode: 'C1096ABP',
    isActive: true,
    createdAt: new Date('2025-12-14T21:03:01.537Z'),
    updatedAt: new Date('2025-12-14T21:03:01.537Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('693f346b0132ea1c2faf42ed'),
    name: 'Edificio Catalinas Plaza',
    address: 'Ing. Enrique Butty 220',
    city: 'Cdad. Autónoma de Buenos Aires',
    country: 'Argentina',
    latitude: -34.5973452,
    longitude: -58.3729309,
    postalCode: 'C1001AFB',
    isActive: true,
    createdAt: new Date('2025-12-14T22:04:27.937Z'),
    updatedAt: new Date('2025-12-14T22:04:27.937Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('693f34e50132ea1c2faf42ef'),
    name: 'Palacio Barolo',
    address: 'Av. de Mayo 1370',
    city: 'Cdad. Autónoma de Buenos Aires',
    country: 'Argentina',
    latitude: -34.609587,
    longitude: -58.3884231,
    postalCode: 'C1085ABP',
    isActive: true,
    createdAt: new Date('2025-12-14T22:06:29.387Z'),
    updatedAt: new Date('2025-12-14T22:06:29.387Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('693f35470132ea1c2faf42f1'),
    name: 'Centro Empresarial Libertador',
    address: 'Av del Libertador 7208',
    city: 'Cdad. Autónoma de Buenos Aires',
    country: 'Argentina',
    latitude: -34.5466397,
    longitude: -58.4603202,
    postalCode: 'C1429ABP',
    isActive: true,
    createdAt: new Date('2025-12-14T22:08:07.438Z'),
    updatedAt: new Date('2025-12-14T22:08:07.438Z'),
    __v: 0,
  },
]

export const up = async (db) => {
  const count = await db.collection('buildings').countDocuments()
  if (count === 0) {
    await db.collection('buildings').insertMany(initialBuildings)
  }
}

export const down = async (db) => {
  await db.collection('buildings').deleteMany({
    _id: { $in: initialBuildings.map(b => b._id) },
  })
}
