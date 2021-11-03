const { gql } = require('apollo-server-express');

module.exports = gql`
    type QuizAttempt {
        _id: ID!
        user: User
        quiz: Quiz
        elapsedTime: Int
        score: Int!
        answerChoices: [[String!]!]!
        questions: [String!]!
        numCorrect: Int!
    }

    input QuizAttemptInput {
        quiz_id: ID!
        answerChoices: [[String!]!]!
    }

    extend type Query {
        getQuizAttempt(_id: ID!): QuizAttempt
    }

    extend type Mutation {
        submitQuiz(quizAttemptInput: QuizAttemptInput!): QuizAttempt
    }
`;
