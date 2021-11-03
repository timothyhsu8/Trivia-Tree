import React, { useState, useEffect } from 'react';
import {
    Box,
    Center,
    Text,
    Grid,
    VStack,
    Button,
    Image
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import * as queries from '../cache/queries';
import * as mutations from '../cache/mutations';
import { Link, useParams, useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';


export default function QuizTakingPage({}) {
    let { quizId } = useParams();
    let quiz = null;
    let quizAttempt = null;
    let numQuestions = null; 

    let history = useHistory();

    const [SubmitQuiz] = useMutation(mutations.SUBMIT_QUIZ);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [userAnswers, setUserAnswers] = useState(() => []);
    const [quizDone, setQuizDone] = useState(false);
    const [quizAttemptID, setQuizAttemptID] = useState(0);
    const [quizTimer, setQuizTimer] = useState(-1);
    const [quizTimerDisplay, setQuizTimerDisplay] = useState("No Timer");
    const [quizTimerPulled, setQuizTimerPulled] = useState(false);
    
    useEffect(() => {
        if(quizTimer != -1){
            const interval = setInterval(() => {
                    setQuizTimer(quizTimer => quizTimer - 1);
            }, 1000);
            if(quizTimer == 0)
                return () => clearInterval(interval);
        }
    }, []);
    
    useEffect(() => {
        if(quizTimer == -1)
            return;
        const timeStringDisplay = convertSecondsToString(quizTimer);
        console.log(timeStringDisplay)
        setQuizTimerDisplay(timeStringDisplay)

        if(quizTimer == 0){
            submitQuiz()
        }

    }, [quizTimer]);

    const { data, loading, error, refetch } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: quizId },
    });

    

    if (loading) {
        return <div></div>;
    }
    
    if (data) {
        quiz = data.getQuiz;
        if(quiz.quizTimer != null){
            if(!quizTimerPulled){
                setQuizTimerDisplay(quiz.quizTimer);
                let totalSeconds = convertTimeToSeconds(quiz.quizTimer);
                setQuizTimer(totalSeconds)
                setQuizTimerPulled(true); 
            }
        }
    }

    let quizID = quiz._id;
    let quizicon = quizImage
    let question = quiz.questions[currentQuestionNumber-1].question;
    let choices = quiz.questions[currentQuestionNumber-1].answerChoices;
    let questionNumber = [];
    let questionType = quiz.questions[currentQuestionNumber-1].questionType;
    numQuestions = quiz.numQuestions;


    for (let i = 0; i < quiz.numQuestions; i++)
        questionNumber.push('Question' + i + 1);


    const submitQuiz = async () => {
        let newAnswers = [...userAnswers];
        for(let i = 0; i < quiz.numQuestions; i++){
            if(newAnswers[i] == undefined)
                newAnswers[i] = '';
        }
        const {loading, error, data} = await SubmitQuiz({ variables: {
            quizAttemptInput: { quiz_id: quizID, answerChoices: newAnswers },
        } });


        if(data){
            quizAttempt = data.submitQuiz;
            setQuizAttemptID(quizAttempt._id);
            setQuizDone(true);
            history.push({
                pathname: '/postquizpage/' + quizID + '/' + quizAttempt._id
            });
        }

        if(error){
            console.log(error)
        }

        
    }

    function updateUserAnswers(question_num, choice, questionType) {
        question_num = question_num - 1
        const newAnswers = [...userAnswers];

        // If question type is select one answer
        if (questionType === 1){
            newAnswers[question_num] = choice;
            setUserAnswers(newAnswers)
        }

        // If question type is select multiple answers
        else if (questionType === 2){
            // Create array to carry multiple answers
            if (newAnswers[question_num] === undefined)
                newAnswers[question_num] = [];
            
            // If answer was selected, remove it from the array
            let index = newAnswers[question_num].indexOf(choice);
            if (index !== -1)
                newAnswers[question_num].splice(index, 1);

            else newAnswers[question_num].push(choice);

            // console.log(newAnswers);
            setUserAnswers(newAnswers);
        }
    }

    // Determines the color of the answer buttons
    function getAnswerColor(questionType, currentQuestionNumber, choice) {
        // If question type is select one answer
        if (questionType === 1){
            return userAnswers[currentQuestionNumber-1] === choice ? "blue.500" : "gray.500"
        }

        // If question type is select multiple answers
        else if (questionType === 2){
            // Array hasn't been created yet, set color to gray
            if (userAnswers[currentQuestionNumber-1] === undefined)
                return "gray.500"

            return userAnswers[currentQuestionNumber-1].includes(choice) ? "blue.500" : "gray.500"
        }
    }

    function convertTimeToSeconds(quizTimerString){
        let numHours = parseInt(quizTimerString.slice(0,2))
        let numMinutes = parseInt(quizTimerString.slice(3,5))
        let numSeconds = parseInt(quizTimerString.slice(6,8))
        
        let totalSeconds = (numHours * 3600) + (numMinutes * 60) + (numSeconds);

        return totalSeconds;
    }

    function convertSecondsToString(secs){
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        hours = hours.toString();
        minutes = minutes.toString();
        seconds = seconds.toString();

        if(hours.length == 1){
            hours = '0' + hours; 
        }

        if(minutes.length == 1){
            minutes = '0' + minutes; 
        }
        if(seconds.length == 1){
            seconds = '0' + seconds; 
        }

        return hours + ":" + minutes + ":" + seconds;
    }

    return (
        <Box data-testid='main-component'>
            <Grid templateColumns='1fr 6fr'>
                {/* SIDEBAR */}
                <Box h='100vh' bgColor='gray.200'>
                    {/* QUIZ ICON */}
                    <Image src={quizicon} borderRadius="50%" p="20px"/>

                    {/* QUIZ TITLE */}
                    <Center>
                        <Text fontSize='2vw' textAlign='center'>{quiz.title}</Text>
                    </Center>

                    {/* QUIZ AUTHOR */}
                    <Center>
                        <Text fontSize='1vw'>No User Found</Text>
                    </Center>

                    <Center>
                        <Box w='95%' h='1vh' />
                    </Center>

                    <Center>
                        <Box w='70%' h='5vh' bgColor='gray.400' border="1px">
                        <Text fontSize='1.5vw' textAlign='center'>{quizDone ? "Quiz Ended":quizTimerDisplay}</Text>
                        </Box>
                    </Center>

                    <Center>
                        <Box w='95%' h='1vh' />
                    </Center>

                    {/* QUESTION NUMBERS */}
                    <Grid w='100%' templateColumns='1fr 1fr'>
                        {questionNumber.map((item, index) => {
                            return (
                                <Button 
                                    key = {index}
                                    bgColor= { index+1 === currentQuestionNumber ? 'blue.400' : 'gray.200' }
                                    borderRadius="0" 
                                    fontSize='0.9vw' 
                                    onClick={() => {setCurrentQuestionNumber(index+1)}}
                                    _hover={{ bgColor: index+1 === currentQuestionNumber ? 'blue.400' : 'gray.300'}}
                                >
                                    <Text key = {index} color={ index+1 === currentQuestionNumber ? 'white' : 'gray.600' }>
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
                        {questionType == 2 ?  question + " Select All That Apply": question}
                        </Text>
                    </Center>

                    {/* ANSWER CHOICES */}
                    <VStack pt='30' spacing='6'>
                        {choices.map((choice, index) => {
                            return (
                                <Button
                                    key={index}
                                    w='60%'
                                    h='10vh'
                                    bgColor = {getAnswerColor(quiz.questions[currentQuestionNumber-1].questionType, currentQuestionNumber, choice)}
                                    fontSize='1.5vw'
                                    textColor='white'
                                    onClick={() => { updateUserAnswers(currentQuestionNumber, choice, quiz.questions[currentQuestionNumber-1].questionType) }}
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

                    {/* {
                        !quizDone ? '':
                        <Link to={'/postquizpage/' + quizID + '/' + quizAttemptID}>
                            <Center>
                                <Button
                                top='20px'
                                w='20%'
                                h='7vh'
                                bgColor='blue'
                                fontSize='1.3vw'
                                textColor='white'
                                _hover={{ bg: "purple.800" }}
                                >
                                View Results
                                </Button>
                            </Center>
                        </Link>

                    } */}


                </Box>
            </Grid>
        </Box>
    );
}
