import { Router } from "express";
import * as CartController from '../controllers/cart_controller.js'; // Import the controller

const cartRoutes = Router();

cartRoutes.post('/remove_cart_item', CartController.remove_cart_item);
cartRoutes.post('/add_cart', CartController.create_cart);
cartRoutes.get('/get_all_cart_specific_user/:user_id', CartController.get_all_cart_specific_user);
cartRoutes.get('/get_all_ordered_cart_specific_user/:user_id', CartController.get_all_ordered_cart_specific_user);
cartRoutes.get('/get_all_ordered_cart', CartController.get_all_ordered_cart);
cartRoutes.get('/get_specific_cart/:id', CartController.get_specific_cart);
cartRoutes.put('/update_cart', CartController.update_cart);
cartRoutes.delete('/delete_cart/:id', CartController.delete_cart);

export default cartRoutes;
