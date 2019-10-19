const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

const PORT = process.env.PORT || 4000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
});
