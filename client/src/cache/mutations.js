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

export const UPDATE_PLATFORM = gql`
    mutation ($platformInput: PlatformInput!) {
        updatePlatform(platformInput: $platformInput) {
            name
            _id
        }
    }
`;

<<<<<<< HEAD
export const ADD_QUIZ_TO_PLATFORM = gql`
mutation ($platformId: ID!, $quizId: ID!) {
    addQuizToPlatform(platformId: $platformId, quizId: $quizId) {
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
=======
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
>>>>>>> build4
