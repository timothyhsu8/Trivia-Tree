const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
require('./auth/passport');

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

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DATABASE_URL,
        }),
    })
);

const serverOptions = (app) => {
    app.use(helmet());
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(mongoSanitize());
    app.use(xssClean());
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
};

// middleware application is configured onto express
serverOptions(app);

//routes
app.use('/auth', require('./routes/auth'));
app.use('/getuser', (req, res) => {
    console.log('getting user data from backend')
    console.log(req.user);2
    res.send(req.user);
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

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
        .connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
        })
        .then((m) => {
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
