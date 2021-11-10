const Platform = require('../../models/Platform');
// const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	Query: {
		async getPlatforms() {
			try {
				const platforms = await Platform.find()
				return platforms;
			} catch (err) {
				throw new Error(err);
			}
		},

        async getPlatform(_, { platformId }) {
            try {
                const platform = await Platform.findById(platformId)
                    // .populate('user')
                    // .exec();
                if (platform) {
                    return platform;
                } else {
                    throw new Error('Platform not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
	},

	Mutation: {
		async createPlatform(
            _,
            { platformInput: { 
                name,
                iconImage,
                bannerImage,
                background,
                tags
            
            } },
            context
        ) {
            
            if (name.trim() === '') {
                throw new Error('Platform name cannot be blank');
            }

            let iconEffect = null
            let bannerEffect = null
            let followers = []
            let playlists = []

            const newPlatform = new Platform({
                user: context.req.user._id,
                name,
                iconImage,
                iconEffect: iconEffect,
                bannerImage,
                bannerEffect: bannerEffect,
                background,
                followers: followers,
                tags,
                playlists: playlists
            });

            const platform = await newPlatform.save();

            return platform;
        },

        async deletePlatform(_, { platformId }, context) {
            try {
                const platform = await Platform.findById(platformId);
                // if (!platform.user.equals(context.req.user._id)) {
                //     throw new Error('You are not the creator of this platform');
                // }
                await platform.delete();
                return platform;
            } catch (err) {
                throw new Error(err);
            }
        }
	}
};
