const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// connect to mlab database
// mongoose.connect('mongodb://mongo:27017/graphql');

// connect to mongoDB database
mongoose
	.connect('mongodb://rebp:rebp123@ds123963.mlab.com:23963/graphql')
	.then(() => console.log('Connected to database'))
	.catch(err => console.log(err));

const app = express();

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
