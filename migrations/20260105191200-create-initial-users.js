import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialUsers = [
  {
    _id: new ObjectId('69075cb68fceafd65a38f90f'),
    user: 'cliente',
    email: 'cliente@mail.com.ar',
    password: '$2b$10$1tUnB2HGfgR1nTG4vElFseGb4cAIeOzTYmuTljH.IyGFqqHPuWaXa', //Progra03
    role: new ObjectId('000000000000000000000001'),//cliente
    firstName: 'Seba',
    lastName: 'Garcia',
    phone: '1130044057',
    document: '30307769',
    isActive: true,
    createdAt: new Date('2025-11-02T13:29:26.553Z'),
    updatedAt: new Date('2025-11-02T13:29:26.553Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('6907623f8fceafd65a38f915'),
    user: 'admin',
    email: 'admin@mail.com',
    password: '$2b$10$1tUnB2HGfgR1nTG4vElFseGb4cAIeOzTYmuTljH.IyGFqqHPuWaXa', //Progra03
    role: new ObjectId('000000000000000000000000'), //admin
    firstName: 'seba',
    lastName: 'garcia',
    phone: '1130044057',
    document: '20303077694',
    isActive: true,
    createdAt: new Date('2025-11-02T13:53:03.034Z'),
    updatedAt: new Date('2025-11-02T13:53:03.034Z'),
    __v: 0,
  },
]

export const up = async (db) => {
  const count = await db.collection('users').countDocuments()
  if (count === 0) {
    await db.collection('users').insertMany(initialUsers)
  }
}

export const down = async (db) => {
  await db.collection('users').deleteMany({
    _id: { $in: initialUsers.map(u => u._id) },
  })
}
