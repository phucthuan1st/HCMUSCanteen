import express from "express";
import homeController from '../controller/homeController';

let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', homeController.getHomepage);
    router.get('/user/cart', homeController.getHomeCart)
    router.post('/create-new-food', homeController.createNewFood)
    router.post('/delete-food', homeController.deleteFood);
    router.get('/edit-food/:TPMA', homeController.editFood);
    router.post('/update-food', homeController.updateFood);
    router.post('/add-food-to-cart', homeController.addFoodToCart);
    router.get('/customer/cart', homeController.getHomeCart);
    router.get('/edit-food', homeController.getHomeEditFood);
    router.get('/management', homeController.getHomeManagement);
    router.get('/sign-in', homeController.getHomeSignUp);
    router.get('/customer', homeController.getHomeCustomer);
    router.get('/register', homeController.getHomeRegister);
    router.post('/create-user', homeController.CreateUser);
    router.get('/login', homeController.getHomeLogin);
    router.post('/login-user', homeController.loginUser);
    router.post('/customer/cart/raises', homeController.raisesNumberOfFood);
    router.post('/customer/cart/reduce', homeController.reduceNumberOfFood);
    router.post('/customer/cart/delete', homeController.deleteNumberOfFood);
    router.get('/customer/pay-bill', homeController.getHomePayment)
    router.get('/customer/pay-bill/handle-momo', homeController.handlePayment);
    //log out
    router.get('/logout', homeController.getHomeLogout);
    //admin
    router.get('/admin/login', homeController.getLoginAdmin);
    router.post('/admin/handle-login', homeController.handleloginAdmin);
    router.get('/admin', homeController.gethomeAdmin);
    router.get('/admin/food', homeController.getDataFoodAdmin);
    router.post('/admin/add-to-cart', homeController.handleAdminAddToCart);
    router.post('/admin/delete-from-cart', homeController.handleAdminDeleteFromCart);
    router.get('/employee', homeController.gethomeEmployee);
    // router.get('/employee/day-report', homeController.getEmployeeDayReport);
    return app.use('/', router);
}


export default initWebRoute;
