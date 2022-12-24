﻿CREATE
--DROP
DATABASE DA_NMCNPM
GO

USE DA_NMCNPM 
GO


CREATE
--DROP
TABLE NHANVIEN (
	NV_MA INT IDENTITY(1,1) PRIMARY KEY,
	NV_TEN NVARCHAR(100) NOT NULL,
	NV_GIOTINH NVARCHAR(10) NOT NULL,
	NV_SDT NVARCHAR(20) NOT NULL,
	NV_LUONG_GIO MONEY,
);
GO

CREATE
--DROP
TABLE CALAMVIEC (
	CLV_MA INT IDENTITY(1,1) PRIMARY KEY,
	CLV_NGAY DATE,
	CLV_GIOBATDAU TIME,
	CLV_GIOKETTHUC TIME
)
GO

CREATE 
--DROP
TABLE PHANCONGLAMVIEC(
	CLV_MA INT,
	NV_MA INT,
	CONSTRAINT PK_PHANCONGLAMVIEC PRIMARY KEY (NV_MA, CLV_MA),
	CONSTRAINT FK_NHANVIEN FOREIGN KEY (NV_MA) REFERENCES dbo.NHANVIEN(NV_MA),
	CONSTRAINT FK_CALAMVIEC FOREIGN KEY (CLV_MA) REFERENCES dbo.CALAMVIEC(CLV_MA)
);
GO 

CREATE TABLE HOADON (
	HD_MA INT IDENTITY(1,1) PRIMARY KEY,
	HD_NGAYLAP DATETIME NOT NULL,
	HD_TONGTIEN MONEY,
	HD_HINHTHUCTHANHTOAN NVARCHAR(100),
	KH_MSSV NVARCHAR(20), 
);
GO

CREATE TABLE THUCPHAM (
	TP_MA INT PRIMARY KEY IDENTITY(1,1),
	TP_TEN NVARCHAR(100) NOT NULL UNIQUE,
	TP_LOAI NVARCHAR(100) NOT NULL,
	TP_GIA MONEY
);
GO

CREATE TABLE CHITIETHOADON (
	HD_MA INT,
	TP_MA INT,
	CTDH_SOLUONG INT,
	CTDH_MA_DONGIA MONEY,
	CONSTRAINT PK_CHITIETDONHANG PRIMARY KEY (HD_MA,TP_MA),
	CONSTRAINT FK_THUCPHAM_CHITIET FOREIGN KEY (TP_MA) REFERENCES dbo.THUCPHAM(TP_MA),
	CONSTRAINT FK_DONHANG_CHITIET FOREIGN KEY (HD_MA) REFERENCES dbo.HOADON(HD_MA)
);
GO

CREATE TABLE THUC_AN_QUA_NAU(
	TP_MA INT PRIMARY KEY,
	TP_TEN NVARCHAR(100) NOT NULL,
	TP_LOAI NVARCHAR(100) NOT NULL,
	TP_GIA MONEY,
	TAQN_SOLUONGCONLAI INT,
	TAQN_SOLUONGNAU INT,
	CONSTRAINT FK_THUCPHAN_TAQN FOREIGN KEY (TP_MA) REFERENCES dbo.THUCPHAM(TP_MA)
);
GO

CREATE TABLE MATHANG(
	TP_MA INT PRIMARY KEY,
	TP_TEN NVARCHAR(100) NOT NULL,
	TP_LOAI NVARCHAR(100) NOT NULL,
	TP_GIA MONEY,
	MH_SOLUONGTON INT,
	MH_GIATIENNHAP MONEY,
	MH_NGAYSX DATETIME,
	MH_HSD DATE,
	MH_NHACUNGCAP NVARCHAR(100),
	CONSTRAINT FK_THUCPHAM_MH FOREIGN KEY (TP_MA) REFERENCES dbo.THUCPHAM(TP_MA)
);
GO

CREATE TABLE DONNHAPHANG (
	DNH_MA INT PRIMARY KEY IDENTITY(1,1),
	DNH_NGAYDAT DATETIME,
	DNH_TONGTIEN MONEY,
);
GO 

CREATE TABLE CHITIETDONNHAPHANG (
	DNH_MA INT,
	TP_MA INT,
	CTDNH_SOLUONG INT,
	CTDNH_DONGIA MONEY,
	CONSTRAINT PK_CTDNH PRIMARY KEY (DNH_MA,TP_MA),
	CONSTRAINT FK_CTDNH_MH FOREIGN KEY (TP_MA) REFERENCES dbo.MATHANG(TP_MA),
	CONSTRAINT FK_CTDNH_DNH FOREIGN KEY (DNH_MA) REFERENCES dbo.DONNHAPHANG(DNH_MA)
);
GO

CREATE
--DROP
TABLE KHACHHANG
(
    KH_ID INT IDENTITY(1,1) PRIMARY KEY,
	KH_MSSV NVARCHAR(20) UNIQUE,
	KH_SDT NVARCHAR(20),
	KH_EMAIL NVARCHAR(100),
	CONSTRAINT KH_CHECK CHECK (LEN(KH_MSSV) < 20 AND LEN(KH_SDT) < 20 AND LEN(KH_EMAIL) < 100)
)
GO

