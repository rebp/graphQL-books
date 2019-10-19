const graphql = require('graphql');
const Book = require('../../models/Book');

const { BookType } = require('./../types');

const { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;

const BookMutations = {
	addBook: {
		type: BookType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			genre: { type: new GraphQLNonNull(GraphQLString) },
			authorId: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve(parent, args) {
			const book = new Book({
				name: args.name,
				genre: args.genre,
				authorId: args.authorId
			});
			return book.save();
		}
	},
	editBook: {
		type: BookType,
		args: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: GraphQLString },
			age: { type: GraphQLInt }
		},
		async resolve(parent, args) {
			const book = await Book.findById(args.id);

			const updatedBook = {
				name: !args.name ? book.name : args.name,
				age: !args.age ? book.age : args.age
			};

			return Book.findByIdAndUpdate(args.id, updatedBook, { new: true });
		}
	},
	deleteBook: {
		type: BookType,
		args: { id: { type: new GraphQLNonNull(GraphQLID) } },
		resolve(parent, args) {
			return Book.findOneAndDelete(args.id);
		}
	}
};

module.exports = BookMutations;
