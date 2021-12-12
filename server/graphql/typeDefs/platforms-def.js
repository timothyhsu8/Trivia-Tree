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
        isPlatformOfTheDay: Boolean
        posts: [Post]
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

    type Post {
        _id: ID!
        user: User
        postText: String!
        postImage: String
        replies: [Reply!]
        createdAt: String
    }

    type Comment {
        _id: ID!
        user: User
        comment: String!
        replies: [Reply!]
        createdAt: String
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
        getPlatformOfTheDay: Platform
        getPlatform(platformId: ID!): Platform
        searchPlatforms(searchText: String!, page: Int!, sortType: String): [Platform]
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
        addPost(platform_id: ID!, user_id: ID!, postText: String!, postImage: String): Platform
        deletePost(platform_id: ID!, user_id: ID!, post_id: ID!): Platform
        addPostReply(platform_id: ID!, user_id: ID!, post_id: ID!, reply: String!): Platform
        deletePostReply(platform_id: ID!, user_id: ID!, post_id: ID!, reply_id: ID!) : Platform
    }
`;