CREATE
--DROP
TABLE GIOHANG(
	ID INT IDENTITY(1,1) PRIMARY KEY,
	KH_MSSV NVARCHAR(100),
	TP_MA INT,
	GH_SOLUONG INT,
	GH_TONGTIEN MONEY,
	CONSTRAINT FK_GH_TP FOREIGN KEY (TP_MA) REFERENCES dbo.THUCPHAM(TP_MA)
)
GO 

CREATE
--DROP
TABLE TAIKHOAN
(
	ID INT IDENTITY(1,1) PRIMARY KEY,
    UNAME NVARCHAR(100) UNIQUE,
	PWD NVARCHAR(100),
	LOAITK NVARCHAR(100),
	MA INT,
	CONSTRAINT TK_cHECK CHECK (LOAITK = 'NHANVIEN' OR LOAITK = 'ADMIN' OR LOAITK = 'KHACHHANG')
)
GO
--------------------
ALTER TABLE THUCPHAM 
ADD UNIQUE (TP_TEN)
GO 
--CREATE
----ALTER
----DROP
--TRIGGER tr_capNhatTongTienHoaDon
--ON dbo.CHITIETHOADON
--FOR INSERT, UPDATE
--AS 
--BEGIN
--    UPDATE dbo.HOADON
--	SET HD_TONGTIEN = (SELECT SUM(CT.CTDH_MA_DONGIA * CT.CTDH_SOLUONG) FROM dbo.CHITIETHOADON CT WHERE CT.HD_MA = HD_MA GROUP BY ct.HD_MA)
--	WHERE EXISTS(SELECT * FROM Inserted WHERE Inserted.HD_MA = HD_MA)
--END
--GO 

--CREATE 
----alter
----drop
--TRIGGER sp_tongTienGioHang
--ON dbo.GIOHANG
--FOR INSERT, UPDATE
--AS 
--BEGIN
--    UPDATE dbo.GIOHANG
--	SET GH_TONGTIEN = GH_SOLUONG * (SELECT TP.TP_GIA FROM dbo.THUCPHAM TP WHERE TP.TP_MA = TP_MA)
--	WHERE EXISTS(SELECT * FROM Inserted I WHERE I.KH_MA = KH_MA AND I.TP_MA = TP_MA)
--END
--GO
-------------------- proc
CREATE 
--ALTER
PROC sp_themTaiKhoan
	@UN CHAR(100),
	@PW CHAR(100),
	@MSSV CHAR(20),
	@SDT CHAR(20),
	@EMAIL NVARCHAR(100)
AS
BEGIN TRANSACTION 
	BEGIN TRY
		IF(@UN IS NULL AND @PW IS NULL AND @MSSV IS NULL AND @SDT IS NULL AND @EMAIL IS NULL)
		BEGIN
		    RAISERROR(191,-1,-1,'thong tin khong hop le')
			ROLLBACK
			RETURN
		END
		IF EXISTS(SELECT * FROM dbo.TAIKHOAN WHERE UNAME = @UN)
		BEGIN
		    RAISERROR(191,-1,-1,'tai khoan da ton tai')
			ROLLBACK
			RETURN
		END
		IF EXISTS(SELECT * FROM dbo.KHACHHANG WHERE KH_MSSV = @MSSV)
		BEGIN
		    RAISERROR(191,-1,-1,'MSSV da ton tai')
			ROLLBACK
			RETURN
		END
		INSERT INTO dbo.KHACHHANG
		(
		    KH_MSSV,
		    KH_SDT,
		    KH_EMAIL
		)
		VALUES
		(   @MSSV, -- KH_MSSV - char(20)
		    @SDT, -- KH_SDT - char(20)
		    @EMAIL  -- KH_EMAIL - nvarchar(100)
		    )

		DECLARE @ID_KH INT
		SELECT @ID_KH = KH_ID FROM dbo.KHACHHANG WHERE @MSSV = KH_MSSV
		INSERT INTO dbo.TAIKHOAN
		(
		    UNAME,
		    PWD,
		    LOAITK,
		    MA
		)
		VALUES
		(   @UN, -- UNAME - char(100)
		    @PW, -- PWD - char(100)
		    'KHACHHANG', -- LOAITK - char(100)
		    @ID_KH  -- MA - int
		    )
	END TRY
	BEGIN CATCH
		RAISERROR(233,-1,-1,'them tai khoan khong thanh cong')
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO

-- XU LY DANG NHAP
CREATE
--alter
PROC sp_xulyDangNhap 
	@UN CHAR(100),
	@PW CHAR(100)
