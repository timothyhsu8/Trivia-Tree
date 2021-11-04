const { gql } = require('apollo-server-express');

module.exports = gql`
    type Quiz {
        _id: ID!
        user: User
        platform: Platform
        title: String!
        questions: [Question!]!
        numQuestions: Int!
        description: String
        categories: [String]
        tags: [String]
        quizTimer: String
        questionTimer: String
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
        user: User
        comment: String!
    }

    input QuizInput {
        title: String!
        questions: [QuestionInput!]!
        description: String
        quizTimer: String
    }

    input QuestionInput {
        question: String!
        answerChoices: [String!]!
        answer: [String!]!
        questionType: Int
    }

    input CommentInput {
        user: ID!
        comment: String!
    }

    extend type Query {
        getQuizzes: [Quiz]
        getQuiz(quizId: ID!): Quiz
    }
    extend type Mutation {
        createQuiz(quizInput: QuizInput!): Quiz
        createQuizApollo(quizInput: QuizInput!): Quiz
        deleteQuiz(quizId: ID!): Quiz
    }
`;
