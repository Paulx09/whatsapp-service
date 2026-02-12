import { body, validationResult } from 'express-validator';

export const validateSendChunk = [
  // campania_id
  body('campania_id')
    .isInt({ min: 1 })
    .withMessage('campania_id debe ser un entero >= 1'),
  
  // chunk_number
  body('chunk_number')
    .isInt({ min: 1 })
    .withMessage('chunk_number debe ser un entero >= 1'),
  
  // id_servicio
  body('id_servicio')
    .isInt({ min: 1 })
    .withMessage('id_servicio debe ser un entero >= 1'),
  
  // parrafo
  body('parrafo')
    .isString()
    .notEmpty()
    .withMessage('parrafo es requerido y no puede estar vacío')
    .trim(),
  
  // image_url
  body('image_url')
    .isString()
    .notEmpty()
    .withMessage('image_url es requerida')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('image_url debe ser una URL válida (http/https)'),
  
  // recipients array
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('recipients debe ser un array con al menos 1 elemento'),
  
  // recipients.*.id_modalservicio
  body('recipients.*.id_modalservicio')
    .isInt({ min: 1 })
    .withMessage('recipients[].id_modalservicio debe ser un entero >= 1'),
  
  // recipients.*.nombre
  body('recipients.*.nombre')
    .isString()
    .notEmpty()
    .withMessage('recipients[].nombre es requerido y no puede estar vacío')
    .trim(),
  
  // recipients.*.telefono
  body('recipients.*.telefono')
    .isString()
    .notEmpty()
    .withMessage('recipients[].telefono es requerido y no puede estar vacío')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('recipients[].telefono debe contener solo dígitos, espacios, guiones, paréntesis y signo +'),
  
  // Middleware para retornar errores en formato correcto
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        message: 'Body inválido',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];
