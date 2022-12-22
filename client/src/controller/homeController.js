import Connection from "../configs/connectDB";
import session from 'express-session'

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
            return res.render('ClientView/index.ejs');  
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
            fetch('http://localhost:1111/api/food', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            })
            .then(response => response.json())
            .then(response => {
                if(response["message"] == 1) {
                    data = response["data"];
                    return res.render('ClientView/home.ejs', {data: data});
                } else {

                }
            })
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
            let data = [];
            fetch('http://localhost:1111/api/cart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"MSSV": MA})
            })
            .then(response => response.json())
            .then(response => {
                if(response["message"] == 1) {
                    data = response["data"];
                    console.log(data);
                    return res.render('ClientView/cart.ejs', {data: data});
                } else {
                    
                }
            })
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
    return res.render('ClientView/cart.ejs');
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
    return res.render('ClientView/login.ejs');
}

let getHomeRegister = async (req, res) => {
    return res.render('ClientView/signup.ejs');
}

let CreateUser = async (req, res) => {
    try {
        let {UNAME, PWD, MSSV, SDT, EMAIL} = req.body;
        console.log(req.body);
        fetch('http://localhost:1111/api/register-user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "UNAME": UNAME, "PWD": PWD, "MSSV": MSSV, "SDT": SDT, "EMAIL": EMAIL})
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if(response["message"] == 1) {
                res.redirect('/');
            }
            else {
                res.redirect('/register');
            }
        })
        
    } catch (error) {
        console.log("ERROR: ", error);
    }
    finally {
        Connection.close();
    }
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
        fetch('http://localhost:1111/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "UNAME": UNAME, "PWD": PWD})
        })
        .then(response => response.json())
        .then(response => {
            if(response["message"] == 1) {
                const data = response["data"];
                req.session.ID = data[0].ID;
                req.session.LOAITK = data[0].LOAITK.trim();
                req.session.MA = data[0].MA;
                res.redirect('/customer');
            }
        })
        
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