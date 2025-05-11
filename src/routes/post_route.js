import { Router } from "express";
import * as PostController from '../controllers/post_controller.js'; // Import the controller

const postRoutes = Router();

postRoutes.post('/add_post', PostController.create_post);
postRoutes.get('/get_all_post', PostController.get_all_post);
postRoutes.get('/get_specific_post/:id', PostController.get_specific_post);
postRoutes.put('/update_post/:id', PostController.update_post);
postRoutes.delete('/delete_post/:id', PostController.delete_post);

export default postRoutes;
