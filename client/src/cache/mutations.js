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
            score
        }
    }
`;