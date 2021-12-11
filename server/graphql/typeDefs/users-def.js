const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        _id: ID!
        email: String!
        displayName: String!
        iconImage: String
        iconEffect: Item
        bannerImage: String
        bannerEffect: Item
        background: Item
        title: String
        bio: String
        currency: Int
        ownedBannerEffects: [Item]
        ownedIconEffects: [Item]
        ownedBackgrounds: [Item]
        quizzesMade: [Quiz]
        quizzesTaken: [Quiz]
        platformsMade: [Platform]
        following: [Platform]
        featuredQuizzes: [Quiz]
        featuredPlatforms: [Platform]
        verified: Boolean
        admin: Boolean
        darkMode: Boolean
        favoritedQuizzes: [Quiz]
        createdAt: String
        recommendationArray: [String]
    }

    input UserInput {
        userId: ID!
        iconImage: String
        bannerImage: String
        bio: String
        bannerEffectId: ID
        iconEffectId: ID
        backgroundId: ID
    }

    input SettingInput {
        userId: ID!
        displayName: String!
        iconImage: String
        darkMode: Boolean
    }

    input SignUpInput {
        userId: ID!
        displayName: String!
        iconImage: String
        categoriesSelected: [String]
    }

    extend type Query {
        getUsers: [User]
        getUser(_id: ID!): User
        searchUsers(searchText: String!): [User]
    }
    extend type Mutation {
        updateUser(userInput: UserInput!): User
        updateSettings(settingInput: SettingInput!): User
        addFeaturedQuiz(userId: ID!, newFeaturedQuizId: ID!): Quiz
        deleteFeaturedQuiz(userId: ID!, deleteFeaturedQuizId: ID!): Quiz
        addFeaturedPlatform(userId: ID!, newFeaturedPlatformId: ID!): Platform
        deleteFeaturedPlatform(userId: ID!, deleteFeaturedPlatformId: ID!): Platform
        resetPlatformsMadeApollo(userId: ID!): User
        deleteUser(userId: ID!): Boolean
        finishSignUp(signUpInput: SignUpInput): User
        updateDarkMode(userId: ID!, darkMode: Boolean!): User
    }
`;
