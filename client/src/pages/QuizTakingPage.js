import React, { useState } from 'react';
import {
    Box,
    Center,
    Text,
    Grid,
    VStack,
    Button,
    Image,
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import * as queries from '../cache/queries';
import * as mutations from '../cache/mutations';
import Navbar from '../components/Navbar';

export default function QuizTakingPage({}) {
    let quiz = null;

    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);

    const [userAnswers, setUserAnswers] = useState(() => []);

    function updateUserAnswers(currentQuestionNumber, choice) {
        setUserAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentQuestionNumber-1] = choice;
            console.log(newAnswers);
            return newAnswers;
        });
    }

    const submitQuiz = async () => {
       console.log(userAnswers);
    }

    const { data, loading, error } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: '617a191e44a08bd08c08d405' },
    });

    if (loading) {
        return <div></div>;
    }
    
    if (data) {
        quiz = data.getQuiz;
    }

    let question = quiz.questions[currentQuestionNumber-1].question;
    let choices = quiz.questions[currentQuestionNumber-1].answerChoices;
    let questionNumber = [];
    for (let i = 0; i < quiz.numQuestions; i++)
        questionNumber.push('Question' + i + 1);

    return (
        <Box data-testid='main-component'>
            <Navbar />
            <Grid templateColumns='1fr 6fr'>
                {/* SIDEBAR */}
                <Box h='100vh' bgColor='gray.200'>
                    {/* QUIZ ICON */}
                    <Image src='https://yt3.ggpht.com/ytc/AKedOLQ2xNBI8aO1I9etug8WnhQ-WPhnVEyNgj6cFVPfNw=s900-c-k-c0x00ffffff-no-rj' borderRadius="50%" p="20px"/>

                    {/* QUIZ TITLE */}
                    <Center>
                        <Text fontSize='2vw'>{quiz.title}</Text>
                    </Center>

                    {/* QUIZ AUTHOR */}
                    <Center>
                        <Text fontSize='1vw'>MarioGamer100</Text>
                    </Center>

                    <Center>
                        <Box w='95%' h='0.2vh' bgColor='gray.400' />
                    </Center>

                    {/* QUESTION NUMBERS */}
                    <Grid w='100%' templateColumns='1fr 1fr'>
                        {questionNumber.map((item, index) => {
                            return (
                                <Button bgColor='gray.200' fontSize='0.9vw' onClick={() => {setCurrentQuestionNumber(index+1)}}>
                                    {index + 1}
                                </Button>
                            );
                        })}
                    </Grid>
                </Box>

                {/* MAIN PAGE */}
                <Box>
                    {/* QUESTION */}
                    <Text pt='50' fontSize='3vw'>
                        <Center>{currentQuestionNumber}.  {question}</Center>
                    </Text>

                    {/* ANSWER CHOICES */}
                    <VStack pt='30' spacing='6'>
                        {choices.map((choice, index) => {
                            return (
                                <Button
                                    w='60%'
                                    h='10vh'
                                    bgColor={() => {
                                        if (
                                            userAnswers[currentQuestionNumber-1] == choice
                                        ) {
                                            return 'black';
                                        } else {
                                            return 'gray.500';
                                        }
                                    }}
                                    fontSize='1.5vw'
                                    textColor='white'
                                    onClick={() => {
                                            updateUserAnswers(currentQuestionNumber, choice);
                                    }}
                                    _hover={{ bg: "black" }}
                                >
                                    {choices[index]}
                                </Button>
                            );
                        })}
                    </VStack>

                    {/* NEXT QUESTION BUTTON */}
                    {
                        currentQuestionNumber == quiz.numQuestions ? 
                        <Center pt='20'>
                        <Button
                            w='20%'
                            h='7vh'
                            bgColor='red'
                            fontSize='1.3vw'
                            textColor='white'
                            onClick={submitQuiz}
                        >
                            Submit Quiz
                        </Button>
                        </Center> 
                        :
                        <Center pt='20'>
                        <Button
                            w='20%'
                            h='7vh'
                            bgColor='purple.800'
                            fontSize='1.3vw'
                            textColor='white'
                            onClick={() => {setCurrentQuestionNumber(currentQuestionNumber+1)}}
                        >
                            Next Question
                        </Button>
                        </Center> 
                    }


                </Box>
            </Grid>
        </Box>
    );
}
