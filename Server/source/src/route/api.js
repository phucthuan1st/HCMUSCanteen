import express, { Router } from "express";
import apiController from '../controller/apiController';

let router = express.Router();

const initAPIRoute = (app) =>{
    router.get('/food', apiController.getFood);
    router.post('/login', apiController.handleLogin); //{UNAME, PWD}
    router.post('/register-user', apiController.handleRegisterUser); //{UNAME, PWD, MSSV, SDT, EMAIL}
    router.post('/add-to-cart', apiController.handleAddToCart); // {TP_MA, MSSV}
    router.post('/cart', apiController.getCart); // MSSV
    router.put('/raise-number-of-food-in-cart', apiController.handleRaiseNumOfFoodInCart); //{GH_ID} 
    router.put('/reduce-number-of-food-in-cart', apiController.handleReduceNumOfFoodInCart);//{GH_ID}
    router.post('/remove-from-cart', apiController.handleRemoveFromCart); //params GH_ID 
    router.post('/handle-receipt', apiController.handleReceipt); //{MSSV}
    router.post('/get-receipt', apiController.getReceipt); //{MSSV}
    router.post('/get-detail-receipt', apiController.getDetailReceipt); //{HD_ID} 
    router.post('/employee/report-on-day', apiController.handleReportOnDay); //{DAY, MONTH, YEAR}
    router.post('/employee/report-on-day-of-employee', apiController.handleReportOnDayOfEmployee); //{NV_ID, DAY, MONTH, YEAR} 
    router.post('/employee/report-in-month', apiController.handleReportInMonth); //MONTH, YEAR
    router.post('/manager/add-cooked-food', apiController.handleAddCookedFood);
    router.post('/manager/add-fast-food', apiController.handleAddFastFood);

    router.post('/employee/info', apiController.getEmployeeInfo);
    return app.use('/api/', router);
}




export default initAPIRoute;