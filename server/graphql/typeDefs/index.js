const { gql } = require('apollo-server-express');
const quizzes = require('./quizzes');

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

module.exports = [setup, quizzes];
