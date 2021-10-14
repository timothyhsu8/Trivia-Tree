const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const path = require('path');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// create express server handling our middleware
const app = express();
const PORT = process.env.PORT || 5000;

// since we presume cors is enabled, this next step is not optional, so cors
// is enable here instead of in options
// app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

const corsPolicy = async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
    res.set('Access-Control-Allow-Credentials', true);
    next();
};

app.options('*', cors());
app.use(corsPolicy);

const serverOptions = (app) => {
    app.use(helmet());
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(mongoSanitize());
    app.use(xssClean());
    app.use(morgan('dev'));
    app.use(cookieParser());
};

// middleware application is configured onto express
serverOptions(app);

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req, res }) => ({ req, res }),
});

startServer();

async function startServer() {
    // since the express server has cors configured, cors on the apollo server
    // can be false; passing the same options as defined on the express instance
    // works as well
    await server.start();
    server.applyMiddleware({ app, path: '/graphql', cors: true });

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('../client/build'));
        app.get('*', (request, response) => {
            response.sendFile(
                path.join(__dirname, '../client/build', 'index.html')
            );
        });
    } else {
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
    }

    mongoose
        .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
        .then(() => {
            console.log('MongoDB Connected');
            return app.listen({ port: PORT });
        })
        .then((res) => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
        .catch((err) => {
            console.error(err);
        });
}
