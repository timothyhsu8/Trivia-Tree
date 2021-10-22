import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
    Center,
    Box,
    Container,
    Button as BetterButton,
    ChakraProvider,
    Spinner,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Quiz(props) {
    const quizId = props.match.params.quizId;

    const {
        loading,
        error,
        data: { getQuiz: quiz } = {},
    } = useQuery(FETCH_QUIZ_QUERY, {
        variables: {
            quizId,
        },
    });

    const [userAnswers, setUserAnswers] = useState(() => []);

    const [quizDone, setQuizDone] = useState(() => false);

    function updateUserAnswers(index, choice) {
        setUserAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[index] = choice;
            return newAnswers;
        });
    }

    if (loading) {
        return (
            <ChakraProvider>
                <Center>
                    <Spinner marginTop='50px' size='xl' />
                </Center>
            </ChakraProvider>
        );
    }

    if (error) {
        return `Error! ${error}`;
    }

    return (
        <Box>
            <div style={{ display: 'flex' }}>
                <div style={{ textAlign: 'left', width: '33.33333%' }}>
                    <Link
                        style={{ fontSize: '30px', marginLeft: '10px' }}
                        to='/quizzes'
                    >
                        Quizzes
                    </Link>
                </div>
                <div
                    style={{
                        textAlign: 'center',
                        width: '33.33333%',
                        fontSize: '50px',
                        textDecoration: 'underline',
                    }}
                >
                    {quiz.title}
                </div>
            </div>
            {quiz.questions.map((question, index) => (
                <Box key={question._id}>
                    <Center
                        textAlign='center'
                        fontSize='30px'
                        marginTop='20px'
                        marginBottom='20px'
                    >
                        {question.question}
                    </Center>
                    <Container centerContent>
                        {question.answerChoices.map((choice) => (
                            <Center
                                key={question._id + choice}
                                borderRadius='8px'
                                padding='5px'
                                margin='5px'
                                fontSize='30px'
                                minWidth='100%'
                                border={() => {
                                    if (
                                        quizDone &&
                                        userAnswers[index] !== choice &&
                                        choice === question.answer[0]
                                    ) {
                                        return '5px';
                                    } else {
                                        return '1px';
                                    }
                                }}
                                borderStyle='solid'
                                borderColor={() => {
                                    if (
                                        quizDone &&
                                        userAnswers[index] !== choice &&
                                        choice === question.answer[0]
                                    ) {
                                        return '#00bd00';
                                    } else {
                                        return 'black';
                                    }
                                }}
                                onClick={() => {
                                    if (!quizDone) {
                                        updateUserAnswers(index, choice);
                                    }
                                }}
                                background={() => {
                                    if (userAnswers[index] === choice) {
                                        if (
                                            quizDone &&
                                            userAnswers[index] !==
                                                question.answer[0]
                                        ) {
                                            return '#ff4646';
                                        } else {
                                            return 'lightgreen';
                                        }
                                    } else {
                                        return 'transparent';
                                    }
                                }}
                                _hover={() => {
                                    if (!quizDone) {
                                        if (userAnswers[index] === choice) {
                                            return {
                                                background: 'lightgreen',
                                                cursor: 'pointer',
                                            };
                                        } else {
                                            return {
                                                background: 'lightgray',
                                                cursor: 'pointer',
                                            };
                                        }
                                    }
                                }}
                            >
                                {choice}
                            </Center>
                        ))}
                    </Container>
                </Box>
            ))}
            <Center>
                <BetterButton
                    isDisabled={quizDone}
                    onClick={() => setQuizDone(true)}
                    marginTop='50px'
                    colorScheme='green'
                    size='lg'
                    marginBottom='50px'
                >
                    {quizDone ? 'Submitted' : 'Submit Answers'}
                </BetterButton>
            </Center>
        </Box>
    );
}

const FETCH_QUIZ_QUERY = gql`
    query ($quizId: ID!) {
        getQuiz(quizId: $quizId) {
            _id
            title
            questions {
                _id
                question
                answer
                answerChoices
            }
        }
    }
`;

export default Quiz;
