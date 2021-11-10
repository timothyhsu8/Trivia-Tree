const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  Query: {
    async getUsers() {
		try {
			const users = await User.find()
			return users;
		} catch (err) {
			throw new Error(err);
		}
	},
    async getUser(_, { _id }) {
		const user = await User.findById(_id)
        return user;
    }
  },
  Mutation: {
  }
};
