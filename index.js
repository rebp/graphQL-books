const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// connect to mlab database
mongoose.connect('mongodb://mongo:27017/graphql');
// mongoose.connect('mongodb://rebp:rebp123@ds123963.mlab.com:23963/graphql');
mongoose.connection.once('open', () => {
	console.log('conneted to database');
});

const app = express();

// bind express with graphql
app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

app.listen(4000, () => {
	console.log('now listening for requests on port 4000');
});
