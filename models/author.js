const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: value => {
			return validator.isEmail(value);
		}
	},
	age: { type: String, required: false },
	gender: { type: String, required: false }
});

module.exports = mongoose.model('Author', authorSchema);