AS
BEGIN TRANSACTION 
	BEGIN TRY
		IF NOT EXISTS(SELECT * FROM dbo.TAIKHOAN WHERE UNAME = @UN)
		BEGIN
			ROLLBACK
			RETURN
		END
		IF NOT EXISTS(SELECT * FROM dbo.TAIKHOAN WHERE UNAME = @UN AND PWD= @PW)
		BEGIN
			ROLLBACK
			RETURN
		END
		SELECT * FROM dbo.TAIKHOAN WHERE UNAME = @UN AND PWD= @PW
	END TRY
	BEGIN CATCH
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO

-- dat hang --dang loi
CREATE
--alter
--drop
PROC sp_datHangOnline
	@KH_MSSV NVARCHAR(20),
	@HINHTHUCTHANHTOAN NVARCHAR(100)
AS 
BEGIN TRANSACTION 
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM dbo.GIOHANG WHERE KH_MSSV = @KH_MSSV)
		BEGIN
			RAISERROR(282, -1, -1, 'DON HANG KHONG TON TAI')
		    ROLLBACK
			RETURN
		END
		IF (@HINHTHUCTHANHTOAN != N'Online' AND @HINHTHUCTHANHTOAN != N'Trực tiếp')
		BEGIN
		    RAISERROR(288, -1, -1, 'HINH THUC THANH TOAN KHONG DUNG')
		    ROLLBACK
			RETURN
		END
		DECLARE @time DATETIME = GETDATE()
		INSERT INTO HOADON (HD_NGAYLAP, HD_HINHTHUCTHANHTOAN, KH_MSSV) VALUES (@time,@HINHTHUCTHANHTOAN, @KH_MSSV)

		DECLARE @HD_ID INT 
		SELECT @HD_ID = h.HD_MA FROM HOADON h WHERE h.HD_NGAYLAP = @time AND h.KH_MSSV = @KH_MSSV

		PRINT '1'
		DECLARE c CURSOR FOR (SELECT g.TP_MA, g.GH_SOLUONG, g.GH_TONGTIEN FROM GIOHANG g WHERE g.KH_MSSV = @KH_MSSV)
		
		OPEN c
		DECLARE @tpma INT, @sl INT, @tien MONEY, @tongtien MONEY = 0
		FETCH NEXT FROM c INTO @tpma, @sl, @tien
		WHILE @@fetch_status = 0
		BEGIN
			INSERT INTO CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA) 
			VALUES (@HD_ID, @tpma, @sl, @tien)
			SET @tongtien = @tongtien + @tien
			FETCH NEXT FROM c INTO @tpma, @sl, @tien
		END 
		CLOSE c
		DEALLOCATE c
		DELETE GIOHANG WHERE KH_MSSV = @KH_MSSV
		UPDATE HOADON SET HD_TONGTIEN = @tongtien WHERE HD_MA = @HD_ID
	END TRY
	BEGIN CATCH
		CLOSE c
		DEALLOCATE c
		RAISERROR(298, -1, -1, 'KHONG THEM DUOC')
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO 
-- them vao gio hang
CREATE 
--alter
PROC sp_themVaoGioHang
	@TP_MA INT,
	@MSSV NVARCHAR(20)
AS 
BEGIN TRANSACTION 
	BEGIN TRY
		IF (@TP_MA IS NULL AND @MSSV IS NULL)
		BEGIN
		    RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
			ROLLBACK
			RETURN
		END
		IF NOT EXISTS(SELECT * FROM dbo.THUCPHAM WHERE TP_MA = @TP_MA)
		BEGIN
		    RAISERROR(351, -1, -1, 'MA THUC PHAM KHONG TON TAI');
			ROLLBACK
			RETURN
		END
		DECLARE @GIA MONEY
		SELECT @GIA = TP_GIA FROM dbo.THUCPHAM WHERE TP_MA = @TP_MA
		IF NOT EXISTS(SELECT * FROM dbo.GIOHANG WHERE KH_MSSV = @MSSV AND TP_MA = @TP_MA)
		BEGIN
			
		    INSERT INTO dbo.GIOHANG
			(
				KH_MSSV,
				TP_MA,
				GH_SOLUONG,
				GH_TONGTIEN
			)
			VALUES
			(   @MSSV,    -- KH_MA - int
				@TP_MA,    -- TP_MA - int
				1, -- GH_SOLUONG - int
				@GIA  -- GH_TONGTIEN - money
				)
		END
		ELSE
		BEGIN
		    UPDATE dbo.GIOHANG
			SET GH_SOLUONG = GH_SOLUONG + 1, GH_TONGTIEN = (GH_SOLUONG + 1) * @GIA
			WHERE KH_MSSV = @MSSV AND TP_MA = @TP_MA
		END
		---------------------------------------------------------------
		IF (SELECT T.TP_LOAI FROM THUCPHAM t WHERE t.TP_MA = @TP_MA) = N'Đồ nấu'
			BEGIN
                IF (SELECT taqn.TAQN_SOLUONGCONLAI FROM THUC_AN_QUA_NAU taqn WHERE taqn.TP_MA = @TP_MA) > 0
				BEGIN
					UPDATE THUC_AN_QUA_NAU SET TAQN_SOLUONGCONLAI = TAQN_SOLUONGCONLAI - 1
					WHERE TP_MA = @TP_MA
                END
				ELSE 
				BEGIN
					RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
					ROLLBACK
					RETURN
                END
            END
		ELSE
			BEGIN
                IF (SELECT m.MH_SOLUONGTON FROM MATHANG m WHERE m.TP_MA = @TP_MA) > 0
					BEGIN
						UPDATE MATHANG SET MH_SOLUONGTON = MH_SOLUONGTON - 1
						WHERE TP_MA = @TP_MA;
					END
				ELSE 
					BEGIN
						RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
						ROLLBACK
						RETURN
					END

            END
	END TRY
	BEGIN CATCH
		RAISERROR(377, -1,-1,'LOI THEM VAO GIO HANG')
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO

