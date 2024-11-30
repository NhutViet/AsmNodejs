var express = require("express");
var router = express.Router();

var bookModel = require("../models/book");
const JWT = require("jsonwebtoken");
const config = require("../ultil/config");

// lấy toàn bộ danh sách
//http://localhost:3000/books/all
router.get("/all", async function (req, res, next) {
  try {
    // Lấy token
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res
            .status(403)
            .json({ status: false, message: "lỗi xảy ra, token hết hạn" });
        } else {
          var data = await bookModel.find();
          res.status(200).json(data);
        }
      });
    } else {
      res.status(401).json({ status: false, message: "không xác thực" });
    }
  } catch (err) {
    res.status(400).json({ message: "Lỗi xay ra, không có token" });
  }
});

// lấy danh sanh có số tiền trên 100.000;
// http://localhost:3000/books/gia?giaTien=100000
router.get("/gia", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        const { giaTien } = req.query;
        const data = await bookModel.find({ giaTien: { $gt: giaTien } });
        res.status(200).json(data);
      });
    } else {
      res.status(401).json({ status: false, message: "không xác thực" });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

//lấy danh sách từ 60000 => 100000
// http://localhost:3000/books/giaMaxMin?min=60000&max=100000
router.get("/giaMaxMin", async function (req, res) {
  try {
    const { max, min } = req.query;
    const data = await bookModel.find({ giaTien: { $gt: min, $lt: max } });
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

// Lấy danh sách có nhà xuất bản là NXBTPHCM
// http://localhost:3000/books/NXB/NXBTPHCM
router.get("/NXB/:nhaXuatBan", async function (req, res) {
  try {
    const { nhaXuatBan } = req.params;
    const data = await bookModel.find({ nhaXuatBan: nhaXuatBan });
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

// lấy chi tiết sản phẩm theo ID
// http://localhost:3000/books/chitiet/ nhập id cần tìm
router.get("/chitiet/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const data = await bookModel.findById(id);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

//lấy danh sách thuộc NXBTPHCM & giaTien > 100000
// http://localhost:3000/books/NXBGiaTien?nhaXuatBan=NXBTPHCM&giaTien=100000
router.get("/NXBGiaTien", async function (req, res) {
  try {
    const { nhaXuatBan, giaTien } = req.query;
    const data = await bookModel.find({
      $and: [{ nhaXuatBan: nhaXuatBan }, { giaTien: { $gt: giaTien } }],
    });
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

// Sắp xếp danh sách giảm dần
// http://localhost:3000/books/giamDan
router.get("/giamDan", async function (req, res) {
  try {
    const data = await bookModel.find().sort({ giaTien: -1 });
    res.status(400).json(data);
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

// thêm dữ liệu
// http://localhost:3000/books/add
router.post("/add", async function (req, res) {
  try {
    const { tuaDeSach, tacGia, nhaXuatBan, giaTien } = req.body;
    const newBook = { tuaDeSach, tacGia, nhaXuatBan, giaTien };
    await bookModel.create(newBook);
    res.status(200).json({ status: true, message: "Thêm Book thành công" });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

// Xoá dữ liệu
// http://localhost:3000/books/delete/Nhập id cần xoá
router.delete("/delete/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const findBook = await bookModel.findByIdAndDelete(id);
    if (findBook) {
      res.status(200).json({ status: true, message: "Xoá Thành công" });
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy ID" });
    }
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

// sửa dữ liệu
// http://localhost:3000/books/edit
router.put("/edit", async function (req, res) {
  try {
    const { id, tuaDeSach, tacGia, nhaXuatBan, giaTien } = req.body;
    const findBook = await bookModel.findById(id);

    if (findBook) {
      findBook.tuaDeSach = tuaDeSach ? tuaDeSach : findBook.tuaDeSach;
      findBook.tacGia = tacGia ? tacGia : findBook.tacGia;
      findBook.nhaXuatBan = nhaXuatBan ? nhaXuatBan : findBook.nhaXuatBan;
      findBook.giaTien = giaTien ? giaTien : findBook.giaTien;

      await findBook.save();
      res.status(200).json({ status: true, message: "Sửa thành công" });
    } else {
      res.status(404).json({ status: true, message: "Không tìm thấy ID" });
    }
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

module.exports = router;
