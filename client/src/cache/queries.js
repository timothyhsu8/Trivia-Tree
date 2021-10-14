import { gql } from '@apollo/client';

export const FETCH_QUIZ_QUERY = gql`
    query Query {
        getQuizzes {
            id
            title
            questions {
                id
                question
                answerChoices
                answer
            }
        }
    }
`;
