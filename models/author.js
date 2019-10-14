const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		validate: {
			validator: value => validator.isEmail(value),
			message: props => `${props.value} is not a valid e-mail address!`
		},
		unique: true
	},
	age: { type: String, required: false },
	gender: { type: String, required: false }
});

module.exports = mongoose.model('Author', authorSchema);
