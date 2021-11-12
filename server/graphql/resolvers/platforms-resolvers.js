const Platform = require('../../models/Platform');
// const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;

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

        async searchPlatforms(_, { searchText }) {
            try {
                const platforms = await Platform.find({name: { "$regex": searchText, "$options": "i"}})
                return platforms;
            } catch (err) {
                throw new Error(err);
            }
        }
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
            let description = ""

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
                playlists: playlists,
                description: description
            });

            const platform = await newPlatform.save();

            return platform;
        },
        async updatePlatform(
            _,
            {
                platformInput: {
                    platformId,
                    name,
                    iconImage,
                    bannerImage,
                    description
                },
            },
            context
        ) {
            let platform = await Platform.findById(platformId);
            // if (!platform.user.equals(context.req.user._id)) {
            //     throw new Error('You are not the creator of this platform');
            // }

            if (name.trim() === '') {
                throw new Error('Platform title cannot be blank');
            }
            
            if (name.length >= 40) {
                throw new Error('Platform name cannot be greater than 40 characters');
            }

            // if name has special characters
            
            // Update icon if the user changed it
            let imageUrl;
            if (iconImage === 'NoChange')
                console.log("No change made to platform icon")
            
            else{
                if (iconImage === 'No Image') {
                    imageUrl = 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png';
                } else {
                    await cloudinary.uploader.upload(iconImage, (error, result) => {
                        if (error) {
                            throw new Error('Could not upload image');
                        }
                        imageUrl = result.secure_url;
                    });
                }
            }

            // Update banner if the user changed it
            let bannerUrl;
            if (bannerImage === 'NoChange')
                console.log("No change made to platform banner")
            
            else{
                if (bannerImage === 'No Image') {
                    bannerUrl = 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png';
                } else {
                    await cloudinary.uploader.upload(bannerImage, (error, result) => {
                        if (error) {
                            throw new Error('Could not upload banner');
                        }
                        bannerUrl = result.secure_url;
                    });
                }
            }
            
            if (description.length >= 250) {
                throw new Error('Platform description cannot be greater than 250 characters');
            }

            const updates = {
                user: context.req.user._id,
                name,
                iconImage: imageUrl,
                bannerImage: bannerUrl,
                description
            };
            platform = await Platform.findByIdAndUpdate(platformId, updates, { new: true });
        
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
