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

    const [SubmitQuiz] = useMutation(mutations.SUBMIT_QUIZ);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [userAnswers, setUserAnswers] = useState(() => []);

    const { data, loading, error } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: '617a191e44a08bd08c08d405' },
    });

    if (loading) {
        return <div></div>;
    }
    
    if (data) {
        quiz = data.getQuiz;
    }

    let quizID = quiz._id;
    let quizicon = "https://yt3.ggpht.com/ytc/AKedOLQ2xNBI8aO1I9etug8WnhQ-WPhnVEyNgj6cFVPfNw=s900-c-k-c0x00ffffff-no-rj"
    let question = quiz.questions[currentQuestionNumber-1].question;
    let choices = quiz.questions[currentQuestionNumber-1].answerChoices;
    let questionNumber = [];
    for (let i = 0; i < quiz.numQuestions; i++)
        questionNumber.push('Question' + i + 1);

    const submitQuiz = async () => {
        console.log(userAnswers);
        const { loading, error, data } = await SubmitQuiz({ variables: {
            quizAttemptInput: { quiz_id: quizID, answerChoices: userAnswers },
        } });

        if(error){
            console.log(error)
        }       
    }

    function updateUserAnswers(currentQuestionNumber, choice) {
        setUserAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentQuestionNumber-1] = choice;
            console.log(newAnswers);
            return newAnswers;
        });
    }

    return (
        <Box data-testid='main-component'>
            <Navbar />
            <Grid templateColumns='1fr 6fr'>
                {/* SIDEBAR */}
                <Box h='100vh' bgColor='gray.200'>
                    {/* QUIZ ICON */}
                    <Image src={quizicon} borderRadius="50%" p="20px"/>

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
                                <Button 
                                    bgColor= { index+1 === currentQuestionNumber ? 'blue.400' : 'gray.200' }
                                    borderRadius="0" 
                                    fontSize='0.9vw' 
                                    onClick={() => {setCurrentQuestionNumber(index+1)}}
                                    _hover={{ bgColor: index+1 === currentQuestionNumber ? 'blue.400' : 'gray.300'}}
                                >
                                    <Text color={ index+1 === currentQuestionNumber ? 'white' : 'gray.600' }>
                                        {index + 1}
                                    </Text>
                                </Button>
                            );
                        })}
                    </Grid>
                </Box>

                {/* MAIN PAGE */}
                <Box>
                    {/* QUESTION */}
                    <Center>
                        <Text pt='50' fontSize='3vw'>
                            {currentQuestionNumber}.  {question}
                        </Text>
                    </Center>

                    {/* ANSWER CHOICES */}
                    <VStack pt='30' spacing='6'>
                        {choices.map((choice, index) => {
                            return (
                                <Button
                                    w='60%'
                                    h='10vh'
                                    bgColor = { userAnswers[currentQuestionNumber - 1] == choice ? "blue.500" : "gray.500" }
                                    fontSize='1.5vw'
                                    textColor='white'
                                    onClick={() => { updateUserAnswers(currentQuestionNumber, choice) }}
                                    _hover={{ bg: "blue.500" }}
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
                            bgColor='red.500'
                            fontSize='1.3vw'
                            textColor='white'
                            onClick={submitQuiz}
                            _hover={{ bg: "red.600" }}
                        >
                            Submit Quiz
                        </Button>
                        </Center> 
                        :
                        <Center pt='20'>
                        <Button
                            w='20%'
                            h='7vh'
                            bgColor='purple.600'
                            fontSize='1.3vw'
                            textColor='white'
                            onClick={() => {setCurrentQuestionNumber(currentQuestionNumber+1)}}
                            _hover={{ bg: "purple.800" }}
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
