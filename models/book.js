const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
	name: {
		type: String,
		validate: {
			validator: value => {
				return value.length > 2;
			},
			message: 'Must be at least 2 characters long'
		}
	},
	genre: String,
	authorId: String
});

module.exports = mongoose.model('Book', bookSchema);
