import Connection from "../configs/connectDB";
import session from 'express-session'
import { request } from "express";

let getHomepage = async(req, res) => {
    //logic
    try {
        let { ID, LOAITK, MA } = req.session;
        if (LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/admin');
        } else if (LOAITK === 'KHACHHANG'.trim()) {
            return res.redirect('/customer');
        } else if (LOAITK === 'ADMIN'.trim()) {
            return res.redirect('/admin');
        } else {
            return res.render('ClientView/index.ejs');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

let getHomeCustomer = async(req, res) => {
    //logic
    try {
        let { ID, LOAITK } = req.session;
        if (LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        } else if (LOAITK === 'KHACHHANG'.trim()) {
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
                    if (response["message"] == 1) {
                        data = response["data"];
                        return res.render('ClientView/home.ejs', { data: data });
                    } else {

                    }
                })
        } else if (LOAITK === 'ADMIN'.trim()) {
            return res.redirect('/admin');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

let getHomeCart = async(req, res) => {
    try {
        let { LOAITK, MSSV } = req.session;
        if (LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        } else if (LOAITK === 'KHACHHANG'.trim()) {
            let data = [];
            fetch('http://localhost:1111/api/cart', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "MSSV": MSSV })
                })
                .then(response => response.json())
                .then(response => {
                    if (response["message"] == 1) {
                        data = response["data"];
                        let totalPrice = 0;
                        data.forEach(element => { totalPrice += element.GH_TONGTIEN });
                        req.session.totalPrice = totalPrice;
                        return res.render('ClientView/cart.ejs', { data: data });
                    } else {

                    }
                })
        } else if (LOAITK === 'ADMIN'.trim()) {
            return res.redirect('/admin');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

let createNewFood = async(req, res) => {
    let { TP_TEN, TP_LOAI, TP_GIA } = req.body;
    await Connection.connect();
    Connection.request().query(`INSERT INTO THUCPHAM VALUES(N'${TP_TEN}', N'${TP_LOAI}', ${TP_GIA})`);
    return res.redirect('/');
}

let deleteFood = async(req, res) => {
    let TPMA = req.body.TP_MA;
    await Connection.connect();
    Connection.request().query(`DELETE FROM THUCPHAM WHERE TP_MA = ${TPMA}`)
    return res.redirect('/edit-food');
}

let editFood = async(req, res) => {
    let data = [];
    let TP_MA = req.params.TPMA;
    await Connection.connect();
    let data_food = Connection.request().query(`SELECT * FROM dbo.THUCPHAM WHERE TP_MA = ${TP_MA}`);
    data = (await data_food).recordset;
    return res.render('admin/updateFood.ejs', { data: data[0] })
}

let updateFood = async(req, res) => {
    let { TP_TEN, TP_LOAI, TP_GIA, TP_MA } = req.body;
    await Connection.connect();
    Connection.request().query(`update dbo.THUCPHAM set TP_TEN = N'${TP_TEN}', TP_LOAI = N'${TP_LOAI}', TP_GIA = '${TP_GIA}' WHERE TP_MA = ${TP_MA}`)
    return res.redirect('/edit-food');
}

let addFoodToCart = async(req, res) => {
    let { LOAITK, MSSV } = req.session;
    let { TP_MA } = req.body;
    let data = [];
    fetch('http://localhost:1111/api/add-to-cart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "MSSV": MSSV, "TP_MA": TP_MA })
        })
        .then(response => response.json())
        .then(response => {
            console.log("response.message:   ", response.message);
            if (response["message"] == 1) {
                data = response["data"];
                return res.redirect('/customer');
            } else {
                return res.redirect('/customer');
            }
        })
}

let getPageCart = async(req, res) => {
    return res.render('ClientView/cart.ejs');
}

let getHomeEditFood = async(req, res) => {
    let data = [];
    await Connection.connect();
    let data_food = await Connection.request().query('SELECT * FROM dbo.THUCPHAM');
    data = data_food.recordset;
    return res.render('admin/editFood.ejs', { data: data, title: "FOOD" });
}

let getHomeManagement = async(req, res) => {
    return res.render('admin/management.ejs');
}

let getHomeSignUp = async(req, res) => {
    return res.render('ClientView/login.ejs');
}

let getHomeRegister = async(req, res) => {
    return res.render('ClientView/signup.ejs');
}

let CreateUser = async(req, res) => {
    try {
        let { UNAME, PWD, MSSV, SDT, EMAIL } = req.body;
        console.log(req.body);
        fetch('http://localhost:1111/api/register-user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "UNAME": UNAME, "PWD": PWD, "MSSV": MSSV, "SDT": SDT, "EMAIL": EMAIL })
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response["message"] == 1) {
                    res.redirect('/');
                } else {
                    res.redirect('/register');
                }
            })

    } catch (error) {
        console.log("ERROR: ", error);
    } finally {
        Connection.close();
    }
}

let getHomeLogin = async(req, res) => {
    try {
        let { ID, LOAITK } = req.session;
        if (LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        } else if (LOAITK === 'KHACHHANG'.trim()) {
            return res.redirect('/customer');
        } else if (LOAITK === 'ADMIN'.trim()) {
            return res.redirect('/admin');
        } else {
            return res.render('ClientView/login.ejs');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

let loginUser = async(req, res) => {
    // xu ly dang nhap
    try {
        let { UNAME, PWD } = req.body;
        fetch('http://localhost:1111/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "UNAME": UNAME, "PWD": PWD })
            })
            .then(response => response.json())
            .then(response => {
                if (response["message"] == 1 && response["data"].length > 0) {
                    const data = response["data"];
                    req.session.LOAITK = data[0].LOAITK.trim();
                    req.session.MA = data[0].MA;
                    req.session.MSSV = data[0].MSSV;
                    res.redirect('/customer');
                } else {
                    return res.redirect('/login');
                }
            })

    } catch (error) {
        console.log("ERROR: ", error);
    } finally {
        Connection.close();
    }
}

let reduceNumberOfFood = async(req, res) => {
    let { LOAITK, MA } = req.session;
    let { GH_ID } = req.body;
    fetch('http://localhost:1111/api/reduce-number-of-food-in-cart', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "GH_ID": GH_ID })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response["message"] == 1) {
                return res.redirect('/customer/cart');
            } else {
                return res.redirect('/customer');
            }
        })
}

