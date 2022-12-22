import Connection from "../configs/connectDB";
import session from 'express-session';

let getFood = async (req, res) => {
    try {
        let data = [];
        await Connection.connect();
        let data_food = await Connection.request().query('SELECT TP_MA, TP_TEN, TP_LOAI, TP_GIA FROM dbo.THUCPHAM');
        data = data_food.recordset;
        if(data.length > 0){
            return res.status(200).json({
                message: "1", //True
                data: data
            });
        }
        else {
            return res.status(400).json({
                message: "0", //fail
            });
        }
        
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}

let handleLogin = async(req, res) => {
    try {
        let {UNAME, PWD} = req.body;
        if(UNAME && PWD) {
            await Connection.connect();
            let data_login = Connection.request().query(`SELECT MA, LOAITK FROM TAIKHOAN WHERE UNAME = N'${UNAME}' AND PWD = N'${PWD}'`);
            let data = (await data_login).recordset;
            if(data.length === 1) {
                return res.status(200).json({
                    message: "1", //True
                    data: data
                });
            }
            else {
                return res.status(400).json({
                    message: "0", //True
                });
            }
            
        }
        else {
            return res.status(400).json({
                message: "-1", //True
            });
    }
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}
    
let handleRegisterUser = async(req, res) => {
    // try {
    //     let {UNAME, PWD, MSSV, SDT, EMAIL} = req.body;
    //     if(UNAME && PWD && MSSV && SDT && EMAIL) {
    //         await Connection.connect();
    //         let checkUNAME = Connection.request().query(`SELECT UNAME FROM TAIKHOAN WHERE UNAME = '${UNAME}'`);
    //         if(((await checkUNAME).recordset).length != 0){
    //             return res.status(200).json({
    //                 message: "0", //fail
    //             });
    //         }
    //         let checkMSSV = Connection.request().query(`SELECT KH_MSSV FROM dbo.KHACHHANG WHERE KH_MSSV = '${MSSV}'`);
    //         if(((await checkMSSV).recordset).length != 0){
    //             return res.status(200).json({
    //                 message: "0", //fail
    //             });
    //         }
    //         try {
    //             Connection.request().query(`INSERT INTO dbo.KHACHHANG (KH_MSSV, KH_SDT, KH_EMAIL) VALUES ('${MSSV}', '${SDT}', '${EMAIL}' )`)
    //             let data_kh = Connection.request().query(`SELECT KH_ID FROM dbo.KHACHHANG WHERE KH_MSSV = '${MSSV}'`);
    //             let id_kh = (await data_kh).recordset;
    //             Connection.request().query(`INSERT INTO dbo.TAIKHOAN(UNAME, PWD, LOAITK, MA) VALUES ('${UNAME}', '${PWD}', 'KHACHHANG', '${id_kh[0].KH_ID}')`);
    //             return res.status(200).json({
    //                 message: "1"
    //             });
    //         } catch (error) {
    //             return res.status(200).json({
    //                 message: "0", //fail
    //             });
    //         }
    // }
    // else {
    //     return res.status(200).json({
    //         message: "-1", //True
    //     });
    // }
    // } catch (error) {
    //     return res.status(200).json({
    //         message: "-2", //True
    //     });
    // }
    let {UNAME, PWD, MSSV, SDT, EMAIL} = req.body;
    if(UNAME && PWD && MSSV && SDT && EMAIL) {
        await Connection.connect();
        Connection.request().query(`EXEC dbo.sp_themTaiKhoan @UN = '${UNAME}', @PW = '${PWD}', @MSSV = '${MSSV}', @SDT = '${SDT}',  @EMAIL = N'${EMAIL}'`, (err, result) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });   
            }
            return res.status(200).json({
            message: "1", //True
            });
            // console.log(err);
        });
        
    }
    else {
        return res.status(400).json({
            message: "-1", //True
        });
    }
    
}

