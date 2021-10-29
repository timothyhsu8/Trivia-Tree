import { gql } from '@apollo/client';

export const FETCH_QUIZ_QUERY = gql`
    query Query {
        getQuizzes {
            id
            title
            questions {
                question
                answerChoices
                answer
            }
        }
    }
`;

export const GET_QUIZ = gql`
	query GetQuiz($quizId: ID!) {
		getQuiz(quizId: $quizId) {
			_id
            title
            questions {
                question
                answerChoices
                answer
                questionType
            }
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
            score
		}
	}
`;