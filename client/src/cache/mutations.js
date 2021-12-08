import { gql } from "@apollo/client";

// *NOTE: THIS IS JUST FOR BUILD #1 PROGRESS REVIEW. Change this to allow for generic title/questions later
export const CREATE_QUIZ = gql` 
    mutation CreateQuiz {
        createQuiz(quizInput: {
        title: "This quiz is new!!",
        questions: [{
            question: "1"
            answerChoices: ["yes", "no", "perhaps"]
            answer: "perhaps"
        }]
        }) {
        title
        questions {
            answer
            answerChoices
            question
        }
        }
    }
`;

export const SUBMIT_QUIZ = gql`
    mutation ($quizAttemptInput: QuizAttemptInput!) {
        submitQuiz(quizAttemptInput: $quizAttemptInput) {
            _id
            quiz{
                title
                questions {
                    answer
                    answerChoices
                    question
                }
            }
            score
        }
    }
`;

export const FAVORITE_QUIZ = gql`
    mutation ($quizId: ID!, $userId: ID!) {
        favoriteQuiz(quizId: $quizId, userId: $userId)
    }
`;

export const UNFAVORITE_QUIZ = gql`
    mutation ($quizId: ID!, $userId: ID!) {
        unfavoriteQuiz(quizId: $quizId, userId: $userId)
    }
`;

export const UPDATE_PLATFORM = gql`
    mutation ($platformInput: PlatformInput!) {
        updatePlatform(platformInput: $platformInput) {
            name
            _id
        }
    }
`;


export const ADD_QUIZ_TO_PLATFORM = gql`
mutation ($platformId: ID!, $quizId: ID!) {
    addQuizToPlatform(platformId: $platformId, quizId: $quizId) {
        name
        _id
    }
}
`


export const ADD_PLAYLIST_TO_PLATFORM = gql`
    mutation ($platformId: ID!, $playlistName: String!) {
        addPlaylistToPlatform(platformId: $platformId, playlistName: $playlistName) {
            name
            _id
        }
    }
`;

export const REMOVE_PLAYLIST_FROM_PLATFORM = gql`
    mutation ($platformId: ID!, $playlistId: ID!) {
        removePlaylistFromPlatform(platformId: $platformId, playlistId: $playlistId) {
            name
            _id
        }
    }
`;


export const ADD_QUIZ_TO_PLAYLIST = gql`
mutation ($platformId: ID!, $playlistId: ID!, $quizId: ID!) {
    addQuizToPlaylist(platformId: $platformId, playlistId: $playlistId, quizId: $quizId) {
        name
        _id
    }
}
`

export const REMOVE_QUIZ_FROM_PLAYLIST = gql`
mutation ($platformId: ID!, $playlistId: ID!, $quizId: ID!) {
    removeQuizFromPlaylist(platformId: $platformId, playlistId: $playlistId, quizId: $quizId) {
        name
        _id
    }
}
`

export const EDIT_PLAYLIST = gql`
mutation ($playlistInput: PlaylistInput!) {
    editPlaylist(playlistInput: $playlistInput) {
        name
        _id
    }
}
`

export const REMOVE_QUIZ_FROM_PLATFORM = gql`
mutation ($platformId: ID!, $quizId: ID!) {
    removeQuizFromPlatform(platformId: $platformId, quizId: $quizId) {
        name
        _id
    }
}
`

export const DELETE_PLATFORM = gql`
    mutation ($platformId: ID!) {
        deletePlatform(platformId: $platformId) {
            name
            _id
        }
    }
`;

export const UPDATE_SETTINGS = gql`
    mutation ($settingInput: SettingInput!) {
        updateSettings(settingInput: $settingInput){
            _id
            displayName
            iconImage
            darkMode
        }
    }
`;

export const ADD_FEATURED_QUIZ = gql`
mutation ($userId: ID!, $newFeaturedQuizId: ID!) {
    addFeaturedQuiz(userId: $userId, newFeaturedQuizId: $newFeaturedQuizId) {
        title
    }
}
`

export const DELETE_FEATURED_QUIZ = gql`
mutation ($userId: ID!, $deleteFeaturedQuizId: ID!) {
    deleteFeaturedQuiz(userId: $userId, deleteFeaturedQuizId: $deleteFeaturedQuizId) {
        title
    }
}
`

export const ADD_FEATURED_PLATFORM = gql`
mutation ($userId: ID!, $newFeaturedPlatformId: ID!) {
    addFeaturedPlatform(userId: $userId, newFeaturedPlatformId: $newFeaturedPlatformId) {
        name
    }
}
`

export const DELETE_FEATURED_PLATFORM = gql`
mutation ($userId: ID!, $deleteFeaturedPlatformId: ID!) {
    deleteFeaturedPlatform(userId: $userId, deleteFeaturedPlatformId: $deleteFeaturedPlatformId) {
        name
    }
}
`

export const FOLLOW_PLATFORM = gql`
    mutation ($platformId: ID!, $userId: ID!) {
        followPlatform(platformId: $platformId, userId: $userId){
            displayName
        }
    }
`;

export const UNFOLLOW_PLATFORM = gql`
    mutation ($platformId: ID!, $userId: ID!) {
        unfollowPlatform(platformId: $platformId, userId: $userId){
            displayName
        }
    }
`;

export const DELETE_USER = gql`
    mutation ($userId: ID!) {
        deleteUser(userId: $userId)
    }
`;

export const RATE_QUIZ = gql`
    mutation ($quizId: ID!, $userId: ID!, $rating: Int!) {
        rateQuiz(quizId: $quizId, userId: $userId, rating: $rating) {
            rating
        }
    }
`;

export const PURCHASE_ITEM = gql`
    mutation ($userId: ID!, $itemId: ID!) {
        purchaseItem(userId: $userId, itemId: $itemId) {
            _id
            name
        }
    }
`;

export const ADD_COMMENT = gql`
mutation ($quiz_id: ID!, $user_id: ID!, $comment: String!) {
    addComment(quiz_id: $quiz_id, user_id: $user_id, comment: $comment) {
        _id
    }
}
`;

export const DELETE_COMMENT = gql`
mutation ($quiz_id: ID!, $user_id: ID!, $comment_id: ID!) {
    deleteComment(quiz_id: $quiz_id, user_id: $user_id, comment_id: $comment_id) {
        _id
    }
}
`;

export const ADD_REPLY = gql`
mutation ($quiz_id: ID!, $user_id: ID!, $comment_id: ID!, $reply: String!) {
    addReply(quiz_id: $quiz_id, user_id: $user_id, comment_id: $comment_id, reply: $reply) {
        _id
    }
}
`;

export const DELETE_REPLY = gql`
mutation ($quiz_id: ID!, $user_id: ID!, $comment_id: ID!, $reply_id: ID!) {
    deleteReply(quiz_id: $quiz_id, user_id: $user_id, comment_id: $comment_id, reply_id: $reply_id) {
        _id
    }
}
`;

export const FINISH_SIGNUP = gql`
    mutation ($signUpInput: SignUpInput!) {
        finishSignUp(signUpInput: $signUpInput){
            _id
            displayName
            iconImage
            recommendationArray
        }
    }
`;

export const UPDATE_DARK_MODE = gql`
    mutation ($userId: ID!, $darkMode: Boolean!) {
        updateDarkMode(userId: $userId, darkMode: $darkMode){
            _id
            darkMode
        }
    }
`;




