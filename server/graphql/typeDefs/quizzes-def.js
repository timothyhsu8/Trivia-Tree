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
        ratings: [Rating]
        averageScore: Float
        medianScore: Float
        comments: [Comment!]
        icon: String
        numFavorites: Int
        numAttempts: Int
        numRatings: Int
        createdAt: String
        isFeatured: Boolean
    }

    type Question {
        _id: ID!
        question: String!
        answerChoices: [String!]!
        answer: [String!]!
        questionType: Int
    }

    type Comment {
        _id: ID!
        user: User
        comment: String!
        replies: [Reply!]
        createdAt: String
    }

    type Reply {
        _id: ID!
        user: User
        reply: String!
        createdAt: String
    }

    type Rating {
        _id: ID!
        user: User
        rating: Int
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
        getFeaturedQuizzes: [Quiz]
        getQuiz(quizId: ID!): Quiz
        searchQuizzes(searchText: String!): [Quiz]
        getPostRecommendations(quiz_id: ID): [Quiz]
        getUserRecommendations(user_id: ID): [Quiz]
        getRating(quizId: ID!, userId: ID!): Int
    }
    extend type Mutation {
        createQuiz(quizInput: QuizInput!): Quiz
        createQuizApollo(quizInput: QuizInput!): Quiz
        updateQuiz(quizInput: QuizInput!): Quiz
        deleteQuiz(quizId: ID!): Quiz
        favoriteQuiz(quizId: ID!, userId: ID!): Boolean
        unfavoriteQuiz(quizId: ID!, userId: ID!): Boolean
        rateQuiz(quizId: ID!, userId: ID!, rating: Int!): Quiz
        addComment(quiz_id: ID!, user_id: ID!, comment: String!): Quiz
        deleteComment(quiz_id: ID!, user_id: ID!, comment_id: ID!): Quiz
        addReply(quiz_id: ID!, user_id: ID!, comment_id: ID!, reply: String!): Quiz
        deleteReply(quiz_id: ID!, user_id: ID!, comment_id: ID!, reply_id: ID!): Quiz
    }
`;
