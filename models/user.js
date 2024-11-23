const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema == collection
const ObjectId = Schema.ObjectId;

const user = new Schema({
  id: { type: ObjectId },
  userName: { type: String },
  passWord: { type: String },
});

module.exports = mongoose.models.user || mongoose.model("user", user);
