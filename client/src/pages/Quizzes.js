import { React, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Center, Spinner, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Quizzes(props) {
    const {
        loading,
        error,
        data: { getQuizzes: quizzes } = {},
    } = useQuery(FETCH_QUIZZES_QUERY, { fetchPolicy: 'cache-and-network' });

    const [deleteQuiz] = useMutation(DELETE_QUIZ, {
        refetchQueries: [FETCH_QUIZZES_QUERY],
    });

    function handleDeleteQuiz(quizId) {
        deleteQuiz({
            variables: {
                quizId,
            },
        });
    }

    if (loading) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    if (error) {
        return `Error! ${error}`;
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ textAlign: 'left', width: '33.33333%' }}>
                    <Link
                        style={{ fontSize: '30px', marginLeft: '10px' }}
                        to='/'
                    >
                        Home
                    </Link>
                </div>
                <div
                    style={{
                        marginBottom: '40px',
                        width: '33.33333%',
                        fontSize: '80px',
                        textAlign: 'center',
                        textDecoration: 'underline',
                    }}
                >
                    Quizzes
                </div>
                <div style={{ textAlign: 'right', width: '33.33333%' }}>
                    <Link
                        style={{ fontSize: '30px', marginRight: '10px' }}
                        to='/createQuiz'
                    >
                        Create Quiz
                    </Link>
                </div>
            </div>
            {quizzes.map((quiz) => (
                <Center color='black' textDecoration='none' key={quiz._id}>
                    <Link
                        style={{ fontSize: '50px', marginRight: '10px' }}
                        to={`/quiz/${quiz._id}`}
                    >
                        {quiz.title}
                    </Link>
                    <Button
                        colorScheme='red'
                        onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                        Delete
                    </Button>
                </Center>
            ))}
        </div>
    );
}

const FETCH_QUIZZES_QUERY = gql`
    {
        getQuizzes {
            _id
            title
        }
    }
`;

const DELETE_QUIZ = gql`
    mutation ($quizId: ID!) {
        deleteQuiz(quizId: $quizId)
    }
`;

export default Quizzes;
