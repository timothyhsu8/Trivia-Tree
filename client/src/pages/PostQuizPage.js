import React from 'react';
import { useState } from 'react';
import { Box, Flex, Center, Text, Grid, VStack, Button, Image } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import bg from '../images/homebg.png';
import '../styles/postpage.css';
import moon from '../images/moon.jpg';
import heart from '../images/heart.jpeg';
import quizImage from '../images/defaultquiz.jpeg';
import LeaderboardCard from './LeaderboardEntryCard';
import PostQuizAnswers from './PostQuizAnswersCard';
import { useQuery } from '@apollo/client';
import * as queries from '../cache/queries';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
    Router,
    useParams
} from 'react-router-dom';
import PostQuizAnswersCard from './PostQuizAnswersCard';
import { subscribe } from 'graphql';

export default function PostQuizPage() {
    let quizScore = null; 

    let { quizId, quizAttemptId } = useParams();


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
    const [score, changeScore] = useState([
        '5',
        '5',
        '4',
        '4',
        '3',
        '3',
        '2',
        '2',
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

    const {data, loading} = useQuery(queries.GET_QUIZ_ATTEMPT, {
        variables: { _id: quizAttemptId },
    });

    const {data:data1, loading1 } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: quizId },
    });

    if (loading) {
        return(
            <Box height="auto">
                <h1 className="maintitle">"Loading..."</h1>
                <Box className="quizIconCentered" w="50%" h="50%">
                            <img alt="Moon" src={moon} />
                </Box>
                <h1 className="center button white">"Here's a picuture of the moon while you wait!"</h1>
                <Box h="200px">
                </Box>
            </Box>
            
       //Displays a loading screen while it waits
        );
    }
    if (loading1) {
        return(
            <Box height="auto">
                <h1 className="maintitle">"Loading..."</h1>
                <Box className="quizIconCentered" w="50%" h="50%">
                            <img alt="Moon" src={moon} />
                </Box>
                <h1 className="center button white">"Here's a picuture of the moon while you wait!"</h1>
                <Box h="200px">
                </Box>
            </Box>
            
       //Displays a loading screen while it waits
        );
    }

    if(data){
        quizAttempt = data.getQuizAttempt
        quizScore = quizAttempt.score;
        console.log(quizAttempt);
    }

    if(data1){
        quiz = data1.getQuiz;
        console.log(quiz);
    }

    let quizTitle = quiz.title;
    let user = "None";
    let pfp_src = quizImage;
    let heartE = "data:image/png;base64,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";
    let heartF = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";






    return(
        /*Go to line 145 for answers page*/
        <Box> 
            <Box h="50px"></Box>
            <Grid>
                
                {/* MAIN CONTENT */}
                <Box>
                    {/* HEADER AND BANNER */}
                    <Grid h={["100px","100px","100px","200px"]} >
                        {/* BANNER */}
                        <Box
                            bgSize="cover" 
                            bgPosition="center"
                            borderRadius="10">
                                {/* PROFILE PICTURE AND NAME className="fadeshow1" for image?*/}
                                <div className="SecretSauce"> 
                                    <Image width={["100px","100px","100px","200px"]} height={["100px","100px","100px","200px"]} src={pfp_src} objectFit="cover" borderRadius="10%"></Image> 
                                    <Box className="containerDown">  
                                    <Box width={["200px","200px","200px","300px"]}>  
                                    <Text as="b" className="title" lineHeight={["40px","40px","40px","80px"]}  fontSize={["20px","20px","20px","30px"]}>{quizTitle}</Text>     
                                    </Box>
                                    <Box>  
                                    <Text className="title" lineHeight={["0px","0px","0px","0px"]} pt={["0px","0px","0px","0px"]} pb={["0px","0px","0px","0px"]} fontSize={["20px","20px","20px","30px"]}>Creator:</Text>     
                                    </Box>
                                    <Text className="creatorName" lineHeight={["35px","35px","35px","60px"]} fontSize={["20px","20px","20px","30px"]}>{user}</Text>
                                    </Box>
                                    <Box w="2vw"></Box>
                                    { subbed ? 
                                        <Image width={["32px","32px","32px","70px"]} h={["32px","32px","32px","70px"]} mt="30px" src={heartF} borderRadius="0" onClick={onClickSubscribe}></Image>
                                    : 
                                    <Image w="70px" h="70px" mt="30px" src={heartE} borderRadius="0" onClick={onClickSubscribe}></Image>
                                    }
                                    
                                    <Box w={["0vw","31vw","41vw","40vw"]}></Box>
                                    
                                    
                                    {/*used a little absolute positioning */}
                                    <div className="containerDown">
                                        <Box h="30px"></Box>
                                        <Box w={["100vw","100px","200px","200px"]} h="50px" bg='#165CAF' borderRadius='5px'>
                                            <Link to="/prequizpage" className="center button white" onClick={retry}><Text  mt={["10px","10px","0px","0px"]} fontSize={["0vw","15px","23px","23px"]}  >Retry Quiz</Text></Link>  
                                        </Box>
                                    </div>
                                </div>
                        </Box>
                    </Grid>

                </Box>
            </Grid>


                                    {/*Part II: Main Body*/}
                <div className="SecretSauce">
                <Box className='containerDown'>
                    {' '}
                    {/* Can move everything down a little*/}
                    <Box className='containerAcross'>
                        <Box className='containerDown'>
                            <Box>
                                {' '}
                                {/* for horizontal line*/}
                                <br></br>
                                <hr />
                                <br></br>
                            </Box>

                            {showResults ? (
                                <Box className='results'>
                                    <Box className='containerAcross'>
                                        {/*Statbox Part I and II*/}
                                        <Box
                                            width={["48vw","48vw","48vw","37vw"]}
                                            mt='50px' 
                                            h='320px'
                                            bg='gray'
                                            borderLeftRadius='25px'
                                        > {/*h=3.5vw, w=200vw, h=24.5vw */}
                                            {' '}
                                            {/* Gradebox */}
                                            <Text className='center' fontSize="50px" as='b' top="150px" position="relative">You scored {quizScore}%</Text>
                                        </Box>
                                        <Box
                                            
                                            mt='50px'
                                            width={["38vw","38vw","38vw","28vw"]}
                                            h='320px'
                                            bg='#D3D3D3'
                                            borderRightRadius='25px'
                                        >
                                            {' '}
                                            <h2 className='centercenter'>
                                            </h2>
                                        </Box>{/*h=3.5vw, w=14vw, h=24.5vw */}
                                    </Box>
                                    <Box h={["50px"]}></Box>
                                </Box>
                            ) : null}

                            {showAnswers ? (
                                <Box className='answers'>
                                    <Box className='containerDown'>
                                        <PostQuizAnswersCard
                                            correct={true}
                                            place={1}
                                            name={bleh[0]}
                                            score={score[0]}
                                        ></PostQuizAnswersCard>
                                        <PostQuizAnswersCard
                                            correct={false}
                                            place={1}
                                            name={bleh[0]}
                                            score={score[0]}
                                        ></PostQuizAnswersCard>
                                        <PostQuizAnswersCard
                                            correct={false}
                                            place={1}
                                            name={bleh[0]}
                                            score={score[0]}
                                        ></PostQuizAnswersCard>
                                        <PostQuizAnswersCard
                                            correct={true}
                                            place={1}
                                            name={bleh[0]}
                                            score={score[0]}
                                        ></PostQuizAnswersCard>
                                    </Box>
                                    <Box h='50px'></Box>
                                </Box>
                            ) : null}
                        </Box>
                        <Box w="3vw"></Box>
                        <div className="fadeshow1">
                        <Box className='containerDown'>
                            {/* Statbox */}
                            <Box w='28vw' h='50px' bg='gray'>
                                {' '}
                                {/* leaderboards Heading*/}
                                <h1 className='leaderboard_title'>
                                    Quiz Leaderboards
                                </h1>
                            </Box>{/*w=2vw, w=16vw, h=3.5vw */}
                            {/*w=2vw, w=16vw, h=31.5vw */}
                            <Box w='28vw' h='450px' bg='#D3D3D3'>
                                {' '}
                                {/*bg='#D3D3D3' leaderboards*/}
                                <LeaderboardCard
                                    place={1}
                                    name={bleh[0]}
                                    image={moon}
                                    score={score[0]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={2}
                                    name={bleh[1]}
                                    image={moon}
                                    score={score[1]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={3}
                                    name={bleh[2]}
                                    image={moon}
                                    score={score[2]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={4}
                                    name={bleh[3]}
                                    image={moon}
                                    score={score[3]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={5}
                                    name={bleh[4]}
                                    image={moon}
                                    score={score[4]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={6}
                                    name={bleh[5]}
                                    image={moon}
                                    score={score[5]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={7}
                                    name={bleh[6]}
                                    image={moon}
                                    score={score[6]}
                                ></LeaderboardCard>
                                <LeaderboardCard
                                    place={8}
                                    name={bleh[7]}
                                    image={moon}
                                    score={score[7]}
                                ></LeaderboardCard>
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
                            bg='gray'
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
                            bg='#D3D3D3'
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
