import express from "express";
import homeController from '../controller/homeController';

let router = express.Router();

const initWebRoute = (app) =>{
    router.get('/', homeController.getHomepage);
    router.get('/user/cart/:TPMA', homeController.getHomeCart)
    router.post('/create-new-food', homeController.createNewFood)
    router.post('/delete-food', homeController.deleteFood);
    router.get('/edit-food/:TPMA', homeController.editFood);
    router.post('/update-food', homeController.updateFood);
    router.get('/add-food-to-cart/:TPMA', homeController.addFoodToCart);
    router.get('/customer/cart', homeController.getHomeCart);
    router.get('/edit-food', homeController.getHomeEditFood);
    router.get('/management', homeController.getHomeManagement);
    router.get('/sign-up', homeController.getHomeSignUp);
    router.get('/customer', homeController.getHomeCustomer);
    router.get('/register', homeController.getHomeRegister);
    router.post('/create-user', homeController.CreateUser);
    router.get('/login', homeController.getHomeLogin);
    router.post('/login-user', homeController.loginUser);
    router.post('/customer/cart/raises', homeController.raisesNumberOfFood);
    router.post('/customer/cart/reduce', homeController.reduceNumberOfFood);
    router.get('/customer/pay-bill', homeController.getHomePayment)
    router.get('/customer/pay-bill/handle-momo', homeController.handlePayment)
    return app.use('/', router);
}


export default initWebRoute;