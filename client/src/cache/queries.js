import { gql } from '@apollo/client';

export const GET_QUIZZES = gql`
    {
        getQuizzes {
            _id
            title
            user {
                displayName
            }
        }
    }
`;

export const GET_QUIZ = gql`
	query GetQuiz($quizId: ID!) {
		getQuiz(quizId: $quizId) {
			_id
            title
            user {
                displayName
            }
            questions {
                question
                answerChoices
                answer
                questionType
            }
            description
            quizTimer
            numQuestions
            numAttempts
            numFavorites
		}
	}
`;

export const GET_QUIZ_ATTEMPT = gql`
	query GetQuizAttempt($_id: ID!) {
		getQuizAttempt(_id: $_id) {
            _id
            quiz {
                _id
                title
                questions {
                    question
                    answerChoices
                    answer
                    questionType
                }
                description
                quizTimer
                numQuestions
                numAttempts
                numFavorites
            }
            score
            numCorrect
		}
	}
`;