-- tăng số lương đồ ăn giỏ hàng lên 1
CREATE 
--ALTER
PROC sp_tangMotTrongGioHang
	@GH_ID INT
AS 
BEGIN TRANSACTION
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM GIOHANG g WHERE g.ID = @GH_ID)
		BEGIN
			RAISERROR(413, -1,-1,'sp_tangMotTrongGioHang')
			ROLLBACK
			RETURN
		END

		DECLARE @GIA MONEY
		SELECT @GIA = TP.TP_GIA FROM dbo.THUCPHAM TP JOIN dbo.GIOHANG ON GIOHANG.TP_MA = TP.TP_MA WHERE dbo.GIOHANG.ID = @GH_ID

		UPDATE dbo.GIOHANG
		SET GH_SOLUONG = GH_SOLUONG + 1, GH_TONGTIEN = (GH_SOLUONG + 1) * @GIA
		WHERE ID = @GH_ID
	END TRY
	BEGIN CATCH
		RAISERROR(413, -1,-1,'sp_tangMotTrongGioHang - cacth')
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO

CREATE 
--alter
PROC sp_giamMotTrongGioHang
	@GH_ID INT
AS
BEGIN TRANSACTION 
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM GIOHANG g WHERE g.ID = @GH_ID)
		BEGIN
			RAISERROR(413, -1,-1,'sp_tangMotTrongGioHang')
			ROLLBACK
			RETURN
		END
		IF (SELECT GH_SOLUONG FROM dbo.GIOHANG WHERE dbo.GIOHANG.ID = @GH_ID) <= 1
		BEGIN
		    DELETE dbo.GIOHANG WHERE ID = @GH_ID
		END
		ELSE
		BEGIN
		    DECLARE @GIA MONEY
			SELECT @GIA = TP.TP_GIA FROM dbo.THUCPHAM TP JOIN dbo.GIOHANG ON GIOHANG.TP_MA = TP.TP_MA WHERE dbo.GIOHANG.ID = @GH_ID

			UPDATE dbo.GIOHANG
			SET GH_SOLUONG = GH_SOLUONG - 1, GH_TONGTIEN = (GH_SOLUONG - 1) * @GIA
			WHERE ID = @GH_ID
		END


		DECLARE @TP_MA INT, @soluong INT
		SELECT @TP_MA = g.TP_MA, @soluong = g.GH_SOLUONG FROM GIOHANG g WHERE g.ID = @GH_ID
		
		
		-----------------------------------------------------------
		IF (SELECT T.TP_LOAI FROM THUCPHAM t WHERE t.TP_MA = @TP_MA) = N'Đồ nấu'
			BEGIN
                IF (SELECT taqn.TAQN_SOLUONGCONLAI FROM THUC_AN_QUA_NAU taqn WHERE taqn.TP_MA = @TP_MA) > 0
				BEGIN
					UPDATE THUC_AN_QUA_NAU SET TAQN_SOLUONGCONLAI = TAQN_SOLUONGCONLAI + 1
					WHERE TP_MA = @TP_MA
                END
				ELSE 
				BEGIN
					RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
					ROLLBACK
					RETURN
                END
            END
		ELSE
			BEGIN
                IF (SELECT m.MH_SOLUONGTON FROM MATHANG m WHERE m.TP_MA = @TP_MA) > 0
					BEGIN
						UPDATE MATHANG SET MH_SOLUONGTON = MH_SOLUONGTON + 1
						WHERE TP_MA = @TP_MA;
					END
				ELSE 
					BEGIN
						RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
						ROLLBACK
						RETURN
					END

            END

	END TRY
	BEGIN CATCH
		RAISERROR(413, -1,-1,'sp_tangMotTrongGioHang - cacth')
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO

CREATE 
--alter
PROC sp_xoaKhoiGioHang
	@GH_ID INT
