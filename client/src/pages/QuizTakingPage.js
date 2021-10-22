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

export default function QuizTakingPage({}) {
    let quiz = null;
    const { data, loading, error } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: '615ca7d3e65ac5f801f4e85e' },
    });
    const [createQuiz, { data2, loading2, error2 }] = useMutation(
        mutations.CREATE_QUIZ
    ); // *JUST FOR TESTING, REMOVE THIS AFTER BUILD 1 REVIEW

    if (loading) {
        return <div></div>;
    }
    if (data) {
        quiz = data.getQuiz;
    }
    if (error) {
        console.log(error);
    }

    let question = quiz.questions[0].question;
    let choices = quiz.questions[0].answerChoices;
    let questions = [];
    for (let i = 0; i < quiz.numQuestions; i++)
        questions.push('Question' + i + 1);

    return (
        <Box data-testid='main-component'>
            <Grid templateColumns='1fr 6fr'>
                {/* SIDEBAR */}
                <Box h='100vh' bgColor='gray.200'>
                    {/* QUIZ ICON */}
                    <Image src='https://yt3.ggpht.com/ytc/AKedOLQ2xNBI8aO1I9etug8WnhQ-WPhnVEyNgj6cFVPfNw=s900-c-k-c0x00ffffff-no-rj' />

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
                        {questions.map((item, index) => {
                            return (
                                <Button bgColor='gray.200' fontSize='0.9vw'>
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
                        <Center>{question}</Center>
                    </Text>

                    {/* ANSWER CHOICES */}
                    <VStack pt='30' spacing='6'>
                        {choices.map((item, index) => {
                            return (
                                <Button
                                    w='60%'
                                    h='10vh'
                                    bgColor='gray.600'
                                    fontSize='1.5vw'
                                    textColor='white'
                                >
                                    {choices[index]}
                                </Button>
                            );
                        })}
                    </VStack>

                    {/* NEXT QUESTION BUTTON */}
                    <Center pt='20'>
                        <Button
                            w='20%'
                            h='7vh'
                            bgColor='purple.800'
                            fontSize='1.3vw'
                            textColor='white'
                        >
                            Next Question
                        </Button>
                    </Center>

                    <Center pt='20'>
                        <Button
                            w='20%'
                            h='7vh'
                            onClick={() => {
                                createQuiz();
                            }}
                            bgColor='purple.800'
                            fontSize='1.3vw'
                            textColor='white'
                        >
                            Create Quiz (For Testing)
                        </Button>
                    </Center>
                </Box>
            </Grid>
        </Box>
    );
}
