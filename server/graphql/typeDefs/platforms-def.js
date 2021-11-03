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

    type Playlist {
        name: String!
        quizzes: [Quiz]
    }
`;