AS
BEGIN TRANSACTION 
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM GIOHANG g WHERE g.ID = @GH_ID)
		BEGIN
			RAISERROR(477, -1,-1,'sp_xoaKhoiGioHang')
			ROLLBACK
			RETURN
		END
		DECLARE @TP_MA INT, @soluong INT
		SELECT @TP_MA = g.TP_MA, @soluong = g.GH_SOLUONG FROM GIOHANG g WHERE g.ID = @GH_ID
		
		
		-----------------------------------------------------------
		IF (SELECT T.TP_LOAI FROM THUCPHAM t WHERE t.TP_MA = @TP_MA) = N'Đồ nấu'
			BEGIN
                IF (SELECT taqn.TAQN_SOLUONGCONLAI FROM THUC_AN_QUA_NAU taqn WHERE taqn.TP_MA = @TP_MA) > 0
				BEGIN
					UPDATE THUC_AN_QUA_NAU SET TAQN_SOLUONGCONLAI = TAQN_SOLUONGCONLAI + @soluong
					WHERE TP_MA = @TP_MA
                END
				ELSE 
				BEGIN
					RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
					ROLLBACK
					RETURN
                END
            END
		ELSE
			BEGIN
                IF (SELECT m.MH_SOLUONGTON FROM MATHANG m WHERE m.TP_MA = @TP_MA) > 0
					BEGIN
						UPDATE MATHANG SET MH_SOLUONGTON = MH_SOLUONGTON + @soluong
						WHERE TP_MA = @TP_MA;
					END
				ELSE 
					BEGIN
						RAISERROR(346, -1, -1, 'THONG TIN KHONG HOP LE');
						ROLLBACK
						RETURN
					END

            END

		--------------------------------------
		DELETE dbo.GIOHANG WHERE ID = @GH_ID
	END TRY
	BEGIN CATCH
		RAISERROR(47, -1,-1,'sp_xoaKhoiGioHang - cacth')
		ROLLBACK
		RETURN
	END CATCH
COMMIT TRANSACTION
GO

------------------------------------------------------

-- BANG THUC PHAM
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) 
VALUES (N'Sting', N'Đồ ăn liền', 10000)
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Sting Do',  N'Đồ ăn liền',10000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) 
VALUES (N'Coca Cola', N'Đồ nấu', 30000)
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Pepsi',  N'Đồ ăn liền',15000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) 
VALUES (N'7Up', N'Đồ nấu', 15000)
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cam ép',  N'Đồ ăn liền',10000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) 
VALUES (N'Chanh dây', N'Đồ nấu', 12000)
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Trà xanh không độ',  N'Đồ ăn liền',12000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) 
VALUES (N'Dr.Thanh trà giải nhiệt', N'Đồ nấu', 15000)
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Trà Olong Tea+',  N'Đồ ăn liền',15000 )
-- ĐỒ NẤU
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Phở bò',  N'Đồ nấu',30000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Phở gà',  N'Đồ nấu',25000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Hủ tiếu bò',  N'Đồ nấu',30000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Hủ tiếu khô',  N'Đồ nấu',25000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cơm chiên dương châu',  N'Đồ nấu',30000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cơm chiên trứng',  N'Đồ nấu',25000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cơm gà',  N'Đồ nấu',25000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cơm thập cẩm',  N'Đồ nấu',35000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cơm chay',  N'Đồ nấu',25000 )
INSERT INTO dbo.THUCPHAM (TP_TEN, TP_LOAI, TP_GIA)
VALUES( N'Cơm thêm',  N'Đồ nấu',1000 )
-- BANG MAT HANG
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(1, N'Sting', N'Đồ ăn liền', 10000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(2, N'Sting Do', N'Đồ ăn liền', 10000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(3, N'Coca Cola', N'Đồ ăn liền', 10000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(4, N'Pepsi', N'Đồ ăn liền', 15000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(5, N'7Up', N'Đồ ăn liền', 15000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(6, N'Cam ép', N'Đồ ăn liền', 10000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(7, N'Chanh dây', N'Đồ ăn liền', 12000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(8, N'Trà xanh không độ', N'Đồ ăn liền', 12000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(9, N'Dr.Thanh trà giải nhiệt', N'Đồ ăn liền', 15000, 100, 5000, '10/05/2022', '10/5/2023', NULL)
INSERT INTO dbo.MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD, MH_NHACUNGCAP)
VALUES(10, N'Trà Olong Tea+', N'Đồ ăn liền', 15000, 100, 5000, '10/05/2022', '10/5/2023', NULL)


-- BANG THUC AN QUA NAU
INSERT INTO dbo.THUC_AN_QUA_NAU(TP_MA, TP_TEN, TP_LOAI, TP_GIA, TAQN_SOLUONGCONLAI, TAQN_SOLUONGNAU)
VALUES(11,  N'Phở bò', N'Đồ nấu', 30000, 30, 100 )
INSERT INTO dbo.THUC_AN_QUA_NAU(TP_MA, TP_TEN, TP_LOAI, TP_GIA, TAQN_SOLUONGCONLAI, TAQN_SOLUONGNAU)
VALUES(12,  N'Phở gà', N'Đồ nấu', 25000, 30, 100 )
INSERT INTO dbo.THUC_AN_QUA_NAU(TP_MA, TP_TEN, TP_LOAI, TP_GIA, TAQN_SOLUONGCONLAI, TAQN_SOLUONGNAU)
VALUES(13,  N'Hủ tiếu bò', N'Đồ nấu', 30000, 30, 100 )
INSERT INTO dbo.THUC_AN_QUA_NAU(TP_MA, TP_TEN, TP_LOAI, TP_GIA, TAQN_SOLUONGCONLAI, TAQN_SOLUONGNAU)
VALUES(14,  N'Cơm chiên dương châu', N'Đồ nấu', 30000, 30, 100 )
INSERT INTO dbo.THUC_AN_QUA_NAU(TP_MA, TP_TEN, TP_LOAI, TP_GIA, TAQN_SOLUONGCONLAI, TAQN_SOLUONGNAU)
VALUES(15,  N'Cơm chiên trứng', N'Đồ nấu', 25000, 30, 100 )
INSERT INTO dbo.THUC_AN_QUA_NAU(TP_MA, TP_TEN, TP_LOAI, TP_GIA, TAQN_SOLUONGCONLAI, TAQN_SOLUONGNAU)
VALUES(16,  N'Cơm gà', N'Đồ nấu', 25000, 30, 100 )

-- BANG HOA DON
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 75000, N'Trực tiếp')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 35000, N'Trực tiếp')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 10000, N'Trực tiếp')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 40000, N'Trực tiếp')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 55000, N'Online')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 25000, N'Online')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 100000, N'Online')
INSERT INTO dbo.HOADON (HD_NGAYLAP, HD_TONGTIEN, HD_HINHTHUCTHANHTOAN)
VALUES ( GETDATE(), 45000, N'Online')



