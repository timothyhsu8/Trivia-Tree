import React from 'react';
import { useState } from 'react';
import { Box, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import bg from '../images/homebg.png';
import "../styles/postpage.css";
import moon from '../images/moon.jpg'
import heart from '../images/heart.jpeg'
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
} from 'react-router-dom';
import PostQuizAnswersCard from './PostQuizAnswersCard';
import { subscribe } from 'graphql';

export default function PostQuizPage() {
    function mainPage(){
        return;
    }
    function retry(){
        return;
      }

    //Later on these will pull from Leaderboard for given quiz in Database
    const [bleh, changeBleh] = useState(["alpha","vita","gamma","thelta","epsilon","zita","ita","thita"])
    const [score, changeScore] = useState(["5","5","4","4","3","3","2","2"])
    const [showResults, setShowResults] = React.useState(true)
    const onClickResults = () => {setShowResults(true);setShowAnswers(false);}
    const [showAnswers, setShowAnswers] = React.useState(false)
    const onClickAnswers = () => {setShowAnswers(true); setShowResults(false);}

    const [subbed, setSubbed] = React.useState(false)
    const onClickSubscribe = () => {setSubbed(!subbed); }
    const pulledData = false 
    let quiz = null;
    const {data, loading, error} = useQuery(queries.GET_QUIZ, { variables: {quizId:"616be915d990fe64da8f392e"} });
    


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

    if (error) {
        return `Error! ${error}`;
    }
    return(
        /*Go to line 145 for answers page*/
        <Box height="100%"> 
            <Box >  {/* Title and such*/}
                <Box className="containerAcross">   
                    <Box className="quizIconPadding">
                            <img className="quizIconTitle" alt="Moon"  src={moon} />
                    </Box>
                    <Box className="containerDown">  
                        <Box>
                            <h1 className="maintitle">Nintendo Music Page </h1>
                        </Box>
                        <Box className="containerAcross">  
                            <Box>
                                <img className="round_image2" alt="Moon" src={moon} />
                            </Box>
                            <Box>  
                                <h1 className="creator">Creator</h1>
                                <h1 className="creatorName">MarioGamer100</h1>
                            </Box>
                            
                        </Box>
                    </Box>
                    { subbed ? 
                    <Box>
                    <img className="heart" alt="Heart"  src={moon} onClick={onClickSubscribe}/>
                    </Box>
                    : 
                    <Box>
                    <img className="heart" alt="Heart"  src={heart} onClick={onClickSubscribe}/>
                    </Box>}
                    {/*used a little absolute positioning */}
                    <Box  ml="5px" w="200px" h="40px" position= "absolute" right="50px" margin="50px" bg='#165CAF' borderRadius='5px'>
                        <Link to="/prequizpage" className="center button blue" onClick={retry}>Retry Quiz</Link>  
                    </Box>
                </Box>


                <Box className="containerDown"> {/* Main Body*/}
                    <Box h="10px"></Box> {/* Can move everything down a little*/}
                    
                    <Box className="containerAcross">
                        
                        <Box className="containerDown">
                            <Box >  {/* for horizontal line*/}
                                <br></br>
                                <hr />
                                <br></br>
                            </Box>

                            { showResults ? 
                                <Box className = "results">
                                    <Box className="containerAcross">
                                        <Box mr ="20px" w="20px" >  {/* added space on the left side*/}
                                        </Box>
                                        <Box mt="50px" w="500px" h="350px" bg='gray' borderLeftRadius ="25px">  {/* Gradebox */}
                                            <h2 className="center">aasdad</h2>
                                        </Box>
                                        <Box  mt="50px" w="350px" h="350px" bg='#D3D3D3' borderRightRadius ="25px">  {/* for horizontal line*/}
                                        <h2 className="centercenter">aasdad</h2>
                                        </Box>
                                    </Box>
                                </Box>
                            : null }
                            
                            { showAnswers ? 
                            <Box className = "answers">
                                <Box className = "containerDown">
                                    <PostQuizAnswersCard correct={true} place={1} name={bleh[0]} image={moon} score={score[0]}></PostQuizAnswersCard>
                                    <PostQuizAnswersCard correct={false} place={1} name={bleh[0]} image={moon} score={score[0]}></PostQuizAnswersCard>
                                    <PostQuizAnswersCard correct={false} place={1} name={bleh[0]} image={moon} score={score[0]}></PostQuizAnswersCard>
                                    <PostQuizAnswersCard correct={true} place={1} name={bleh[0]} image={moon} score={score[0]}></PostQuizAnswersCard>
                                </Box>
                            </Box>
                            : null }
                        </Box>

                        <Box className="containerDown">{/* Statbox */}
                            <Box ml="50px" w="400px" h="50px" bg='gray'>  {/* leaderboards Heading*/}
                                <h1 className="leaderboard_title">Quiz Leaderboards</h1>
                            </Box>
                            <Box  ml="50px" w="400px" h="450px" bg='#D3D3D3'>  {/*bg='#D3D3D3' leaderboards*/}
                                
                                <LeaderboardCard place={1} name={bleh[0]} image={moon} score={score[0]}></LeaderboardCard>
                                <LeaderboardCard place={2} name={bleh[1]} image={moon} score={score[1]}></LeaderboardCard>
                                <LeaderboardCard place={3} name={bleh[2]} image={moon} score={score[2]}></LeaderboardCard>
                                <LeaderboardCard place={4} name={bleh[3]} image={moon} score={score[3]}></LeaderboardCard>
                                <LeaderboardCard place={5} name={bleh[4]} image={moon} score={score[4]}></LeaderboardCard>
                                <LeaderboardCard place={6} name={bleh[5]} image={moon} score={score[5]}></LeaderboardCard>
                                <LeaderboardCard place={7} name={bleh[6]} image={moon} score={score[6]}></LeaderboardCard>
                                <LeaderboardCard place={8} name={bleh[7]} image={moon} score={score[7]}></LeaderboardCard>
                            </Box>
                        </Box>
                    </Box>
                    <Box h="60px"></Box>

                    <Box className="containerAcross" >
                        <Box  ml="250px" w="200px" h="40px" bg='gray' borderRadius='5px'>{/* for horizontal line*/}
                            <a href="#results" className="center button white" onClick={onClickResults}>View Results</a>    
                        </Box>  
                        <Box  ml="5px" w="200px" h="40px" bg='#D3D3D3' borderRadius='5px'> {/* for horizontal line*/}
                            <a href="#answers" className="center button black" onClick={onClickAnswers}>View Answers</a>    
                        </Box>  
                    </Box>
                    
                    <Box h="60px"></Box>
                </Box>
            </Box>














        </Box>
    );

}