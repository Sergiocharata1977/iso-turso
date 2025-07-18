import express from 'express';
import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  getHistorialProducto
} from '../controllers/productosController.js';

const router = express.Router();

// Rutas de productos
router.get('/', getProductos);
router.get('/:id', getProducto);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);
router.get('/:id/historial', getHistorialProducto);

export default router;
