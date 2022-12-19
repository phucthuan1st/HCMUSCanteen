import express from "express";
import apiController from '../controller/apiController';

let router = express.Router();

const initAPIRoute = (app) =>{
    router.get('/food', apiController.getFood);
    router.post('/login', apiController.handleLogin);
    router.post('/register-user', apiController.handleRegisterUser);
    router.post('/add-to-cart', apiController.handleAddToCart);
    router.post('/cart', apiController.getCart);
    return app.use('/api/', router);
}




export default initAPIRoute;