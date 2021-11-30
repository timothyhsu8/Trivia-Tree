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
        category: String
        tags: [String]
        isTimerForQuiz: Boolean
        quizTimer: String
        questionTimer: String
        quizShuffled: Boolean
        quizInstant: Boolean
        rating: Float
        averageScore: Float
        medianScore: Float
        comments: [Comment!]
        icon: String
        numFavorites: Int
        numAttempts: Int
        numRatings: Int
        createdAt: String
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
        replies: [Reply!]
        createdAt: String
    }

    type Reply {
        user: User
        reply: String!
        createdAt: String
        
    }

    input QuizInput {
        quizId: ID
        title: String
        questions: [QuestionInput]
        description: String
        category: String
        icon: String
        isTimerForQuiz: Boolean
        quizTimer: String
        questionTimer: String
        quizShuffled: Boolean
        quizInstant: Boolean
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
        searchQuizzes(searchText: String!): [Quiz]
    }
    extend type Mutation {
        createQuiz(quizInput: QuizInput!): Quiz
        createQuizApollo(quizInput: QuizInput!): Quiz
        updateQuiz(quizInput: QuizInput!): Quiz
        deleteQuiz(quizId: ID!): Quiz
        favoriteQuiz(quizId: ID!, userId: ID!): Boolean
        unfavoriteQuiz(quizId: ID!, userId: ID!): Boolean
        rateQuiz(quizId: ID!, rating: Int!): Quiz
    }
`;
