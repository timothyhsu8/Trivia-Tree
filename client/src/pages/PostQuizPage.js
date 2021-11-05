import React from 'react';
import { useState } from 'react';
import { Box, Flex, Center, Text, Grid, VStack, Button, Image, GridItem, Icon } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import userImage from '../images/default.png';
import '../styles/postpage.css';
import moon from '../images/moon.jpg';
import quizicon from '../images/quizicon.png';
import coin from '../images/coin.png';
import quizImage from '../images/defaultquiz.jpeg';
import LeaderboardCard from './LeaderboardEntryCard';
import {IoMdClock} from "react-icons/io"
import {BsStarFill} from "react-icons/bs"
import { useQuery } from '@apollo/client';
import * as queries from '../cache/queries';
import { useParams } from 'react-router-dom';
import PostQuizAnswersCard from './PostQuizAnswersCard';

export default function PostQuizPage() {
    let quizScore = null; 
    let elapsedTime = null;
    let attemptNumber = null; 
    let numCorrect = null; 
    let creator = null; 
    let leaderboard = null;
    let questions = null;
    let answerChoices = null; 
    let coinsEarned = null;
    let icon_src = null; 

    let { quizId, quizAttemptId } = useParams();
    let leaderboard_entries = [ 'alpha', 'vita', 'gamma', 'thelta', 'epsilon', 'zita', 'ita', 'thita', 'iota', 'kappa']

    function mainPage() {
        return;
    }
    function retry() {
        return;
    }

    //Later on these will pull from Leaderboard for given quiz in Database
    const [bleh, changeBleh] = useState([
        'alpha',
        'vita',
        'gamma',
        'thelta',
        'epsilon',
        'zita',
        'ita',
        'thita',
    ]);
    
    const [showResults, setShowResults] = React.useState(true);
    const onClickResults = () => {
        setShowResults(true);
        setShowAnswers(false);
    };
    const [showAnswers, setShowAnswers] = React.useState(false);
    const onClickAnswers = () => {
        setShowAnswers(true);
        setShowResults(false);
    };

    const [subbed, setSubbed] = React.useState(false);
    const onClickSubscribe = () => {
        setSubbed(!subbed);
    };

    let quizAttempt = null; 
    let quiz = null; 

    const {data, error, loading} = useQuery(queries.GET_QUIZ_ATTEMPT, {
        variables: { _id: quizAttemptId },
    });

    const {data:data1, error:error1, loading:loading1} = useQuery(queries.GET_LEADERBOARD, {
        variables: { quiz_id: quizId },
    });

    const {data:data2, error:error2, loading:loading2} = useQuery(queries.GET_QUIZ, {
        variables: { quizId: quizId },
    });

    if (loading) {
        return <div></div>;
    }

    if (loading1) {
        return <div></div>;
    }

    if (loading2) {
        return <div></div>;
    }

    if (error) {
        console.log(error)
    }

    if(data){
        quizAttempt = data.getQuizAttempt
        quiz = quizAttempt.quiz
        quizScore = quizAttempt.score;
        elapsedTime = quizAttempt.elapsedTime;
        elapsedTime = convertTimeStringForDisplay(elapsedTime)
        attemptNumber = quizAttempt.attemptNumber; 
        numCorrect = quizAttempt.numCorrect;
        creator = quiz.user.displayName;
        answerChoices = quizAttempt.answerChoices;
        coinsEarned = quizAttempt.coinsEarned;
        console.log(quizAttempt)
        console.log(answerChoices)
    }

    if (data1) {
        leaderboard = data1.getLeaderboard
    }

    if (data2) {
        questions = data2.getQuiz.questions
        icon_src = data2.getQuiz.icon == null ? quizImage : data2.getQuiz.icon
        console.log(questions)

    }

    let quizTitle = quiz.title;
    let user = "None";
    let pfp_src = quizImage;
    let heartE = "data:image/png;base64,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";
    let heartF = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
    //let author = quiz.user.displayName;

    return(
        /*Go to line 145 for answers page*/
        <Box>    
            {/* HEADER/BANNER */}
            <Box mt="50px">
                {/* BANNER */}
                <Box
                    bgSize="cover" 
                    bgPosition="center"
                    borderRadius="10"
                >
                    {/* PROFILE PICTURE AND NAME className="fadeshow1" for image?*/}
                    <div className="SecretSauce"> 
                        <Image width={["100px","100px","100px","200px"]} height={["100px","100px","100px","200px"]} src={icon_src} objectFit="cover" borderRadius="10%" border="solid"></Image> 
                        <Box className="containerDown" paddingLeft="30px">  
                            <Box width={["200px","200px","200px","800px"]}>
                            <Flex direction="row" position="relative">  
                                <Text as="b" className="title" lineHeight={["40px","40px","40px","80px"]} fontSize="2.5vw">{quizTitle}</Text> 
                                { subbed ? 
                                <Image width={["32px","32px","32px","70px"]} h={["32px","32px","32px","70px"]} marginLeft="20px" transform="translateY(-35%)" mt="30px" src={heartF} borderRadius="0" onClick={onClickSubscribe}></Image>
                                : 
                                <Image w="70px" h="70px" mt="30px" src={heartE} borderRadius="0" marginLeft="20px" transform="translateY(-35%)" onClick={onClickSubscribe}></Image>
                                }
                            </Flex>    
                            </Box>
                            <Flex direction="row" position="relative">
                                <Image w="100px" h="100px" src={userImage} objectFit="cover" borderRadius="50%" border="solid"></Image>
                                <Flex direction="column" position="relative"> 
                                    <Text fontSize="26" as="b" left="10px" top="15px" position="relative" >Creator</Text>
                                    <Text fontSize="24" left="10px" top="15px" position="relative">{creator}</Text>
                                </Flex>
                            </Flex>
                        </Box>
                                            
                        {/*used a little absolute positioning */}
                        <div className="containerDown">
                            <Box w={["100vw","100px","200px","200px"]} h="50px" bg='#165CAF' borderRadius='5px' position="relative" left="500px" top="25px">
                                <Link to={'/prequizpage/' + quiz._id} className="center button white" onClick={retry}><Text  mt={["10px","10px","0px","0px"]} fontSize={["0vw","15px","23px","23px"]}  >Retry Quiz</Text></Link>  
                            </Box>
                        </div>
                    </div>
            </Box>
            </Box>
           


            {/*Part II: Main Body*/}
                <div className="SecretSauce">
                <Box className='containerDown' >
                    {' '}
                    {/* Can move everything down a little*/}
                    <Box className='containerAcross'>
                        <Box className='containerDown'>
                            <Box borderBottom='1px'>
                                {' '}
                                {/* for horizontal line*/}
                                <br></br>
                                <br></br>
                            </Box>

                            {showResults ? 
                                <Box className='results'>
                                    <Box className='containerAcross' paddingTop="35px">
                                        {/*Statbox Part I and II*/}    
                                        <Box
                                            width={["48vw","48vw","48vw","37vw"]}
                                            h='370px'
                                            bg='#373535'
                                            borderLeftRadius='20px'
                                            padding="20px"
                                            paddingTop="50px"
                                        >
                                            <Flex direction = "column">
                                                <Text fontSize="40px" left="120px" position="relative" color="white">You scored: {numCorrect}/{quiz.numQuestions} = {quizScore}%</Text>
                                                <Text fontSize="20px" left="190px" position="relative" color="white">The average score is 50%</Text>
                                                <Text fontSize="20px" left="140px" position="relative" color="white">You did better than 30% of Quiztakers</Text>
                                                <Text fontSize="35px" left="230px" top="20px" position="relative" color="white">Rate Quiz</Text>
                                                <Flex direction = "row">
                                                    <Icon as={BsStarFill} h="50px" w="50px" position="relative" left="135px" top="35px" marginRight="20px" color="white"></Icon>
                                                    <Icon as={BsStarFill} h="50px" w="50px" position="relative" left="135px" top="35px" marginRight="20px" color="white"></Icon>
                                                    <Icon as={BsStarFill} h="50px" w="50px" position="relative" left="135px" top="35px" marginRight="20px" color="white"></Icon>
                                                    <Icon as={BsStarFill} h="50px" w="50px" position="relative" left="135px" top="35px" marginRight="20px" color="white"></Icon>
                                                    <Icon as={BsStarFill} h="50px" w="50px" position="relative" left="135px" top="35px" marginRight="20px" color="white"></Icon>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                        <Box
                                            width={["38vw","38vw","38vw","28vw"]}
                                            h='370px'
                                            bg='#D3D3D3'
                                            borderRightRadius='20px'
                                        >
                                            <Flex direction="row">
                                                <Icon as={IoMdClock} h="100px" w="100px" position="relative" left="50px" top="25px" ></Icon>
                                                <Text fontSize="28px" position="relative" left="70px" top="55px">{elapsedTime}</Text>
                                            </Flex>

                                            <Flex direction="row">
                                                <Image src={quizicon} h="100px" w="100px" position="relative" left="50px" top="25px"></Image>
                                                <Text fontSize="28px" position="relative" left="70px" top="60px">Attempt Number {attemptNumber}</Text>
                                            </Flex>

                                            <Flex direction="row">
                                                <Image src={coin} h="100px" w="100px" position="relative" left="50px" top="35px"></Image>
                                                <Text fontSize="28px" position="relative" left="70px" top="65px">{coinsEarned == 0 ? 'No Coins Given' : coinsEarned}</Text>
                                            </Flex>

                                        </Box>
                                    </Box>
                                    <Box h={["50px"]}></Box>
                                </Box>
                             : 
                                <Box paddingTop="150px">
                                    <Box className='answerbox' position='relative' bottom="100px">
                                        {questions.map((question, index) => {
                                        return (
                                            <PostQuizAnswersCard
                                                place={index+1}
                                                question={question}
                                                answer={answerChoices[index]}
                                            />    
                                        )
                                        })}
                                    </Box>
                                </Box>
                            }
                        </Box>
                        
                        <div className="fadeshow1">
                        <Box pos="absolute" className='containerDown' paddingLeft="70px" transform="translateY(-15%)">
                            {/* Statbox */}
                            <Box w='28vw' h='50px' bg='gray.800' color="white" lineHeight="2" borderTopRadius="20%">
                                {' '}
                                {/* leaderboards Heading*/}
                                <h1 className='leaderboard_title'>
                                    Leaderboard
                                </h1>
                            </Box>{/*w=2vw, w=16vw, h=3.5vw */}
                            {/*w=2vw, w=16vw, h=31.5vw */}
                            <Box w='28vw' bg='#D3D3D3' borderBottomRadius="2%" h='600px' paddingTop="20px">
                                {leaderboard.map((entry, index) => {
                                    return (
                                        <LeaderboardCard 
                                            place={index+1}
                                            entry={entry}
                                            image={userImage}
                                        />    
                                    )
                                })}
                            </Box>
                        </Box>
                        </div>
                    </Box>
                    
                    {/*h=4.2vw */}
                    
                
                    <div className='containerAcrossMe'>
                        {/*w=10vw, w=8vw, h=2.8vw, borderLR=0.2, borderTB=0.35 */}
                        <Box width={["10vw","0vw","10vw","18vw"]}></Box>
                        <Box
                            w='200px'
                            h='40px'
                            bg={showResults ? 'grey': '#D3D3D3'}
                            borderRadius='5px'
                        >
                            {/* for horizontal line*/}
                            <a
                                href='#results'
                                className='center button white'
                                onClick={onClickResults}
                            >
                                View Results
                            </a>
                        </Box>
                        {/*w=0.2vw, w=8vw, h=2.8vw, borderLR=0.2, borderTB=0.35 */}
                        <Box
                            ml='5px'
                            w='200px'
                            h='40px'
                            bg={showResults ? '#D3D3D3': 'grey'}
                            borderRadius='5px'
                        >
                            {' '}
                            {/* for horizontal line*/}
                            <a
                                href='#answers'
                                className='center button black'
                                onClick={onClickAnswers}
                            >
                                View Answers
                            </a>
                        </Box>
                    </div>
                    {/*h=4.2vw*/}
                    <Box h='60px'></Box>
                </Box>
                </div>
            </Box>
    );
}

function convertTimeStringForDisplay(quizTimerString){
    let result = ''
    let numHours = parseInt(quizTimerString.slice(0,2))
    let numMinutes = parseInt(quizTimerString.slice(3,5))
    let numSeconds = parseInt(quizTimerString.slice(6,8))
    
    let secs = (numHours * 3600) + (numMinutes * 60) + (numSeconds);

    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    if(hours != 0)
        if(hours == 1)
            result += hours + ' Hour '
        else
            result += hours + ' Hours '

    if(minutes != 0)
        if(minutes == 1)
            result += minutes + ' Minute '
        else
            result += minutes + ' Minutes '

    if(seconds != 0)
        if(seconds == 1)
            result += seconds + ' Second '
        else
            result += seconds + ' Seconds '

    return result;
}
