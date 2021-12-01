import React, { useState, useEffect, useContext} from 'react';
import { Box, Center, Text, Grid, VStack, Button, Image, Avatar, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import * as queries from '../cache/queries';
import * as mutations from '../cache/mutations';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import '../styles/styles.css'



export default function QuizTakingPage({}) {
    let { quizId } = useParams();
    const { user } = useContext(AuthContext);
    let quiz = null;
    let quizAttempt = null;
    let numQuestions = null; 
    let history = useHistory();

    const [SubmitQuiz] = useMutation(mutations.SUBMIT_QUIZ);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [userAnswers, setUserAnswers] = useState(() => []);
    const [totalTime, setTotalTime] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    const [quizAttemptID, setQuizAttemptID] = useState(0);
    const [quizTimer, setQuizTimer] = useState(-1);
    const [quizTimerDisplay, setQuizTimerDisplay] = useState("No Timer");
    const [quizTimerPulled, setQuizTimerPulled] = useState(false);
    const [timeRunningOut, setTimeRunningOut] = useState(false);
    
    //Dark mode styling
    const quizTimerBoxBG=useColorModeValue("gray.400", "gray.600")
    const quizTimerSideBG=useColorModeValue("gray.100", "gray.300")
    const authorTextColor=useColorModeValue("blue.600","blue.400")
    const quizTimerTextColor=useColorModeValue("gray.800","gray.800")
    const highlightChosenQText=useColorModeValue("gray.200","gray.600")
    const whiteBlackText=useColorModeValue("white","white")
    const nonChosenQText=useColorModeValue("black","white")
    const notChosenQBG=useColorModeValue("gray.100","gray.500")
    const hoverAnswerBG=useColorModeValue("blue.100","blue.900")
    const answerChosenBG=useColorModeValue("blue.100","blue.700")
    useEffect(() => {
        if(quizTimer != -1){
            const interval = setInterval(() => {
                    setQuizTimer(quizTimer => quizTimer - 1);
            }, 1000);
            if(quizTimer == 0)
                return () => clearInterval(interval);
        }
    }, [quizTimerPulled]);
    
    useEffect(() => {
        if(quizTimer == -1)
            return;

        const timeStringDisplay = convertSecondsToString(quizTimer);
        setQuizTimerDisplay(timeStringDisplay)
        
        if(quizTimer <= 30 && !timeRunningOut) {
            setTimeRunningOut(true)
        }

        if(quizTimer === 0) {
            submitQuiz()
        }

    }, [quizTimer]);

    const { data, loading, error, refetch } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: quizId },
        fetchPolicy: 'cache-and-network'
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
    let question = quiz.questions[currentQuestionNumber-1].question;
    let choices = quiz.questions[currentQuestionNumber-1].answerChoices;
    let questionNumber = [];
    let questionType = quiz.questions[currentQuestionNumber-1].questionType;
    numQuestions = quiz.numQuestions;


    for (let i = 0; i < quiz.numQuestions; i++)
        questionNumber.push('Question' + i + 1);


    const submitQuiz = async () => {
        console.log(totalTime)
        console.log(quizTimer)
        let elapsedTimeTemp = totalTime - quizTimer;
        console.log(elapsedTimeTemp)
        let elapsedTime = convertSecondsToString(elapsedTimeTemp)
        let newAnswers = [...userAnswers];
        for(let i = 0; i < quiz.numQuestions; i++){
            if(newAnswers[i] == undefined)
                newAnswers[i] = '';
        }

        let user_id = null; 
        if(user !== 'NoUser'){
            user_id = user._id
        }
        const {loading, error, data} = await SubmitQuiz({ variables: {
            quizAttemptInput: { quiz_id: quizID, answerChoices: newAnswers, elapsedTime, user_id: user_id},
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

            setUserAnswers(newAnswers);
        }
    }

    // Determines the color of the answer buttons
    function getAnswerColor(questionType, currentQuestionNumber, choice) {
        // If question type is select one answer
        if (questionType === 1){
            return userAnswers[currentQuestionNumber-1] === choice ? answerChosenBG : ""
        }

        // If question type is select multiple answers
        else if (questionType === 2){
            // Array hasn't been created yet, set color to gray
            if (userAnswers[currentQuestionNumber-1] === undefined)
                return ""

            return userAnswers[currentQuestionNumber-1].includes(choice) ? "blue.100" : ""
        }
    }

    function convertTimeToSeconds(quizTimerString){
        let numHours = parseInt(quizTimerString.slice(0,2))
        let numMinutes = parseInt(quizTimerString.slice(3,5))
        let numSeconds = parseInt(quizTimerString.slice(6,8))
        
        let totalSeconds = (numHours * 3600) + (numMinutes * 60) + (numSeconds);
        setTotalTime(totalSeconds);

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
                <Box h='100vh' bgColor={quizTimerBoxBG} boxShadow="md">

                    {/* QUIZ ICON */}
                    <Center pt="5%">
                        <Avatar size="2xl" src={quiz.icon} />
                    </Center>

                    {/* QUIZ TITLE */}
                    <Center>
                        <Text padding={2} fontSize='130%' fontWeight="medium" textAlign='center'>{quiz.title}</Text>
                    </Center>

                    {/* QUIZ AUTHOR */}
                    <Center>
                        <Text fontSize='120%' color={authorTextColor}> {quiz.user.displayName} </Text>
                    </Center>

                    {/* QUIZ TIMER */}
                    <Center pt="6%">
                        <Box w='70%' h='5vh' bgColor={quizTimerSideBG} border="1px solid" borderColor={quizTimerBoxBG} borderRadius="15">
                        <Text fontSize='170%' textAlign='center' color={ timeRunningOut ? "red.500" : quizTimerTextColor }>
                            {quizDone ? "Quiz Ended" : quizTimerDisplay}
                        </Text>
                        </Box>
                    </Center>

                    {/* QUESTION NUMBERS */}
                    <Grid w='100%' templateColumns='1fr 1fr' pt="4%">
                        {questionNumber.map((item, index) => {
                            return (
                                <Button 
                                    key = {index}
                                    bgColor= { index+1 === currentQuestionNumber ? 'blue.400' : notChosenQBG }
                                    borderRadius="0" 
                                    fontSize='0.9vw' 
                                    onClick={() => {setCurrentQuestionNumber(index+1)}}
                                    _hover={{ bgColor: index+1 === currentQuestionNumber ? 'blue.400' : highlightChosenQText}}
                                    _focus={{border:"none"}}
                                >
                                    <Text key = {index} color={ index+1 === currentQuestionNumber ? whiteBlackText : nonChosenQText }>
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
                    <VStack>
                        <Text pt='50' fontSize="270%" textAlign="center" pl={17} pr={17}>
                            {question}
                        </Text>

                   
                        <Text fontSize="150%" textAlign="center" color="blue.400" pl={17} pr={17}>
                            {questionType === 2 ? "(Select All That Apply)" : null}
                        </Text>
                    </VStack>

                    {/* ANSWER CHOICES */}
                    <VStack pt='30' spacing='6'>
                        {choices.map((choice, index) => {
                            return (
                                <Button
                                    variant="outline"
                                    colorScheme="blue"
                                    key={index}
                                    w='60%'
                                    h='10vh'
                                    bgColor = {getAnswerColor(quiz.questions[currentQuestionNumber-1].questionType, currentQuestionNumber, choice)}
                                    fontSize='1.5vw'
                                    _focus={{border:"1px"}}
                                    onClick={() => { updateUserAnswers(currentQuestionNumber, choice, quiz.questions[currentQuestionNumber-1].questionType) }}
                                    _hover={{ bg: hoverAnswerBG }}
                                    _active={{ opacity: "75%" }}
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
