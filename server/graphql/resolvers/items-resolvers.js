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
		async purchaseItem(_, { userId, itemId }, context) {
			try {
				const user = await User.findById(userId);
				const item = await Item.findById(itemId);
				
				// Checks if user can afford the item
				if (user.currency < item.price){
					throw new Error('You cannot afford this item');
				}			
				
				let itemArray = []
				if (item.type === "bannerEffect") 
					itemArray = user.ownedBannerEffects
				if (item.type === "iconEffect") 
					itemArray = user.ownedIconEffects
				if (item.type === "background") 
					itemArray = user.ownedBackgrounds
				
				itemArray.forEach(item => {
					if (item._id.toString() === itemId)
						throw new Error('You already own this item')
				})

				user.currency = user.currency - item.price
				itemArray.push(item)
				user.save();

				return item
			} catch (err) {
                throw new Error(err);
            }
        },
	}
};