let deleteNumberOfFood = async(req, res) => {
    let { LOAITK, MSSV } = req.session;
    let { GH_ID } = req.body;
    fetch('http://localhost:1111/api/remove-from-cart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "GH_ID": GH_ID })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response["message"] == 1) {
                return res.redirect('/customer/cart');
            } else {
                return res.redirect('/customer');
            }
        })
}

let raisesNumberOfFood = async(req, res) => {
    let { ID, LOAITK, MA } = req.session;
    await Connection.connect();
    let { TP_MA } = req.body;
    let data_cart = Connection.request().query(`SELECT * FROM dbo.GIOHANG WHERE KH_MA = ${MA} AND TP_MA = ${TP_MA}`);
    let data = (await data_cart).recordset;
    Connection.request().query(`UPDATE dbo.GIOHANG SET GH_SOLUONG = ${data[0].GH_SOLUONG + 1} WHERE KH_MA = ${MA} AND TP_MA = ${data[0].TP_MA}`);
    return res.redirect('/customer/cart');
}

let getHomePayment = async(req, res) => {
    try {
        let { ID, LOAITK, MA } = req.session;
        console.log(MA)
        if (LOAITK === 'NHANVIEN'.trim()) {
            return res.redirect('/employee');
        } else if (LOAITK === 'KHACHHANG'.trim()) {
            return res.render('ClientView/payment.ejs', { totalPrice: req.session.totalPrice });
        } else if (LOAITK === 'ADMIN'.trim()) {
            return res.redirect('/admin');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

let handlePayment = async(req, res) => {
        try {
            let { LOAITK, MSSV } = req.session;
            if (LOAITK === 'NHANVIEN'.trim()) {
                return res.redirect('/employee');
            } else if (LOAITK === 'KHACHHANG'.trim()) {
                let data = [];
                fetch('http://localhost:1111/api/cart', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "MSSV": MSSV })
                    })
                    .then(response => response.json())
                    .then(response => {
                        if (response["message"] == 1) {
                            data = response["data"];
                            let totalPrice = 0;
                            data.forEach(element => { totalPrice += element.GH_TONGTIEN });
                            req.session.totalPrice = totalPrice;
                            return res.render('ClientView/cart.ejs', { data: data });
                        } else {

                        }
                    })
            } else if (LOAITK === 'ADMIN'.trim()) {
                return res.redirect('/admin');
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            console.log("ERROR: ", error);
        }

    }
    //
let getHomeLogout = async(req, res) => {
        const { LOAITK } = req.session;
        req.session.destroy();
        if (LOAITK === 'NHANVIEN' || LOAITK === 'ADMIN') {
            return res.redirect('/admin');
        } else
            return res.redirect('/');
    }
    // admin
let getLoginAdmin = async(req, res) => {
    let { LOAITK } = req.session;
    if (LOAITK === 'ADMIN'.trim() || LOAITK === 'NHANVIEN'.trim()) {
        return res.redirect('/admin');
    } else {
        return res.render('Web_cashier/login/login.ejs');
    }
}

let handleloginAdmin = async(req, res) => {
    try {
        let { UNAME, PWD } = req.body;
        fetch('http://localhost:1111/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "UNAME": UNAME, "PWD": PWD })
            })
            .then(response => response.json())
            .then(response => {
                if (response["message"] == 1 && response["data"].length > 0) {
                    const data = response["data"];
                    if (data[0].LOAITK.trim() === 'ADMIN') {
                        req.session.LOAITK = data[0].LOAITK.trim();
                        req.session.MA = data[0].MA;
                        req.session.TEN = "ADMIN";
                        res.redirect('/admin');
                    } else if (data[0].LOAITK.trim() === 'NHANVIEN') {
                        req.session.MA = data[0].MA;
                        req.session.LOAITK = data[0].LOAITK.trim();
                        req.session.TEN = data[0].TEN;
                        console.log(req.session);
                        res.redirect('/admin');
                    } else {
                        return res.redirect('/admin/login');
                    }
                } else {
                    return res.redirect('/admin/login');
                }
            })

    } catch (error) {
        console.log("ERROR: ", error);
    } finally {
        Connection.close();
    }
}

