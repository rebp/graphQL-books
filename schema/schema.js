const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');

const {
	GraphQLEnumType,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} = graphql;

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return Author.findById(parent.authorId);
			}
		}
	})
});

var genderType = new GraphQLEnumType({
	name: 'Gender',
	values: {
		man: { value: 'man' },
		woman: { value: 'woman' }
	}
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
		gender: { type: GraphQLString },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find({ authorId: parent.id });
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Book.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find({});
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Author.findById(args.id);
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return Author.find({});
			}
		}
	}
});

const authorMutations = {
	addAuthor: {
		type: AuthorType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			age: { type: new GraphQLNonNull(GraphQLInt) }
		},
		resolve(parent, args) {
			const author = new Author({
				name: args.name,
				age: args.age
			});
			return author.save();
		}
	},
	editAuthor: {
		type: AuthorType,
		args: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: GraphQLString },
			email: { type: GraphQLString },
			age: { type: GraphQLInt },
			gender: { type: genderType }
		},
		async resolve(parent, args) {
			const author = await Author.findById(args.id);

			const updatedAuthor = {
				name: !args.name ? author.name : args.name,
				email: !args.email ? author.email : args.email,
				age: !args.age ? author.age : args.age,
				gender: !args.gender ? author.gender : args.gender
			};

			return Author.findByIdAndUpdate(args.id, updatedAuthor, { new: true });
		}
	},
	deleteAuthor: {
		type: AuthorType,
		args: { id: { type: new GraphQLNonNull(GraphQLID) } },
		resolve(parent, args) {
			return Author.findOneAndDelete(args.id);
		}
	}
};

const bookMutations = {
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

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		...authorMutations,
		...bookMutations
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
