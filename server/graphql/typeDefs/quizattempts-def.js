const { gql } = require('apollo-server-express');

module.exports = gql`
    type QuizAttempt {
        _id: ID!
        user_id: ID
        quiz_id: ID!
        elapsedTime: Int
        score: Int!
        answerChoices: [[String!]!]!
        questions: [String!]!
    }

    input QuizAttemptInput {
        quiz_id: ID!
        answerChoices:  [[String!]!]!
    }


    extend type Mutation {
        submitQuiz(quizAttemptInput: QuizAttemptInput!): QuizAttempt
    }

`;
