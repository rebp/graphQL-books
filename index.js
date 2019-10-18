const express = require('express');
const dotenv = require('dotenv');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' });

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

if (process.env.NODE_ENV === 'development') {
	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => {
		console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
	});
}