let getCart = async (req, res) => {
    try {
        let {MSSV} = req.body;
        if (!MSSV) {
            return res.status(400).json({
                message: "0", //fail
            });
        }
        await Connection.connect();
        let data_cart = Connection.request().query(`SELECT TP.TP_TEN, TP.TP_LOAI, GH.TP_MA, GH.GH_SOLUONG, GH.GH_TONGTIEN FROM dbo.GIOHANG GH, dbo.THUCPHAM TP WHERE TP.TP_MA = GH.TP_MA AND GH.KH_MSSV = '${MSSV}'`);
        let data = (await data_cart).recordset;
        console.log(data);
        if(data.length > 0){
            return res.status(200).json({
                message: "1", //True
                data: data
            });
        }
        else {
            return res.status(400).json({
                message: "0", //fail
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}

let handleAddToCart = async(req, res) => {
    let {TP_MA, MSSV} = req.body;
    if(TP_MA && MSSV) {
        await Connection.connect();
        
        // try {   
        //     let data_food = Connection.request().query(`SELECT * FROM dbo.THUCPHAM WHERE TP_MA = ${TP_MA}`);
        //     let data = (await data_food).recordset;
        //     if(data.length != 0) {
        //         let data_cart= Connection.request().query(`SELECT * FROM dbo.GIOHANG WHERE KH_MA = ${KH_MA} AND TP_MA = ${TP_MA}`);
        //         console.log(((await data_cart).recordset));
        //         if (((await data_cart).recordset).length === 0) {
        //             Connection.request().query(`INSERT INTO dbo.GIOHANG (KH_MA, TP_MA, GH_SOLUONG, GH_TONGTIEN) VALUES (${KH_MA}, ${data[0].TP_MA}, 1, ${data[0].TP_GIA})`);
        //         }
        //         else {
        //             let number = (await data_cart).recordset;
        //             Connection.request().query(`UPDATE dbo.GIOHANG SET GH_SOLUONG = ${number[0].GH_SOLUONG + 1} WHERE KH_MA = ${KH_MA} AND TP_MA = ${data[0].TP_MA}`);
        //         }
        //     }
        // } catch (error) {
        //     // await transaction.rollback();
        //     return res.status(200).json({
        //         message: "-2", //True
        //     });
        // }
        // // await transaction.commit();
        // return res.status(200).json({
        //     message: "1", //True
        // });
        Connection.request().query( `EXEC dbo.sp_themVaoGioHang @TP_MA = ${TP_MA}, @MSSV = ${MSSV}`, (err) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1", //True
        });
    }
}

let handleRaiseNumOfFoodInCart = async (req, res) => {
    let {GH_ID} = req.body;
    if(GH_ID) {
        await Connection.connect();
        Connection.request().query( `EXEC dbo.sp_tangMotTrongGioHang @GH_ID = ${GH_ID}`, (err) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1"
        });
    }
}

let handleReduceNumOfFoodInCart = async (req, res) => {
    let {GH_ID} = req.body;
    if(GH_ID) {
        await Connection.connect();
        Connection.request().query( `EXEC dbo.sp_giamMotTrongGioHang @GH_ID = ${GH_ID}`, (err) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1"
        });
    }
}

let handleRemoveFromCart = async (req, res) => {
    let GH_ID = req.params.GH_ID;
    if(GH_ID) {
        await Connection.connect();
        Connection.request().query( `EXEC dbo.sp_xoaKhoiGioHang @GH_ID = ${GH_ID}`, (err) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1"
        });
    }
}

let handleReceipt = async (req, res) => {
    let {MSSV} = req.body;
    if(MSSV) {
        await Connection.connect();
        Connection.request().query( `EXEC sp_datHangOnline '${MSSV}', N'Thanh toán online'`, (err) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1"
        });
    }
}

let getReceipt = async (req, res) => {
    let {MSSV} = req.body;
    if(MSSV) {
        await Connection.connect();
        Connection.request().query( `SELECT h.HD_MA, h.HD_NGAYLAP, h.HD_TONGTIEN FROM HOADON h WHERE h.KH_MSSV = '${MSSV}'`, (err, result) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                    data: result.recordset
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1"
        });
    }
}

let getDetailReceipt = async (req, res) => {
    let {MSSV} = req.body;
    if(MSSV) {
        await Connection.connect();
        Connection.request().query( `SELECT h.HD_MA, h.HD_NGAYLAP, h.HD_TONGTIEN FROM HOADON h WHERE h.KH_MSSV = '${MSSV}'`, (err, result) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    message: "0", //True
                });
            } else {
                return res.status(200).json({
                    message: "1", //True
                    data: result.recordset
                });
            }
        })
    }
    else {
        return res.status(400).json({
            message: "-1"
        });
    }
}

module.exports = {
    getFood,
    handleLogin,
    handleRegisterUser,
    handleAddToCart,
    getCart,
    handleRaiseNumOfFoodInCart,
    handleReduceNumOfFoodInCart,
    handleRemoveFromCart,
    handleReceipt,
    getReceipt,
    getDetailReceipt
}