const { gql } = require('apollo-server-express');

module.exports = gql`
    type Item {
        _id: ID!
        category: String!
        name: String!
        image: String
        price: Int!
        weeklySpecial: Boolean
    }

`;