-- BANG CHI TIET HOA DON
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(1, 1, 4, 40000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES (1, 18, 1, 35000)
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(2, 18, 1, 35000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(3, 1, 1, 10000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(4, 9, 1, 15000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES (4, 12, 1, 25000)
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(5, 14, 1, 25000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES (5, 15, 1, 30000)
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(6, 17, 1, 25000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES (7, 6, 10, 100000)
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES(8, 4, 2, 30000 )
INSERT INTO dbo.CHITIETHOADON (HD_MA, TP_MA, CTDH_SOLUONG, CTDH_MA_DONGIA)
VALUES (8, 5, 1, 15000)

-- BANG DON NHAP HANG
INSERT INTO dbo.DONNHAPHANG (DNH_NGAYDAT, DNH_TONGTIEN)
VALUES ( '20221015', NULL)
INSERT INTO dbo.DONNHAPHANG (DNH_NGAYDAT, DNH_TONGTIEN)
VALUES ( '20220915', NULL)
INSERT INTO dbo.DONNHAPHANG (DNH_NGAYDAT, DNH_TONGTIEN)
VALUES ( '20220815', NULL)
INSERT INTO dbo.DONNHAPHANG (DNH_NGAYDAT, DNH_TONGTIEN)
VALUES ( '20220715', NULL)
INSERT INTO dbo.DONNHAPHANG (DNH_NGAYDAT, DNH_TONGTIEN)
VALUES ( GETDATE(), NULL)

-- BANG CHI TIET DON HANG
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(3, 1, 100, 1000000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(3, 3, 50, 1500000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(3, 6, 100, 1000000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(4, 2, 100, 1000000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(4, 9, 100, 1500000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(5, 1, 100, 1000000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(1, 3, 50, 1500000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(1, 6, 100, 1000000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(1, 2, 100, 1000000)
INSERT INTO dbo.CHITIETDONNHAPHANG( DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA )
VALUES(2, 9, 100, 1500000)

-- BANG NHAN VIEN
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Chán Văn X', N'Nam', N'0123456789', 20000 )
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Nguyễn Văn A', N'Nam', N'0123456789', 20000 )
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Nguyễn Thị C', N'Nữ', N'0123456789', 15000 )
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Trần Thị D', N'Nam', N'0123456789', 10000 )
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Trần Thị E', N'Nam', N'0123456789', 20000 )
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Phạm Văn F', N'Nam', N'0123456789', 50000 )
INSERT INTO dbo.NHANVIEN( NV_TEN, NV_GIOTINH, NV_SDT, NV_LUONG_GIO)
VALUES( N'Phan Văn G', N'Nam', N'0123456789', 30000 )

-- BANG CA LAM VIEC
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES(GETDATE(),'07:00:00', '10:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES(GETDATE(),'10:00:00', '14:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES(GETDATE(),'14:00:00', '18:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230105','07:00:00', '10:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230105','10:00:00', '14:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230105','14:00:00', '18:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230106','07:00:00', '10:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230106','10:00:00', '14:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230106','14:00:00', '18:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230109','07:00:00', '10:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230109','10:00:00', '14:00:00' )
INSERT INTO dbo.CALAMVIEC(CLV_NGAY, CLV_GIOBATDAU, CLV_GIOKETTHUC)
VALUES('20230109','14:00:00', '18:00:00' )

-- BANG PHAN CONG VIEC LAM
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(1, 1)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(2, 1)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(3, 1)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(4, 2)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(5, 2)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(6, 3)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(7, 3)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(8, 4)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(9, 4)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(9, 6)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(10, 5)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(11, 7)
INSERT INTO dbo.PHANCONGLAMVIEC(CLV_MA, NV_MA)
VALUES(12, 7)


-- BANG TAI KHOAN
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('ABC', 1, 'KHACHHANG',1)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV1', 1, 'NHANVIEN',1)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV2', 1, 'NHANVIEN',2)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV3', 1, 'NHANVIEN',3)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV4', 1, 'NHANVIEN',4)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV5', 1, 'NHANVIEN',5)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV6', 1, 'NHANVIEN',6)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV7', 1, 'NHANVIEN',7)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV8', 1, 'NHANVIEN',8)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV9', 1, 'NHANVIEN',9)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV10', 1, 'NHANVIEN',10)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV11', 1, 'NHANVIEN',1)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('NV12', 1, 'NHANVIEN',12)
INSERT INTO TAIKHOAN (UNAME,PWD,LOAITK, MA) VALUES ('ADMIN1', 1, 'ADMIN', 1000)

-- UPDATE HOA DON
UPDATE HOADON
SET KH_MSSV = '1'
WHERE HD_MA = 1
UPDATE HOADON
SET KH_MSSV = '1'
WHERE HD_MA = 2
UPDATE HOADON
SET KH_MSSV = '2'
WHERE HD_MA = 2

GO
CREATE
--ALTER
PROC sp_reportOnDay
	@ngay int,
	@thang int,
	@nam int
AS 
BEGIN TRANSACTION
	BEGIN TRY
	IF(@ngay IS NULL AND @thang IS NULL AND @nam IS NULL)
	BEGIN
    	RAISERROR(642, -1,-1, 'sp_reportOnDay NULL')
    END
	SELECT t.TP_TEN, SUM(c.CTDH_MA_DONGIA) AS 'GIA', SUM(c.CTDH_SOLUONG) AS 'SOLUONG' FROM HOADON h
	JOIN CHITIETHOADON c ON h.HD_MA = c.HD_MA
	JOIN THUCPHAM t ON c.TP_MA = t.TP_MA
	WHERE DAY(h.HD_NGAYLAP) = @ngay AND MONTH(h.HD_NGAYLAP) = @thang AND YEAR(h.HD_NGAYLAP) = @nam
	GROUP BY (t.TP_TEN)
	END TRY
	--Begin catch
	BEGIN CATCH
		RAISERROR(737, -1,-1, 'sp_reportOnDay Failed')
	END CATCH
COMMIT TRANSACTION
GO


CREATE
--ALTER
PROC sp_reportOnDayofEachEmployee
	@manv int,
	@ngay int,
	@thang int,
	@nam int
AS 
BEGIN TRANSACTION
	BEGIN TRY
	IF((@ngay IS NULL AND @thang IS NULL AND @nam IS NULL) OR (@manv IS NULL))
	BEGIN
    	RAISERROR(642, -1,-1, 'sp_reportOnDay NULL')
    END

	SELECT t.TP_TEN, SUM(c.CTDH_MA_DONGIA) AS 'GIA', SUM(c.CTDH_SOLUONG) AS 'SOLUONG' FROM HOADON h
		JOIN CHITIETHOADON c ON h.HD_MA = c.HD_MA
		JOIN THUCPHAM t ON c.TP_MA = t.TP_MA
	WHERE 
		DAY(h.HD_NGAYLAP) = @ngay 
		AND MONTH(h.HD_NGAYLAP) = @thang 
		AND YEAR(h.HD_NGAYLAP) = @nam
		AND cast(@manv as NVARCHAR(20)) = h.KH_MSSV
	GROUP BY (t.TP_TEN)
	END TRY
	--Begin catch
	BEGIN CATCH
		RAISERROR(737, -1,-1, 'sp_reportOnDay Failed')
	END CATCH
COMMIT TRANSACTION
GO


CREATE
--ALTER
PROC sp_reportOnMonth
	@thang int,
	@nam int
AS 
BEGIN TRANSACTION
	BEGIN TRY
	IF( @thang IS NULL AND @nam IS NULL)
	BEGIN
    	RAISERROR(642, -1,-1, 'sp_reportOnMonth NULL')
    END

	SELECT t.TP_TEN, SUM(c.CTDH_MA_DONGIA) AS 'GIA', SUM(c.CTDH_SOLUONG) AS 'SOLUONG' FROM HOADON h
		JOIN CHITIETHOADON c ON h.HD_MA = c.HD_MA
		JOIN THUCPHAM t ON c.TP_MA = t.TP_MA
	WHERE 
		 MONTH(h.HD_NGAYLAP) = @thang 
		AND YEAR(h.HD_NGAYLAP) = @nam
	GROUP BY (t.TP_TEN)
	END TRY
	--Begin catch
	BEGIN CATCH
		RAISERROR(737, -1,-1, 'sp_reportOnMonth Failed')
	END CATCH
COMMIT TRANSACTION
GO

--Them mon an qua nau
CREATE 
--alter
PROC sp_themMonAnQuaNau
	@ten NVARCHAR(100),
	@gia MONEY
AS 
BEGIN TRANSACTION
	BEGIN TRY
		IF(@ten IS NULL AND @gia IS NULL)
		BEGIN
        	RAISERROR(829, -1,-1, 'sp_themMonAnQuaNau NULL')
			ROLLBACK
			RETURN
        END
		INSERT INTO THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) VALUES (@ten, N'Đồ nấu', @gia)
		DECLARE @tpid INT
		SELECT @tpid = t.TP_MA FROM THUCPHAM t WHERE t.TP_TEN = @ten
		INSERT INTO THUC_AN_QUA_NAU (TP_MA, TP_TEN, TP_LOAI, TAQN_SOLUONGCONLAI, TP_GIA, TAQN_SOLUONGNAU) VALUES (@tpid, @ten, N'Đồ nấu', 100, @gia, 100);
	END TRY
	BEGIN CATCH
		RAISERROR(829, -1,-1, 'sp_themMonAnQuaNau catch')
			ROLLBACK
			RETURN
	END CATCH
COMMIT TRANSACTION
GO 

-- them mat hang
CREATE 
--alter
PROC sp_themMatHang
	@ten NVARCHAR(100),
	@gia MONEY,
	@sl INT,
	@nsx DATE,
	@gianhap MONEY,
	@hsd DATE
AS 
BEGIN TRANSACTION
	BEGIN TRY
		IF(@ten IS NULL AND @gia IS NULL AND @sl IS NULL AND @gianhap IS NULL AND @hsd IS NULL AND @nsx IS NULL)
		BEGIN
        	RAISERROR(861, -1,-1, 'sp_themMatHang NULL')
			ROLLBACK
			RETURN
        END
		INSERT INTO THUCPHAM (TP_TEN, TP_LOAI, TP_GIA) VALUES (@ten, N'Đồ ăn liền', @gia)
		DECLARE @tpid INT
		SELECT @tpid = t.TP_MA FROM THUCPHAM t WHERE t.TP_TEN = @ten
		INSERT INTO MATHANG (TP_MA, TP_TEN, TP_LOAI, TP_GIA, MH_SOLUONGTON, MH_GIATIENNHAP, MH_NGAYSX, MH_HSD)
		VALUES (@tpid, @ten, N'Đồ ăn liền', @gia, @sl, @gianhap, @nsx, @hsd)
	END TRY
	BEGIN CATCH
		RAISERROR(872, -1,-1, 'sp_themMatHang catch')
			ROLLBACK
			RETURN
	END CATCH
COMMIT TRANSACTION
GO 

CREATE 
--alter
PROC sp_themDONNHAPHANG
AS 
BEGIN TRANSACTION
	BEGIN TRY
		DECLARE @time DATETIME
		SET @time = GETDATE()
		INSERT INTO DONNHAPHANG (DNH_NGAYDAT, DNH_TONGTIEN) VALUES (@time, 0)
		DECLARE @id INT
		SELECT @id = d.DNH_MA FROM DONNHAPHANG d WHERE d.DNH_NGAYDAT = @time
		SELECT @id
	END TRY
	BEGIN CATCH
		RAISERROR(890, -1,-1, 'sp_themDONNHAPHANG catch')
			ROLLBACK
			RETURN
	END CATCH
COMMIT TRANSACTION
GO

CREATE 
--alter
PROC sp_themChiTietDonNhapHang 
	@ten NVARCHAR(100),
	@giaban MONEY,
	@sl INT,
	@gianhap MONEY,
	@ngaysx DATE,
	@hsd DATE,
	@id_dh int
AS 
BEGIN TRANSACTION
	BEGIN TRY
		IF(@ten IS NULL AND @giaban IS NULL AND @sl IS NULL AND @gianhap IS NULL AND @hsd IS NULL)
		BEGIN
        	RAISERROR(861, -1,-1, 'sp_themMatHang NULL')
			ROLLBACK
			RETURN
        END
		DECLARE @idtp INT
		IF EXISTS (SELECT * FROM MATHANG m WHERE m.TP_TEN = @ten)
		BEGIN 
			UPDATE MATHANG SET MH_SOLUONGTON = MH_SOLUONGTON + @sl
			WHERE TP_TEN = @ten
		END 
		ELSE
		BEGIN
        	EXEC sp_themMatHang @ten, @giaban, @sl, @ngaysx, @gianhap, @hsd
        END
		SELECT @idtp = @idtp FROM MATHANG m WHERE TP_TEN = @ten
		INSERT INTO CHITIETDONNHAPHANG (DNH_MA, TP_MA, CTDNH_SOLUONG, CTDNH_DONGIA)
		VALUES (@id_dh, @idtp, @sl, @gianhap * @sl)
	END TRY
	BEGIN CATCH
		RAISERROR(936, -1,-1, 'sp_themChiTietDonNhapHang catch')
			ROLLBACK
			RETURN
	END CATCH
COMMIT TRANSACTION
GO 