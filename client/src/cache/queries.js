import { gql } from '@apollo/client';

export const GET_QUIZZES = gql`
    {
        getQuizzes {
            _id
            title
            user {
                displayName
            }
            icon
            description
            quizTimer
            numAttempts
            numFavorites
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
            icon
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
            user {
                displayName
            }
            quiz {
                _id
                user {
                    displayName
                }
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
            answerChoices
            questions
            elapsedTime
            attemptNumber
            coinsEarned
		}
	}
`;

export const GET_LEADERBOARD = gql`
	query GetLeaderboard($quiz_id: ID!) {
		getLeaderboard(quiz_id: $quiz_id) {
            _id
            user {
                displayName
            }
            score
		}
	}
`;

export const GET_PLATFORMS = gql`
    {
        getPlatforms {
            _id
            name
            iconImage
            bannerImage
            background
            tags
            followers {
                displayName
            }
          }
    }
`;

export const GET_PLATFORM = gql`
	query getPlatform($platformId: ID!) {
		getPlatform(platformId: $platformId) {
            _id
            name
            iconImage
            bannerImage
            background
            followers {
              displayName
            }
            tags
        }
	}
`;

export const GET_USERS = gql`
    {
        getUsers {
            _id
            displayName
            iconImage
            currency
        }
    }
`;

export const GET_USER = gql`
	query GetUser($_id: ID!) {
		getUser(_id: $_id) {
			_id
            displayName
            iconImage
            bio
		}
	}
`;
