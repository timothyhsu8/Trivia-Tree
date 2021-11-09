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
        background: String
        bio: String
        currency: Int
        ownedBannerEffects: [Item]
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
    }
    extend type Query {
        getUsers: [User]
        getUser(_id: ID!): User
    }

`;
