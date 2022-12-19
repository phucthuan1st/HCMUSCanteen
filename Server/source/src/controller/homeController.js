import Connection from "../configs/connectDB";
import session from 'express-session'

let carts = [];

let getHomepage = async (req, res) => {
    //logic
    try {
        let {ID, LOAITK, MA} = req.session;
        if(LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        }
        else if (LOAITK === 'KHACHHANG'.trim()) {
            return res.redirect('/customer');
        }
        else if (LOAITK === 'ADMIN'.trim()){
            return res.redirect('/admin');
        }
        else{
            return res.render('login/homePage.ejs');  
        }
    } catch (error) {
         console.log("ERROR: ", error);
    }
}

let getHomeCustomer  = async (req, res) => {
    //logic
    try {
        let {ID, LOAITK} = req.session;
        if(LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        }
        else if (LOAITK === 'KHACHHANG'.trim()) {
            let data = [];
            await Connection.connect();
            let data_food = await Connection.request().query('SELECT * FROM dbo.THUCPHAM');
            data = data_food.recordset;
            return res.render('customer/customer.ejs', {data: data, title: "FOOD"});
        }
        else if (LOAITK === 'ADMIN'.trim()){
            return res.redirect('/admin');
        }
        else{
            return res.redirect('/');  
        }
    } catch (error) {
         console.log("ERROR: ", error);
    }
}

let getHomeCart = async (req, res) => {
    try {
        let {ID, LOAITK, MA} = req.session;
        console.log(MA)
        if(LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        }
        else if (LOAITK === 'KHACHHANG'.trim()) {
            await Connection.connect();
            let data_cart = Connection.request().query(`SELECT GH.TP_MA, GH.TP_MA ,TP.TP_TEN, TP.TP_LOAI, GH.GH_SOLUONG, GH.GH_TONGTIEN FROM dbo.GIOHANG GH, dbo.THUCPHAM TP WHERE GH.TP_MA = TP.TP_MA AND KH_MA = ${MA}`);
            let data = (await data_cart).recordset;
            console.log(data);
            let totalPrice = 0;
            data.forEach((object) => {
                totalPrice += object.GH_SOLUONG * object.GH_TONGTIEN;
            });
            req.session.totalPrice = totalPrice;
            return res.render('customer/cart.ejs', {data: data, title: "Cart", totalPrice: totalPrice});
        }
        else if (LOAITK === 'ADMIN'.trim()){
            return res.redirect('/admin');
        }
        else{
            return res.redirect('/');  
        }
    } catch (error) {
         console.log("ERROR: ", error);
    }
}

let createNewFood = async (req, res) => {
    let {TP_TEN, TP_LOAI, TP_GIA} = req.body;
    await Connection.connect();
    Connection.request().query(`INSERT INTO THUCPHAM VALUES(N'${TP_TEN}', N'${TP_LOAI}', ${TP_GIA})`);
    return res.redirect('/');
}

let deleteFood = async (req, res) => {
    let TPMA = req.body.TP_MA;
    await Connection.connect();
    Connection.request().query(`DELETE FROM THUCPHAM WHERE TP_MA = ${TPMA}`)
    return res.redirect('/edit-food');
}

let editFood = async (req, res) => {
    let data = [];
    let TP_MA = req.params.TPMA;
    await Connection.connect();
    let data_food = Connection.request().query(`SELECT * FROM dbo.THUCPHAM WHERE TP_MA = ${TP_MA}`);
    data = (await data_food).recordset;
    return res.render('admin/updateFood.ejs', {data: data[0]})
}

let updateFood = async (req, res) => {
    let {TP_TEN, TP_LOAI, TP_GIA, TP_MA} = req.body;
    await Connection.connect();
    Connection.request().query(`update dbo.THUCPHAM set TP_TEN = N'${TP_TEN}', TP_LOAI = N'${TP_LOAI}', TP_GIA = '${TP_GIA}' WHERE TP_MA = ${TP_MA}`)
    return res.redirect('/edit-food');
}

let addFoodToCart = async (req, res) => {
    let {ID, LOAITK, MA} = req.session;
    let TP_MA = req.params.TPMA;
    let data = [];
    await Connection.connect();
    let data_food = Connection.request().query(`SELECT * FROM dbo.THUCPHAM WHERE TP_MA = ${TP_MA}`);
    data = (await data_food).recordset;
    let data_cart= Connection.request().query(`SELECT * FROM dbo.GIOHANG WHERE KH_MA = ${MA} AND TP_MA = ${TP_MA}`);
    if (((await data_cart).recordset).length === 0) {
        Connection.request().query(`INSERT INTO dbo.GIOHANG(KH_MA, TP_MA,GH_SOLUONG, GH_TONGTIEN) VALUES (${MA}, ${data[0].TP_MA}, 1, ${data[0].TP_GIA})`);
    }
    else {
        let number = (await data_cart).recordset;
        console.log(number);
        Connection.request().query(`UPDATE dbo.GIOHANG SET GH_SOLUONG = ${number[0].GH_SOLUONG + 1} WHERE KH_MA = ${MA} AND TP_MA = ${data[0].TP_MA}`);
    }
    
    return res.redirect('/customer');
}

let getPageCart = async (req, res) => {
    let totalPrice = 0;
    carts.forEach((object) => {
        totalPrice += object.number * object.TP_GIA;
    });
    return res.render('customer/cart.ejs', {data: carts, title: "Cart", totalPrice: totalPrice})
}

