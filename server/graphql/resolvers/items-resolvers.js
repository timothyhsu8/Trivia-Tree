const Item = require('../../models/Item');
const User = require('../../models/User');

const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	Query: {
		async getShopItems() {
            try {
				shopItems = []
				const bannerEffects = await Item.find({ type: "bannerEffect" })
				const iconEffects = await Item.find({ type: "iconEffect" })
				const backgrounds = await Item.find({ type: "background" })
				const weeklySpecials = await Item.find({ weeklySpecial: true })

				shopItems.push(bannerEffects)
				shopItems.push(iconEffects)
				shopItems.push(backgrounds)
				shopItems.push(weeklySpecials)
                return shopItems;
            } catch (err) {
                throw new Error(err);
            }
        }
	},

	Mutation: {
		// async purchaseItem(_, { userId, item }, context) {
        //     const user = await User.findById(userId);
		// 	console.log(userId)

        //     // user.featuredQuizzes.push(quiz);
        //     // user.save();
        // },
	}
};
