const { gql } = require('apollo-server-express');

module.exports = gql`
    type QuizAttempt {
        _id: ID!
        user: User
        quiz: Quiz
        elapsedTime: String
        score: Float!
        answerChoices: [[String!]!]!
        questions: [String!]!
        numCorrect: Int!
        attemptNumber: Int
        coinsEarned: Int
        comments: Comment
    }

    input QuizAttemptInput {
        quiz_id: ID!
        user_id: ID
        answerChoices: [[String!]!]!
        elapsedTime: String
    }

    extend type Query {
        getQuizAttempt(_id: ID!): QuizAttempt
        getLeaderboard(quiz_id: ID!): [QuizAttempt]
    }

    extend type Mutation {
        submitQuiz(quizAttemptInput: QuizAttemptInput!): QuizAttempt
    }
`;
