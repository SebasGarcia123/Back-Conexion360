import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialOpinions = [
  {
    _id: new ObjectId('100000000000000000000001'),
    name: 'María López',
    position: 'Product Manager',
    company: 'Mercado Libre',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000001'),
    space: new ObjectId('300000000000000000000001'),
    valoration: 5,
    comment: "La experiencia fue excelente desde el primer día. El espacio es cómodo, bien equipado y la ubicación es ideal para recibir clientes.",
  },
  {
    _id: new ObjectId('100000000000000000000002'),
    name: 'Juan Pérez',
    position: 'CEO',
    company: 'Startup XYZ',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000002'),
    space: new ObjectId('300000000000000000000001'),
    valoration: 4.5,
    comment: "Muy buena atención y un ambiente profesional que facilita el trabajo en equipo. Sin dudas volveríamos a alquilar este espacio.",
  },
  {
    _id: new ObjectId('100000000000000000000003'),
    name: 'Lucía Gómez',
    position: 'UX Designer',
    company: 'Globant',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000003'),
    space: new ObjectId('300000000000000000000002'),
    valoration: 4,
    comment: "El lugar es moderno, limpio y tranquilo. Perfecto para jornadas largas de trabajo y reuniones importantes.",
  },
  {
    _id: new ObjectId('100000000000000000000004'),
    name: 'Carlos Díaz',
    position: 'CTO',
    company: 'Fintech AR',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000004'),
    space: new ObjectId('300000000000000000000002'),
    valoration: 5,
    comment: "Excelente relación precio–calidad. La conectividad y las instalaciones superaron nuestras expectativas.",
  },
  {
    _id: new ObjectId('100000000000000000000005'),
    name: 'Sofía Ramírez',
    position: 'HR Manager',
    company: 'Accenture',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000005'),
    space: new ObjectId('300000000000000000000003'),
    valoration: 4.5,
    comment: "Un espacio muy bien organizado, con todo lo necesario para trabajar cómodos. La gestión del alquiler fue rápida y clara.",
  },
  {
    _id: new ObjectId('100000000000000000000006'),
    name: 'Federico Núñez',
    position: 'Business Analyst',
    company: 'Deloitte',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000006'),
    space: new ObjectId('300000000000000000000003'),
    valoration: 4,
    comment: "Ideal para equipos que buscan un entorno profesional y flexible. La experiencia fue muy positiva.",
  },
  {
    _id: new ObjectId('100000000000000000000007'),
    name: 'Valentina Torres',
    position: 'Marketing Lead',
    company: 'PedidosYa',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000007'),
    space: new ObjectId('300000000000000000000004'),
    valoration: 5,
    comment: "Nos sentimos muy cómodos durante toda la estadía. El espacio está bien cuidado y es fácil de acceder.",
  },
  {
    _id: new ObjectId('100000000000000000000008'),
    name: 'Matías Fernández',
    position: 'Software Engineer',
    company: 'Auth0',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000008'),
    space: new ObjectId('300000000000000000000004'),
    valoration: 4.5,
    comment: "Un lugar funcional y agradable, pensado para trabajar sin interrupciones. Totalmente recomendable.",
  },
  {
    _id: new ObjectId('100000000000000000000009'),
    name: 'Agustina Ríos',
    position: 'Project Manager',
    company: 'IBM',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000009'),
    space: new ObjectId('300000000000000000000005'),
    valoration: 4,
    comment: "El espacio cumplió con todo lo prometido. Excelente infraestructura y muy buena atención.",
  },
  {
    _id: new ObjectId('100000000000000000000010'),
    name: 'Diego Morales',
    position: 'Operations Manager',
    company: 'Santander',
    date: new Date(),
    reservation: new ObjectId('200000000000000000000010'),
    space: new ObjectId('300000000000000000000005'),
    valoration: 5,
    comment: "Una muy buena experiencia en general. El ambiente es profesional y el espacio se adapta a distintas necesidades.",
  },
]

export const up = async (db) => {
  const count = await db.collection('opinions').countDocuments()
  if (count === 0) {
    await db.collection('opinions').insertMany(initialOpinions)
  }
}

export const down = async (db) => {
  await db.collection('opinions').deleteMany({
    _id: { $in: initialOpinions.map(o => o._id) },
  })
}