let gethomeAdmin = async(req, res) => {
    console.log(req.session);
    let { LOAITK, MA } = req.session;
    if (LOAITK === 'ADMIN' || LOAITK === 'NHANVIEN'.trim()) {
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
                if (response["message"] == 1) {
                    data = response["data"];
                    data = data.filter(element => {
                        return element.TP_LOAI === 'Đồ nấu';
                    });
                    // api cart
                    let data2 = [];
                    fetch('http://localhost:1111/api/cart', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "MSSV": MA })
                        })
                        .then(response2 => response2.json())
                        .then(response2 => {
                            if (response2["message"] == 1) {
                                data2 = response2["data"];
                                let totalPrice = 0;
                                data2.forEach(element => { totalPrice += element.GH_TONGTIEN });
                                return res.render('Web_cashier/Cashier/Cashier_Cook.ejs', { data: data, cart: data2, totalPrice: totalPrice, ma: req.session.MA, ten: req.session.TEN });
                            } else {
                                return res.redirect('/admin/login');
                            }
                        })
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
        let {LOAITK, MSSV} = req.session;
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
                body: JSON.stringify({"MSSV": MSSV})
            })
            .then(response => response.json())
            .then(response => {
                if(response["message"] == 1) {
                    data = response["data"];
                    let totalPrice = 0;
                    data.forEach(element => { totalPrice += element.GH_TONGTIEN });
                    req.session.totalPrice = totalPrice;
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
    let {LOAITK, MSSV} = req.session;
    let {TP_MA} = req.body;
    let data = [];
    fetch('http://localhost:1111/api/add-to-cart', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"MSSV": MSSV, "TP_MA": TP_MA})
    })
    .then(response => response.json())
    .then(response => {
        console.log("response.message:   ", response.message);
        if(response["message"] == 1) {
            data = response["data"];
            return res.redirect('/customer');
        } else {
            return res.redirect('/customer');
        }
    })
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
            return res.render('ClientView/login.ejs');
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
            if(response["message"] == 1 && response["data"].length > 0) {
                const data = response["data"];
                req.session.LOAITK = data[0].LOAITK.trim();
                req.session.MA = data[0].MA;
                req.session.MSSV = data[0].MSSV;
                res.redirect('/customer');
            }
            else {
                return res.redirect('/login');
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
    let {LOAITK, MA} = req.session;
    let {GH_ID} = req.body;
    fetch('http://localhost:1111/api/reduce-number-of-food-in-cart', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"GH_ID": GH_ID})
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response["message"] == 1) {
            return res.redirect('/customer/cart');
        } else {
            return res.redirect('/customer');
        }
    })
}

