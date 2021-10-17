const { gql } = require('apollo-server-express');

const items = require('./items');
const quizzes = require('./quizzes');
const quizattempts = require('./quizattempts');
const users = require('./users');
const platforms = require('./platforms');

const setup = gql`
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    type Subscription {
        _empty: String
    }
`;

module.exports = [setup, users, quizzes, items, platforms, quizattempts];
