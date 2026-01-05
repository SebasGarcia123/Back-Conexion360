import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialUsers = [
  {
    _id: new ObjectId('69075cb68fceafd65a38f90f'),
    user: 'majo',
    email: 'majomarre@yahoo.com.ar',
    password: '$2b$10$Jg6um09HOwOrXA9WcAF0wuPWcGRmnlM70ee1GvTpZ01pw8.dqzuFu', //1234
    role: new ObjectId('000000000000000000000001'),//cliente
    firstName: 'majo',
    lastName: 'marre',
    phone: '1165456033',
    document: '27259873768',
    isActive: true,
    createdAt: new Date('2025-11-02T13:29:26.553Z'),
    updatedAt: new Date('2025-11-02T13:29:26.553Z'),
    __v: 0,
  },
  {
    _id: new ObjectId('6907623f8fceafd65a38f915'),
    user: 'seba',
    email: 'seba@mail.com',
    password: '$2b$10$Jg6um09HOwOrXA9WcAF0wuPWcGRmnlM70ee1GvTpZ01pw8.dqzuFu', //1234
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
  {
    _id: new ObjectId('6907bce9efb1c5ae5664860d'),
    user: 'gael',
    email: 'gael@mail.com',
    password: '$2b$10$Jg6um09HOwOrXA9WcAF0wuPWcGRmnlM70ee1GvTpZ01pw8.dqzuFu',//1234
    role: new ObjectId('000000000000000000000001'), //Cliente
    firstName: 'gael',
    lastName: 'garcia',
    phone: '1156669592',
    document: '20455450798',
    isActive: true,
    createdAt: new Date('2025-11-02T20:19:53.529Z'),
    updatedAt: new Date('2025-11-02T20:19:53.529Z'),
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
