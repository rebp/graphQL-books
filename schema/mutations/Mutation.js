const graphql = require('graphql');
const AuthorMutations = require('./AuthorMutations');
const BookMutations = require('./BookMutations');

const { GraphQLObjectType } = graphql;

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		...AuthorMutations,
		...BookMutations
	}
});

module.exports = Mutation;
