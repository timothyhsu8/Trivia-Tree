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
    mutation ($quizId: ID!, $rating: Int!) {
        rateQuiz(quizId: $quizId, rating: $rating){
            rating
        }
    }
`;


