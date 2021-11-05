const { gql } = require('apollo-server-express');

module.exports = gql`
    type Platform {
        _id: ID!
        user: User
        name: String!
        iconImage: String
        iconEffect: Item
        bannerImage: String
        bannerEffect: Item
        background: String
        followers: [User]
        tags: [String]
        playlists: [Playlist]
    }

    input PlatformInput {
        name: String!
    }

    type Playlist {
        name: String!
        quizzes: [Quiz]
    }

    extend type Query {
        getPlatforms: [Platform]
    }

    extend type Mutation {
        createPlatform(platformInput: PlatformInput!): Platform
    }
`;
