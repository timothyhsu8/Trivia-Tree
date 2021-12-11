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
        createdAt: String
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
        _id: ID!
        name: String!
        quizzes: [Quiz]
    }

    input PlaylistInput {
        platformId: ID!
        playlistId: ID!
        name: String
        moveUp: Boolean
        moveDown: Boolean
    }

    extend type Query {
        getPlatforms: [Platform]
        getPlatform(platformId: ID!): Platform
        searchPlatforms(searchText: String!, page: Int!): [Platform]
    }

    extend type Mutation {
        createPlatform(platformInput: PlatformInput!): Platform
        updatePlatform(platformInput: PlatformInput!): Platform
        deletePlatform(platformId: ID!): Platform
        addPlaylistToPlatform(platformId: ID!, playlistName: String!): Platform
        removePlaylistFromPlatform(platformId: ID!, playlistId: ID!): Platform
        addQuizToPlaylist(platformId: ID!, playlistId: ID!, quizId: ID!): Platform
        removeQuizFromPlaylist(platformId: ID!, playlistId: ID!, quizId: ID!): Platform
        editPlaylist(playlistInput: PlaylistInput!): Platform
        addQuizToPlatform(platformId: ID!, quizId: ID!): Platform
        removeQuizFromPlatform(platformId: ID!, quizId: ID!): Platform
        followPlatform(platformId: ID!, userId: ID!): User
        unfollowPlatform(platformId: ID!, userId: ID!): User
    }
`;
