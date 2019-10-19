const graphql = require('graphql');
const Author = require('../../models/Author');

const { AuthorType, GenderType } = require('./../types');

const { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;

const AuthorMutations = {
	addAuthor: {
		type: AuthorType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			email: { type: new GraphQLNonNull(GraphQLString) },
			age: { type: GraphQLInt },
			gender: { type: GenderType }
		},
		resolve(parent, args) {
			const author = new Author({
				name: args.name,
				email: args.email,
				age: args.age,
				gender: args.gender
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
			gender: { type: GenderType }
		},
		async resolve(parent, args) {
			try {
				const author = await Author.findById(args.id).lean(true);
				const updatedAuthor = {
					name: !args.name ? author.name : args.name,
					email: !args.email ? author.email : args.email,
					age: !args.age ? author.age : args.age,
					gender: !args.gender ? author.gender : args.gender
				};

				return Author.findOneAndUpdate({ _id: args.id }, updatedAuthor, {
					new: true,
					runValidators: true
				});
			} catch (err) {
				console.log(`${err}`.red);
			}
		}
	},
	deleteAuthor: {
		type: AuthorType,
		args: { id: { type: new GraphQLNonNull(GraphQLID) } },
		resolve(parent, args) {
			return Author.findOneAndDelete({ _id: args.id });
		}
	}
};

module.exports = AuthorMutations;
