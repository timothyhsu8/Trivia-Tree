const { gql } = require('apollo-server-express');

module.exports = gql`
    type QuizAttempts {
        _id: ID!
        user_id: ID!
        quiz_id: ID!
        elapsedTime: Int!
        score: Int!
        answerChoices: [[String!]!]!
        questions: [String!]!
    }

`;
