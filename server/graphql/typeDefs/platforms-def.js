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
        quizzes: [Quiz]
        playlists: [Playlist]
        description: String
    }

    input PlatformInput {
        platformId: ID
        name: String!
        iconImage: String
        bannerImage: String
        background: String
        tags: [String]
        description: String
    }

    type Playlist {
        name: String!
        quizzes: [Quiz]
    }

    extend type Query {
        getPlatforms: [Platform]
        getPlatform(platformId: ID!): Platform
        searchPlatforms(searchText: String!): [Platform]
    }

    extend type Mutation {
        createPlatform(platformInput: PlatformInput!): Platform
        updatePlatform(platformInput: PlatformInput!): Platform
        deletePlatform(platformId: ID!): Platform
        addPlaylistToPlatform(platformId: ID!, playlistName: String!): Platform
        addQuizToPlatform(platformId: ID!, quizId: ID!): Platform
        removeQuizFromPlatform(platformId: ID!, quizId: ID!): Platform
        followPlatform(platformId: ID!, userId: ID!): User
        unfollowPlatform(platformId: ID!, userId: ID!): User
    }
`;