let getHomeEditFood = async (req, res) => {
    let data = [];
    await Connection.connect();
    let data_food = await Connection.request().query('SELECT * FROM dbo.THUCPHAM');
    data = data_food.recordset;
    return res.render('admin/editFood.ejs', {data: data, title: "FOOD"});
}

let getHomeManagement = async (req, res) => {
    return res.render('admin/management.ejs');
}

let getHomeSignUp = async (req, res) => {
    return res.render('login/signUp.ejs');
}

let getHomeRegister = async (req, res) => {
    return res.render('login/register.ejs');
}

let CreateUser = async (req, res) => {
    let {UNAME, PWD, MSSV, SDT, EMAIL} = req.body;
    await Connection.connect();
    Connection.request().query(`EXEC dbo.sp_themTaiKhoan @UN = '${UNAME}', @PW = '${PWD}', @MSSV = '${MSSV}', @SDT = '${SDT}', @EMAIL = N'${EMAIL}'`);
    return res.redirect(`/`);
}

let getHomeLogin = async (req, res) => {
    try {
        let {ID, LOAITK} = req.session;
        if(LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        }
        else if (LOAITK === 'KHACHHANG'.trim()) {
            return res.redirect('/customer');
        }
        else if (LOAITK === 'ADMIN'.trim()){
            return res.redirect('/admin');
        }
        else{
            return res.render('login/login.ejs');
        }
    } catch (error) {
         console.log("ERROR: ", error);
    }
}

let loginUser = async (req, res) => {
    // xu ly dang nhap
    try {
        let {UNAME, PWD} = req.body;
        await Connection.connect();
        let data_login = Connection.request().query(`EXEC dbo.sp_xulyDangNhap @UN = '${UNAME}', @PW = '${PWD}'`);
        let data = (await data_login).recordset;
        if(data.length === 1) {
            let loaitk = data[0].LOAITK.trim();
            if(loaitk === 'NHANVIEN'.trim()) {
                req.session.ID = data[0].ID;
                req.session.LOAITK = data[0].LOAITK.trim();
                req.session.MA = data[0].MA;
                return res.redirect('/employee');
            }
            else if (loaitk === 'KHACHHANG'.trim()) {
                req.session.ID = data[0].ID;
                req.session.LOAITK = data[0].LOAITK.trim();
                req.session.MA = data[0].MA;
                console.log(req.session);
                return res.redirect('/customer');
            }
            else if (loaitk === 'ADMIN'.trim()){
                req.session.ID = data[0].ID;
                req.session.LOAITK = data[0].LOAITK.trim();
                req.session.MATK = data[0].MA.trim();
                return res.redirect('/admin');
            }
        }
        
        return res.redirect('/login');
    } catch (error) {
        console.log("ERROR: ", error);
    }
    finally {
        Connection.close();
    }
}

let reduceNumberOfFood = async (req, res) => {
    let {ID, LOAITK, MA} = req.session;
    await Connection.connect();
    let {TP_MA} = req.body;
    let data_cart= Connection.request().query(`SELECT * FROM dbo.GIOHANG WHERE KH_MA = ${MA} AND TP_MA = ${TP_MA}`);
    let data = (await data_cart).recordset;
    if(data[0].GH_SOLUONG > 1) {
        Connection.request().query(`UPDATE dbo.GIOHANG SET GH_SOLUONG = ${data[0].GH_SOLUONG - 1} WHERE KH_MA = ${MA} AND TP_MA = ${data[0].TP_MA}`);
    }
    else {
        Connection.request().query(`DELETE dbo.GIOHANG  WHERE KH_MA = ${MA} AND TP_MA = ${data[0].TP_MA}`);
    }
    return res.redirect('/customer/cart');
}

let raisesNumberOfFood = async (req, res) => {
    let {ID, LOAITK, MA} = req.session;
    await Connection.connect();
    let {TP_MA} = req.body;
    let data_cart= Connection.request().query(`SELECT * FROM dbo.GIOHANG WHERE KH_MA = ${MA} AND TP_MA = ${TP_MA}`);
    let data = (await data_cart).recordset;
    Connection.request().query(`UPDATE dbo.GIOHANG SET GH_SOLUONG = ${data[0].GH_SOLUONG + 1} WHERE KH_MA = ${MA} AND TP_MA = ${data[0].TP_MA}`);
    return res.redirect('/customer/cart');
}

let getHomePayment = async (req, res) => {
    try {
        let {ID, LOAITK, MA} = req.session;
        console.log(MA)
        if(LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        }
        else if (LOAITK === 'KHACHHANG'.trim()) {
            return res.render('customer/payment.ejs', {totalPrice: req.session.totalPrice});
        }
        else if (LOAITK === 'ADMIN'.trim()){
            return res.redirect('/admin');
        }
        else{
            return res.redirect('/');  
        }
    } catch (error) {
         console.log("ERROR: ", error);
    }
}

let handlePayment = async (req, res) => {
    let {ID, LOAITK, MA} = req.session;
    await Connection.connect();
    Connection.request().query(`EXEC dbo.sp_datHang @KH_MA = ${MA}, @HINHTHUCTHANHTOAN = N'Thanh toán trực tuyến'`);
    return res.render('customer/receipt.ejs');
}


module.exports = {
    getHomepage,
    getHomeCart,
    createNewFood,
    deleteFood,
    editFood,
    updateFood,
    addFoodToCart,
    getPageCart,
    getHomeEditFood,
    getHomeManagement,
    getHomeSignUp,
    getHomeCustomer,
    getHomeRegister,
    CreateUser,
    getHomeLogin,
    loginUser,
    raisesNumberOfFood,
    reduceNumberOfFood,
    getHomePayment,
    handlePayment
}