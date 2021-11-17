import { gql } from '@apollo/client';

export const GET_QUIZZES = gql`
    {
        getQuizzes {
            _id
            title
            user {
                _id
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

export const SEARCH_QUIZZES = gql`
    query Query($searchText: String!) {
        searchQuizzes(searchText: $searchText) {
            _id
            title
            description
            numQuestions
            icon
            rating
            numFavorites
            quizInstant
            quizShuffled
            questionTimer
            quizTimer
            isTimerForQuiz
            platform {
                _id
                name
            }
            user {
                _id
                displayName
            }
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
            description
            user {
                _id
                displayName
            }
            quizzes {
                _id
                title
                icon
                numFavorites
                numAttempts
            }
        }
    }
`;

export const SEARCH_PLATFORMS = gql`
    query searchPlatform($searchText: String!) {
        searchPlatforms(searchText: $searchText) {
            _id
            name
            iconImage
            bannerImage
            followers {
                displayName
            }
            description
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
    query ($_id: ID!) {
        getUser(_id: $_id) {
            _id
            displayName
            iconImage
            bio
            email
            title
            bannerImage
            quizzesMade {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                user {
                    displayName
                }
            }
            platformsMade {
                _id
                iconImage
                bannerImage
                name
                user {
                    displayName
                }
                followers{
                    _id
                    displayName
                }
            }
            featuredQuizzes {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                user {
                    displayName
                }
            }
            featuredPlatforms {
                _id
                iconImage
                bannerImage
                name
                user {
                    displayName
                }
                followers {
                    displayName
                }
            }
            darkMode
        }
    }
`;

export const SEARCH_USERS = gql`
    query searchUsers($searchText: String!) {
        searchUsers(searchText: $searchText) {
            _id
            displayName
            iconImage
        }
    }
`;
