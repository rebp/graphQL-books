const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
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

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
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
			age: { type: GraphQLInt }
		},
		async resolve(parent, args) {
			const author = await Author.findById(args.id);

			const updatedAuthor = {
				name: !args.name ? author.name : args.name,
				age: !args.age ? author.age : args.age
			};

			return Author.findByIdAndUpdate(args.id, updatedAuthor, { new: true });
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
