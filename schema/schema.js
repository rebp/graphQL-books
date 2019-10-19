const graphql = require('graphql');

const { GraphQLSchema } = graphql;

const RootQuery = require('./queries/RooyQuery');
const Mutation = require('./mutations/Mutation');

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
