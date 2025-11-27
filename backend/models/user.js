const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  mobileNumber: { type: String, required: true },
  image: {
  type: String,
  default:
  'https://img.freepik.com/free-photo/portrait-smilingman_23-2148192244.jpg',
  },
  places: [{ type: Schema.Types.ObjectId, ref: 'Place' }]
});
module.exports = mongoose.model("User", userSchema);