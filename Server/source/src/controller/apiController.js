import Connection from "../configs/connectDB";
import session from 'express-session';

let getFood = async(req, res) => {
    try {
        await Connection.connect();
        Connection.request().query(`SELECT TP_MA, TP_TEN, TP_LOAI, TP_GIA, TP_IMGPATH FROM dbo.THUCPHAM`, (err, result) => {
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
        });
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}

let handleLogin = async(req, res) => {
    try {
        let { UNAME, PWD } = req.body;
        if (UNAME && PWD) {
            await Connection.connect();
            Connection.request().query(`SELECT MA, LOAITK FROM TAIKHOAN WHERE UNAME = N'${UNAME}' AND PWD = N'${PWD}'`, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(200).json({
                        message: "0", //True
                    });   
                }
                return res.status(200).json({
                    message: "1", //True
                    data: result.recordset
                });
            });
        } else {
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
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}

let getCart = async(req, res) => {
    try {
        let { MSSV } = req.body;
        if (!MSSV) {
            return res.status(400).json({
                message: "0", //fail
            });
        }
        await Connection.connect();
            Connection.request().query(`SELECT GH.ID, TP.TP_TEN, TP.TP_LOAI, GH.TP_MA, GH.GH_SOLUONG, GH.GH_TONGTIEN FROM dbo.GIOHANG GH, dbo.THUCPHAM TP WHERE TP.TP_MA = GH.TP_MA AND GH.KH_MSSV = '${MSSV}'`, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(200).json({
                        message: "0", //True
                    });   
                }
                return res.status(200).json({
                    message: "1", //True
                    data: result.recordset
                });
            });
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}

let handleAddToCart = async(req, res) => {
    try {
        let {TP_MA, MSSV} = req.body;
        if(TP_MA && MSSV) {
            await Connection.connect();
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
            return res.status(200).json({
                message: "-1", //True
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
}

let handleRaiseNumOfFoodInCart = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
    
}

let handleReduceNumOfFoodInCart = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
    
}

let handleRemoveFromCart = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
    
}

let handleReceipt = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
    
}

let getReceipt = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
    
}

let getDetailReceipt = async (req, res) => {
    try {
        let {HD_ID} = req.body;
        if(HD_ID) {
            await Connection.connect();
            Connection.request().query( `SELECT T.TP_TEN, c.CTDH_SOLUONG, c.CTDH_MA_DONGIA FROM CHITIETHOADON c JOIN THUCPHAM t ON c.TP_MA = t.TP_MA WHERE c.HD_MA = ${HD_ID}`, (err, result) => {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
        });
    }
    
}

let handleReportOnDay = async(req,res) => {
    try {
        let {TIME} = req.body;
        if(TIME) {
            await Connection.connect();
            Connection.request().query( `SELECT T.TP_TEN, c.CTDH_SOLUONG, c.CTDH_MA_DONGIA FROM CHITIETHADON c JOIN THUCPHAM t ON c.TP_MA = t.TP_MA WHERE c.HD_MA = ${HD_ID}`, (err, result) => {
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
    } catch (error) {
        return res.status(400).json({
            message: "-2", //True
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
    getDetailReceipt,

    // report
    handleReportOnDay
}