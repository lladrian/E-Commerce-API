import { Router } from "express";
import * as PaymentController from '../controllers/payment_controller.js'; // Import the controller

const paymentRoutes = Router();

// cartRoutes.post('/add_cart', CartController.create_cart);
// cartRoutes.get('/get_all_cart_specific_user/:user_id', CartController.get_all_cart_specific_user);
// cartRoutes.get('/get_specific_cart/:id', CartController.get_specific_cart);
// cartRoutes.put('/update_cart/:id', CartController.update_cart);
// cartRoutes.delete('/delete_cart/:id', CartController.delete_cart);

paymentRoutes.post('/checkout', PaymentController.checkout);
paymentRoutes.get('/cancel_order', PaymentController.cancel_order);
paymentRoutes.get('/complete_order', PaymentController.complete_order);



export default paymentRoutes;
