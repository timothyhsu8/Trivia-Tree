const { gql } = require('apollo-server-express');

const items = require('./items-def');
const quizzes = require('./quizzes-def');
const quizattempts = require('./quizattempts-def');
const users = require('./users-def');
const platforms = require('./platforms-def');

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
