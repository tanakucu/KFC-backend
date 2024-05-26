import express from 'express';
import { getProducts, createProduct } from '../controller/routeContoller.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', createProduct);

export default router;
