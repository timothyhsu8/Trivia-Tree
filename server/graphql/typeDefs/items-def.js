const { gql } = require('apollo-server-express');

module.exports = gql`
    type Item {
        _id: ID!
        type: String!
        name: String!
        template: String
        item: String
        price: Int!
        weeklySpecial: Boolean
    }

    extend type Query {
        getShopItems: [[Item]]
    }

    extend type Mutation {
        purchaseItem(userId: ID!): User
    }

`;
