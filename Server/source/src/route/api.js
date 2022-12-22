import express from "express";
import apiController from '../controller/apiController';

let router = express.Router();

const initAPIRoute = (app) =>{
    router.get('/food', apiController.getFood);
    router.post('/login', apiController.handleLogin); //{UNAME, PWD}
    router.post('/register-user', apiController.handleRegisterUser); //{UNAME, PWD, MSSV, SDT, EMAIL}
    router.post('/add-to-cart', apiController.handleAddToCart); // {TP_MA, MSSV}
    router.post('/cart', apiController.getCart); // MSSV
    router.put('/raise-number-of-food-in-cart', apiController.handleRaiseNumOfFoodInCart);
    router.put('/reduce-number-of-food-in-cart', apiController.handleReduceNumOfFoodInCart);
    router.delete('/remove-from-cart/:GH_ID', apiController.handleRemoveFromCart);
    router.post('/handle-receipt', apiController.handleReceipt);
    router.post('/get-receipt', apiController.getReceipt);
    router.post('/get-detail-receipt', apiController.getDetailReceipt);
    // router.post('/employee/report-on-day', apiController.handleReportnDay)
    return app.use('/api/', router);
}




export default initAPIRoute;