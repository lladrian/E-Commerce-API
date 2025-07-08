import { Router } from "express";
import * as ProductController from '../controllers/product_controller.js'; // Import the controller

const productRoutes = Router();

productRoutes.post('/add_product', ProductController.create_product);
productRoutes.get('/get_all_product', ProductController.get_all_product);
productRoutes.get('/get_specific_product/:id', ProductController.get_specific_product);
productRoutes.put('/update_product/:id', ProductController.update_product);
productRoutes.delete('/delete_product/:id', ProductController.delete_product);

export default productRoutes;
