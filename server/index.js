const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const resolvers = require('./resolvers/root-resolver');
const { typeDefs }  = require('./typedefs/root-def');
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const xssClean = require('xss-clean');


// create express server handling our middleware 
const app = express();

// since we presume cors is enabled, this next step is not optional, so cors
// is enable here instead of in options
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

const corsPolicy = async(req, res, next) => {
	res.set("Access-Control-Allow-Origin", req.headers.origin);
    res.set("Access-Control-Allow-Credentials", true);
	next();
}

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
	context: ({req, res}) => ({ req, res })
});

// since the express server has cors configured, cors on the apollo server
// can be false; passing the same options as defined on the express instance
// works as well
server.applyMiddleware({ app , cors: false});

const MONGO_URI = "mongodb+srv://tamzid12310:Shohana91!@cluster0.igpxc.mongodb.net/TheWorldDataMapper?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {useNewUrlParser: true , useUnifiedTopology: true})
        .then(() => {
            app.listen({ port: 4000 }, () => {
                console.log(`Server ready at http://localhost:4000`);
            })
        })
        .catch(error => {
            console.log(error)
        });