let deleteNumberOfFood = async (req, res) => {
    let {LOAITK, MSSV} = req.session;
    let {GH_ID} = req.body;
    fetch('http://localhost:1111/api/remove-from-cart', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"GH_ID": GH_ID})
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response["message"] == 1) {
            return res.redirect('/customer/cart');
        } else {
            return res.redirect('/customer');
        }
    })
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
            return res.render('ClientView/payment.ejs', {totalPrice: req.session.totalPrice});
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
    try {
        let {LOAITK, MSSV} = req.session;
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
                body: JSON.stringify({"MSSV": MSSV})
            })
            .then(response => response.json())
            .then(response => {
                if(response["message"] == 1) {
                    return res.render('img.ejs', {data: data});
                } else {
                    return res.redirect('/');
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
//
let getHomeLogout = async (req, res) => { 
    const {LOAITK} = req.session;
    req.session.destroy();
    if(LOAITK === 'NHANVIEN' || LOAITK === 'ADMIN') {
        return res.redirect('/admin');
    }else
        return res.redirect('/');
}
// admin
let getLoginAdmin = async (req, res) => {
    let {LOAITK} = req.session;
    if (LOAITK === 'ADMIN'.trim() || LOAITK === 'NHANVIEN'.trim()) {
        return res.redirect('/admin');
    }else {
        return res.render('Web_cashier/login/login.ejs');
    }
}

let handleloginAdmin = async (req, res) => {
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
            if(response["message"] == 1 && response["data"].length > 0) {
                const data = response["data"];
                if(data[0].LOAITK === 'ADMIN'){
                    req.session.LOAITK = data[0].LOAITK.trim();
                    req.session.MA = data[0].MA;
                    req.session.TEN = "ADMIN";
                    res.redirect('/admin');
                }
                else if(data[0].LOAITK.trim() === 'NHANVIEN'){
                    req.session.MA = data[0].MA;
                    req.session.LOAITK = data[0].LOAITK.trim();
                    req.session.TEN = data[0].TEN;
                    console.log(req.session);
                    res.redirect('/admin');
                }
                else {
                    return res.redirect('/admin/login');
                }
            })
    } else {
        return res.redirect('/admin/login');
    }
}

let getDataFoodAdmin = async(req, res) => {
    let { LOAITK, MA } = req.session;
    if (LOAITK === 'ADMIN' || LOAITK === 'NHANVIEN') {
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
                if (response["message"] == 1) {
                    data = response["data"];
                    data = data.filter(element => {
                        return element.TP_LOAI === 'Đồ ăn liền';
                    });
                    // api cart
                    let data2 = [];
                    fetch('http://localhost:1111/api/cart', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "MSSV": MA })
                        })
                        .then(response2 => response2.json())
                        .then(response2 => {
                            if (response2["message"] == 1) {
                                data2 = response2["data"];
                                let totalPrice = 0;
                                data2.forEach(element => { totalPrice += element.GH_TONGTIEN });
                                return res.render('Web_cashier/Cashier/Cashier_FastFood.ejs', { data: data, cart: data2, totalPrice: totalPrice, ma: req.session.MA, ten: req.session.TEN });
                            } else {
                                return res.redirect('/admin/login');
                            }
                        })
                } else {
                    return res.redirect('/admin/login');
                }
            })
    } else {
        return res.redirect('/admin/login');
    }
}

let handleAdminAddToCart = async(req, res) => {
    let { ID, LOAITK, MA } = req.session;
    let { TP_MA, CHECK } = req.body;
    let data = [];
    fetch('http://localhost:1111/api/add-to-cart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "MSSV": MA, "TP_MA": TP_MA })
        })
        .then(response => response.json())
        .then(response => {
            if (response["message"] == 1) {
                if (CHECK === '1') {
                    return res.redirect('/admin/food');
                } else
                    return res.redirect('/admin');
            } else {

            }
        })

}

let handleAdminDeleteFromCart = async(req, res) => {
    let { LOAITK, MA } = req.session;
    let { GH_ID, CHECK } = req.body;
    fetch('http://localhost:1111/api/remove-from-cart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "GH_ID": GH_ID })
        })
        .then(response => response.json())
        .then(response => {
            if (response["message"] == 1) {
                if (CHECK === '1') {
                    return res.redirect('/admin/food');
                } else
                    return res.redirect('/admin');
            } else {
                return res.redirect('/customer');
            }
        })
}

let gethomeEmployee = async (req, res) => { 
    let {LOAITK, MA} = req.session;
    fetch('http://localhost:1111/api/employee/info', {
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
            let data = response["data"];
            console.log(data);
            return res.render('Web_cashier/Nhân viên/Thông tin tổng.ejs', {data: data});
        } else {
            return res.redirect('/admin');
        }
    })
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
    handlePayment,
    deleteNumberOfFood,
    // log out
    getHomeLogout,
    //admin
    getLoginAdmin,
    handleloginAdmin,
    gethomeAdmin,
    getDataFoodAdmin,
    handleAdminAddToCart,
    handleAdminDeleteFromCart,

    //employee
    gethomeEmployee
}