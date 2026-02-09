import express, { Request, Response, NextFunction } from 'express'
import User from '../schemas/user'
//import multer from "multer";

const router = express.Router()

// Rutas de usuarios
router.get('/', getAllUsers)

async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.find({ isActive: true }).populate('role')
    res.send(users)
  } catch (err) {
    next(err)
  }
}

// Configuración multer para subir imágenes
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

// Ruta para subir imágenes
// router.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });
//   const imageUrl = `http://localhost:4000/images/${req.file.filename}`;
//   res.json({ imageUrl });
// });

export default router