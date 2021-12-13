const Platform = require('../../models/Platform');
const Playlist = require('../../models/Playlist')
const Quiz = require('../../models/Quiz');
const Reply = require('../../models/Reply');
const Post = require('../../models/Post')
const User = require('../../models/User');
const cloudinary = require('cloudinary').v2;

module.exports = {
	Query: {
		async getPlatforms() {
			try {
				const platforms = await Platform.find()
                .populate('user')
                .populate({
                    path: 'quizzes',
                    populate: { path: 'platform', model: 'Platform' },
                })
                .populate({
                    path: 'followers'
                })
                .exec();
				return platforms;
			} catch (err) {
				throw new Error(err);
			}
		},
        async getPlatformOfTheDay() {
			try {
				const platform = await Platform.findOne({ isPlatformOfTheDay: true })
                .populate({
                    path: 'user',
                    populate: [{
                        path: 'quizzesMade',
                        populate: { 
                            path: 'platform', 
                            model: 'Platform' 
                        },
                    }]
                })
                .populate({
                    path: 'quizzes',
                    populate: { path: 'platform', model: 'Platform' },
                })
                .populate({
                    path: 'followers'
                })
                .exec();
				return platform;
			} catch (err) {
				throw new Error(err);
			}
		},
        async getPlatform(_, { platformId }) {
            try {
                const platform = await Platform.findById(platformId)
                .populate({
                    path: 'user',
                    populate: [{
                        path: 'quizzesMade',
                        populate: { 
                            path: 'platform', 
                            model: 'Platform' 
                        },
                    }]
                })
                .populate({
                    path: 'quizzes',
                    populate: { path: 'platform', model: 'Platform' },
                })
                .populate({
                    path: 'followers'
                })
                .populate({
                    path: 'playlists',
                    populate: {
                        path: 'quizzes',
                        populate: {
                            path: 'platform',
                            model: 'Platform'
                        }
                    }
                })
                .populate({
                    path: 'posts',
                    populate: [{
                        path: 'user',
                        model: 'User'
                    },
                    {
                        path: 'replies',
                        populate: {
                            path: 'user',
                            model: 'User'
                        }
                    },
                    {
                        path: 'likedBy'
                    }]
                })
                .exec();

                if (platform) {
                    return platform;
                } else {
                    throw new Error('Platform not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async searchPlatforms(_, { searchText, page, sortType }) {
            try {
                let sort = null
                if (sortType === "sort_newest" || sortType === undefined)
                    sort = { createdAt: -1 }
                if (sortType === "sort_popular")
                    sort = { createdAt: -1 }
                if (sortType === "sort_abc")
                    sort = { name: 1 }

                const platforms = await Platform.paginate({name: { "$regex": searchText, "$options": "i"}},
                {page: page, limit: 10, sort: sort, populate: 'user'});
                return platforms.docs;
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
            let description = "Platform Description"

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
            await User.findByIdAndUpdate(context.req.user._id, {
                $push: { platformsMade: platform._id },
            });

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
            if (!platform.user.equals(context.req.user._id)) {
                throw new Error('You are not the creator of this platform');
            }

            if (name.trim() === '') {
                throw new Error('Platform title cannot be blank');
            }
            
            if (name.length > 35) {
                throw new Error('Platform name cannot be greater than 35 characters');
            }
            
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
            
            if (description.length > 250) {
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

                if (!platform.user.equals(context.req.user._id)) {
                    throw new Error('You are not the creator of this platform');
                }

                await User.findByIdAndUpdate(context.req.user._id, {
                    $pull: { platformsMade: platform._id, featuredPlatforms: platform._id },
                });
                await User.updateMany(
                    {
                        following: platform._id,
                    },
                    {
                        $pull: {
                            following: platform._id,
                        },
                    }
                );
                await platform.delete();
                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },

        // Creates a new playlist for this platform
        async addPlaylistToPlatform(_, { platformId, playlistName }, context) {
            try {
                const newPlaylist = new Playlist({
                    name: playlistName,
                    quizzes: []
                });
                
                const platform = await Platform.findByIdAndUpdate(platformId, {
                    $push: { playlists: newPlaylist }
                })

                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },


        // Removes specified playlist from a platform
        async removePlaylistFromPlatform(_, { platformId, playlistId }, context) {
            try {
                const platform = await Platform.findById(platformId)
                
                if (platform === undefined)
                    throw new Error('Platform does not exist');

                if (!platform.user.equals(context.req.user._id)) 
                    throw new Error('You are not the creator of this platform');

                // Remove playlist from platform
                for (let i = 0; i < platform.playlists.length; i++)
                    if(platform.playlists[i]._id.toString() === playlistId) {
                        platform.playlists.splice(i, 1)
                    }
                
                platform.save()
    
                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },

        // Adds quiz to the platform 
        async addQuizToPlaylist(_, { platformId, playlistId, quizId }, context) {
            try {
                const platform = await Platform.findById(platformId);
                const quiz = await Quiz.findById(quizId);

                if (platform === undefined)
                    throw new Error('Platform does not exist');

                if (!platform.user.equals(context.req.user._id)) 
                    throw new Error('You are not the creator of this platform');

                if (quiz === undefined)
                    throw new Error('Quiz does not exist');

                
                // If quiz doesn't already exist on the platform, add it
                let addToPlatform = true
                for (let i = 0; i < platform.quizzes.length; i++) 
                    if (platform.quizzes[i]._id.toString() === quizId)
                        addToPlatform = false
                
                if (addToPlatform)
                    platform.quizzes.push(quiz)
                
                // Add quiz to playlist
                for (let i = 0; i < platform.playlists.length; i++) 
                    if (platform.playlists[i]._id.toString() === playlistId) 
                        platform.playlists[i].quizzes.push(quiz)
                
                platform.save()

                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },

         // Adds quiz to the platform 
         async removeQuizFromPlaylist(_, { platformId, playlistId, quizId }, context) {
            try {
                const platform = await Platform.findById(platformId);

                if (platform === undefined)
                    throw new Error('Platform does not exist');

                if (!platform.user.equals(context.req.user._id)) {
                    throw new Error('You are not the creator of this platform');
                }

                // Find playlist
                let playlist = null
                for (let i = 0; i < platform.playlists.length; i++) 
                    if (platform.playlists[i]._id.toString() === playlistId)
                        playlist = platform.playlists[i]

                if (playlist === null)
                    throw new Error('Could not find playlist');
                
                // Remove quiz from playlist
                for (let i = 0; i < playlist.quizzes.length; i++)
                    if (playlist.quizzes[i]._id.toString() === quizId)
                        playlist.quizzes.splice(i, 1)
                
                platform.save()

                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },

        async editPlaylist(
            _,
            {
                playlistInput: {
                    platformId,
                    playlistId,
                    name,
                    moveUp,
                    moveDown
                },
            },
            context
        ) {
            let platform = await Platform.findById(platformId);
            let playlistIndex = -1;

            // Find specified playlist index
            for (let i = 0; i < platform.playlists.length; i++)
                if (platform.playlists[i]._id.toString() === playlistId) {
                    playlistIndex = i;
                    break;
                }

            // Update name
            if (name !== null && name !== platform.playlists[playlistIndex].name) {
                platform.playlists[playlistIndex].name = name
            }

            // Move playlist up
            if (moveUp && playlistIndex !== 0 && platform.playlists.length >= 2) {
                let temp = platform.playlists[playlistIndex - 1]
                platform.playlists[playlistIndex - 1] = platform.playlists[playlistIndex]
                platform.playlists[playlistIndex] = temp
            }

            // Move playlist down
            if (moveDown && playlistIndex !== platform.playlists.length - 1 && platform.playlists.length >= 2) {
                let temp = platform.playlists[playlistIndex + 1]
                platform.playlists[playlistIndex + 1] = platform.playlists[playlistIndex]
                platform.playlists[playlistIndex] = temp
            }
            
            platform.save()
            return platform;
        },

        // Adds quiz to the platform 
        async addQuizToPlatform(_, { platformId, quizId }, context) {
            try {
                const platform = await Platform.findByIdAndUpdate(platformId, {
                    $push: { quizzes: quizId },
                })
                .populate({
                    path: 'quizzes',
                    populate: { path: 'platform', model: 'Platform' },
                })
                .exec()
                
                if (!platform.user.equals(context.req.user._id)) {
                    throw new Error('You are not the creator of this platform');
                }

                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },

         // Removes quiz from platform (Only removes from the platform, doesn't delete the quiz entirely)
         async removeQuizFromPlatform(_, { platformId, quizId }, context) {
            try {
                // Remove quiz from the main quizzes array
                const platform = await Platform.findByIdAndUpdate(platformId, {
                    $pull: { quizzes: quizId },
                })
                .populate({
                    path: 'quizzes',
                    populate: { path: 'platform', model: 'Platform' },
                })
                .exec()
                
                // Remove quiz from all playlists it was in
                for (let i = 0; i < platform.playlists.length; i++) 
                    for (let j = 0; j < platform.playlists[i].quizzes.length; j++){
                        if (platform.playlists[i].quizzes[j]._id.toString() === quizId){
                            platform.playlists[i].quizzes.splice(j, 1)
                        }
                    }
                
                platform.save()
                return platform;
            } catch (err) {
                throw new Error(err);
            }
        },

        async followPlatform(_, { platformId, userId }, context) {
            try {
                const platform = await Platform.findByIdAndUpdate(platformId, {
                    $push: { followers: userId },
                })


                const user = await User.findByIdAndUpdate(userId, {
                    $push: { following: platformId },
                })

                
                return user;
            } catch (err) {
                throw new Error(err);
            }
        },

        async unfollowPlatform(_, { platformId, userId }, context) {
            try {
                const platform = await Platform.findByIdAndUpdate(platformId, {
                    $pull: { followers: userId },
                })


                // const user = await User.findByIdAndUpdate(userId, {
                //     $pull: { following: platformId },
                // })
                // .populate({
                //     path: 'following',
                //     populate: { path: 'platform', model: 'Platform' },
                // })

                // .exec()

                const user = await User.findById(userId);


                for(let i = 0; i < user.following.length; i++){
                    if(user.following[i] == platformId){
                        console.log("here")
                        user.following.splice(i,1);    
                    }
                }
    
                user.save();
                
                return user;
            } catch (err) {
                throw new Error(err);
            }
        },
        async addPost(_, { platform_id, user_id, postText, postImage}) {
            const platform = await Platform.findById(platform_id);

            imageUrl = null;

            if(postImage != null) {
                await cloudinary.uploader.upload(postImage, (error, result) => {
                    if (error) {
                        throw new Error('Could not upload image');
                    }
                    imageUrl = result.secure_url;
                });
            }

            const newPost = new Post({
                user: user_id,
                replies: [],
                postText: postText,
                postImage: imageUrl
            });

            platform.posts.push(newPost)

            platform.save();

            return platform;
        },
        async deletePost(_, { platform_id, user_id, post_id}) {
            const platform = await Platform.findById(platform_id);

            for(let i = 0; i < platform.posts.length; i++){
                if(platform.posts[i]._id == post_id){
                    platform.posts.splice(i,1);
                    break;
                }
            }

            platform.save();

            return platform;
        },
        async addPostReply(_, { platform_id, user_id, post_id, reply }) {
            const platform = await Platform.findById(platform_id);

            const newReply = new Reply({
                user: user_id,
                reply: reply,
            });

            let posts = platform.posts;

            for (let i = 0; i < posts.length; i++) {
                if (posts[i]._id == post_id) {
                    posts[i].replies.push(newReply);
                    break;
                }
            }

            platform.posts = posts;

            platform.save();

            return platform;
        },
        async deletePostReply(_, { platform_id, user_id, post_id, reply_id }) {
            const platform = await Platform.findById(platform_id);


            let posts = platform.posts;

            for (let i = 0; i < posts.length; i++) {
                if (posts[i]._id == post_id) {
                    for (let j = 0; j < posts[i].replies.length; j++){
                        if(posts[i].replies[j]._id == reply_id){
                            posts[i].replies.splice(j, 1);
                            break;
                        }
                    }
                    break;
                }
            }

            platform.posts = posts;

            platform.save();

            return platform;
        },
        async likePost(_, { platform_id, user_id, post_id }) {
            const platform = await Platform.findById(platform_id);

            let posts = platform.posts;

            for(let i = 0; i < posts.length; i++){
                if(posts[i]._id == post_id){
                    posts[i].numLikes = posts[i].numLikes + 1; 
                    posts[i].likedBy.push(user_id);
                    break;
                }
            }

            platform.posts = posts

            platform.save();

            return platform;
        },
        async unlikePost(_, { platform_id, user_id, post_id }) {
            const platform = await Platform.findById(platform_id);

            let posts = platform.posts;

            for(let i = 0; i < posts.length; i++){
                if(posts[i]._id == post_id){
                    posts[i].numLikes = posts[i].numLikes - 1; 
                    for(let j = 0; j < posts[i].likedBy.length; j++){
                        if(posts[i].likedBy[j] == user_id){
                            posts[i].likedBy.splice(j,1);
                            break;
                        }
                        break;
                    }
                    break;
                }
            }

            platform.posts = posts

            platform.save();

            return platform;
        }

	}
};
