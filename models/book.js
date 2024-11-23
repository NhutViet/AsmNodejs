const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema == collection
const ObjectId = Schema.ObjectId;

const book = new Schema({
  id: { type: ObjectId },
  tuaDeSach: { type: String },
  tacGia: { type: String },
  nhaXuatBan: { type: String },
  giaTien: { type: Number },
});

module.exports = mongoose.models.book || mongoose.model("book", book);
