import express from "express";
import apiController from '../controller/apiController';

let router = express.Router();

const initAPIRoute = (app) =>{
    router.get('/food', apiController.getFood);
    router.post('/login', apiController.handleLogin);
    router.post('/register-user', apiController.handleRegisterUser);
    router.post('/add-to-cart', apiController.handleAddToCart);
    router.post('/cart', apiController.getCart);
    router.put('/raise-number-of-food-in-cart', apiController.handleRaiseNumOfFoodInCart);
    router.put('/reduce-number-of-food-in-cart', apiController.handleReduceNumOfFoodInCart);
    router.delete('/remove-from-cart/:GH_ID', apiController.handleRemoveFromCart);
    router.post('/handle-receipt', apiController.handleReceipt);
    router.post('/get-receipt', apiController.getReceipt);
    router.post('/get-detail-receipt', apiController.getDetailReceipt);
    return app.use('/api/', router);
}




export default initAPIRoute;