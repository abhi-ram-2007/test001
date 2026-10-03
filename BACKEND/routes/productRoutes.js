import express from 'express';
import { createProducts, getAllProducts, updateProduct, deleteProduct,getSingleProduct } from '../controllers/productController.js';
import { isAuthenticated, roleBasedAccess } from '../middleware/userAuth.js';
const router = express.Router();

router.route("/products").get(isAuthenticated, getAllProducts).post(isAuthenticated,roleBasedAccess('admin'), createProducts);
router.route("/product/:id").put(isAuthenticated, updateProduct).delete(isAuthenticated, deleteProduct).get(isAuthenticated, getSingleProduct);



export default router;