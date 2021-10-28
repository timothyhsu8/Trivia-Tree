const { gql } = require('apollo-server-express');

module.exports = gql`
    type Quiz {
        _id: ID!
        user_id: ID
        platform_id: ID
        title: String!
        questions: [Question!]!
        numQuestions: Int!
        description: String
        categories: [String]
        tags: [String]
        quizTimer: Int
        questionTimer: Int
        quizShuffled: Boolean
        quizInstant: Boolean
        rating: Int
        averageScore: Int
        medianScore: Int
        comments: [Comment!]
        icon: String
        numFavorites: Int
        numAttempts: Int
    }

    type Question {
        _id: ID!
        question: String!
        answerChoices: [String!]!
        answer: [String!]!
        questionType: Int
    }

    type Comment {
        user_id: ID!
        comment: String!
    }

    input QuizInput {
        title: String!
        questions: [QuestionInput!]!
    }

    input QuestionInput {
        question: String!
        answerChoices: [String!]!
        answer: [String!]!
        questionType: Int
    }

    input CommentInput {
        user_id: ID!
        comment: String!
    }

    extend type Query {
        getQuizzes: [Quiz]
        getQuiz(quizId: ID!): Quiz
    }
    extend type Mutation {
        createQuiz(quizInput: QuizInput!): Quiz
        deleteQuiz(quizId: ID!): String!
    }
`;
