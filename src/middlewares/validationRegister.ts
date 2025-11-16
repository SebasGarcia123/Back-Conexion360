import {body} from 'express-validator';

const validationRegisters = [
    body('user').notEmpty().withMessage('El usuario es requerido').bail().isLength({min: 4}).withMessage('El nombre de usuario debe tener al menos 4 caracteres'),
    body('email').notEmpty().withMessage('El correo es requerido').bail().isEmail().withMessage('El correo no es válido'),
    body('password').notEmpty().withMessage("La contraseña es requerida").bail().isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').bail().matches(/^(?=.*[A-Z])/).withMessage("La contraseña debe tener al menos una mayúscula")
]

export default validationRegisters;