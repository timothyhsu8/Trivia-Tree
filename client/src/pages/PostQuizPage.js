import React from 'react';
import { useState } from 'react';
import { Box, Flex, Center, Text, Stack, VStack, Button, Image, Avatar, Icon, useColorModeValue, Input, HStack, Grid } from "@chakra-ui/react"
import { Link, useHistory } from 'react-router-dom';
import userImage from '../images/guest.png';
import '../styles/postpage.css';
import quizicon from '../images/quizicon.png';
import coin from '../images/coin.png';
import quizImage from '../images/defaultquiz.jpeg';
import LeaderboardCard from '../components/LeaderboardEntryCard';
import QuizCard from '../components/QuizCard';
import CommentCard from '../components/CommentCard';
import {IoMdClock} from "react-icons/io"
import { useQuery, useMutation } from '@apollo/client';
import * as queries from '../cache/queries';
import * as mutations from '../cache/mutations';
import { useParams } from 'react-router-dom';
import PostQuizAnswersCard from '../components/PostQuizAnswersCard';
import { StarIcon } from '@chakra-ui/icons'
import { Rating, RatingView } from 'react-simple-star-rating'
import { BsAlarm, BsChatSquareDotsFill, BsCheck2, BsCheck2Square, BsFillFileTextFill, BsFillFilterSquareFill, BsPerson, BsStopwatch, BsTrophy } from 'react-icons/bs';

export default function PostQuizPage() {
    let history = useHistory();
    let logged_in = false;
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
    let user_icon = null;
    let player_icon = null;
    let quiz_recommendations = [];
    let user_id = null;
    let comments = null;
    let { quizId, quizAttemptId } = useParams();

    const [rating, setRating] = useState(0)
    const [isRated, setIsRated] = useState(false)
    const [rateQuiz] = useMutation(mutations.RATE_QUIZ, {
        onCompleted() {
            refetch();
        }
    });

    const [AddComment] = useMutation(mutations.ADD_COMMENT);
    const [DeleteComment] = useMutation(mutations.DELETE_COMMENT);
    const [comment, setComment] = React.useState('');
    const handleCommentChange = (event) => setComment(event.target.value);

    
    const [showResults, setShowResults] = React.useState(true);
    const onClickResults = () => {
        setShowResults(true);
        setShowAnswers(false);
        setShowComments(false);
    };
    const [showAnswers, setShowAnswers] = React.useState(false);
    const onClickAnswers = () => {
        setShowAnswers(true);
        setShowResults(false);
        setShowComments(false);
    };
    const [showComments, setShowComments] = React.useState(false);
    const onClickComments = () => {
        setShowComments(true);
        setShowAnswers(false);
        setShowResults(false);
    };

    const [subbed, setSubbed] = React.useState(false);
    const onClickSubscribe = () => {
        setSubbed(!subbed);
    };

    let quizAttempt = null; 
    let quiz = null; 

    const {data, error, loading} = useQuery(queries.GET_QUIZ_ATTEMPT, {
        fetchPolicy: 'network-only',
        variables: { _id: quizAttemptId },
    });

    const {data:data1, error:error1, loading:loading1} = useQuery(queries.GET_LEADERBOARD, {
        fetchPolicy: 'network-only',
        variables: { quiz_id: quizId },
    });

    const {data:data2, error:error2, loading:loading2, refetch} = useQuery(queries.GET_QUIZ, {
        fetchPolicy: 'network-only',
        variables: { quizId: quizId },
        onCompleted(data) {
            console.log(data2);
        }
    });
    //Dark mode styling
    const whiteBlackText=useColorModeValue("white", "black")

    const {data:data3, loading:loading3} = useQuery(queries.GET_POST_RECOMMENDATIONS, {
        fetchPolicy: 'catch-first', //does this stop it
        variables: { quiz_id: quizId }
    });

    const buttons = [
        {
            text: "Results",
            page: "#results",
            isShowing: showResults,
            icon: BsFillFilterSquareFill,
            clickFunction: onClickResults
        },
        {
            text: "Answers",
            page: "#answers",
            isShowing: showAnswers,
            icon: BsCheck2Square,
            clickFunction: onClickAnswers
        },
        {
            text: "Comments",
            page: "#comments",
            isShowing: showComments,
            icon: BsChatSquareDotsFill,
            clickFunction: onClickComments
        }
    ]

    function calculateBetterScore(userScore, averageScore, attempts) {
        if (attempts === 1) {
            return <Text fontSize="10px"> No comparisons possible, you are the first to take this quiz </Text>
        }
        //First we have to calculate the average when the user's score is factored out
        console.log(averageScore);
        let adjustedAverage = ((averageScore * attempts) - userScore) / (attempts - 1);
        adjustedAverage = Math.round(adjustedAverage * 10) / 10;
        let increase = userScore - adjustedAverage;
        let percentIncrease;
        if (adjustedAverage === 0) {
            percentIncrease = Math.abs(increase);
        }
        else {
            percentIncrease = ((Math.abs(increase)) / adjustedAverage) * 100;
        }
        percentIncrease = Math.round(percentIncrease * 100) / 100;
        console.log(percentIncrease)
        if (increase >= 0) {
            return `You ${percentIncrease}% better than other Quiztakers`
        } else {
            return `You ${percentIncrease}% worse than other Quiztakers`
        }
    }

    if (loading) {
        return <div></div>;
    }

    if (loading1) {
        return <div></div>;
    }

    if (loading2) {
        return <div></div>;
    }

    if (loading3) {
        return <div></div>;
    }

    if (error || error1 || error2) {
        return (
            <Center>
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                    This quiz does not exist{' '}
                </Text>
            </Center>
            )
    }

    if(data){
        quizAttempt = data.getQuizAttempt
        quiz = quizAttempt.quiz
        quizScore = quizAttempt.score;
        if(quizAttempt.user != null){
            logged_in=true;
            player_icon = quizAttempt.user.iconImage;
            user_id = quizAttempt.user._id;
        }

        elapsedTime = quizAttempt.elapsedTime;
        elapsedTime = convertTimeStringForDisplay(elapsedTime)
        attemptNumber = quizAttempt.attemptNumber; 
        numCorrect = quizAttempt.numCorrect;
        creator = quiz.user.displayName;
        answerChoices = quizAttempt.answerChoices;
        coinsEarned = quizAttempt.coinsEarned;
        // console.log(quizAttempt);
        // console.log(quiz);
        // console.log(answerChoices)
    }

    if (data1) {
        leaderboard = data1.getLeaderboard
        // console.log(leaderboard)
    }

    if (data2) {
        questions = data2.getQuiz.questions
        comments = data2.getQuiz.comments
        comments = reverseArr(comments)
        icon_src = data2.getQuiz.icon == null ? quizImage : data2.getQuiz.icon
        console.log(data2.getQuiz);
        user_icon = data2.getQuiz.user.iconImage

    }

    if (data3) {
        // console.log(leaderboard)
        quiz_recommendations = data3.getPostRecommendations;
        console.log(quiz_recommendations)
    }

    function handleRating(rate) {
        setRating(rate)
        const {data} = rateQuiz({variables: {quizId: quizId, rating: rate }});
        // Some logic
        setIsRated(true);
    }

    async function handleAddComment(){
        console.log(comment);
        const {data} = await AddComment({ variables: {
            quiz_id: quizId, user_id: user_id, comment: comment
        }});
        setComment("");
        refetch();
    }

    async function handleDeleteComment(comment_id){
        console.log(comment_id);
        const {data} = await DeleteComment({ variables: {
            quiz_id: quizId, user_id: user_id, comment_id: comment_id
        }});
        refetch();
    }

    let quizTitle = quiz.title;

    return(
        <Box>    
            {/* HEADER/BANNER */}
            <Grid templateColumns="1fr 0.45fr" mt="50px">
                {/* Left Side of Page (Quiz Title / Results / Answers / Comments) */}
                <Box>
                    <Box>
                        {/* PROFILE PICTURE */}
                        <HStack spacing={10}>
                            <Image w="175px" h="175px" ml={10} src={icon_src} objectFit="cover" borderRadius="10%"></Image> 
                            <Stack>
                                {/* Quiz Title */}
                                <Text as="b" className="title" fontSize="260%">{quizTitle}</Text> 

                                {/* Quiz Creator */}
                                <HStack spacing={3}>
                                    <Avatar w="80px" h="80px" src={user_icon} _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + data2.getQuiz.user._id)}/>
                                    <Flex direction="column"> 
                                        <Text fontSize="24" fontWeight="bold"> Creator </Text>
                                        <Text fontSize="22" _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + data2.getQuiz.user._id)}> { creator } </Text>
                                    </Flex>
                                </HStack>
                            </Stack>
                        </HStack>
    
                        <Center>
                            <Box w="95%" mt={4} h="1px" bgColor="gray.300" />
                        </Center>
                    </Box>
                
                    <Box>
                        {/* Buttons for View Results / View Answers / View Comments */}
                        <Center>
                            <HStack mb={1} mt={10} mb={5}>
                                {
                                    buttons.map((button, key) => {
                                        return (
                                            <Box
                                                key={key}
                                                w='200px'
                                                h='40px'
                                                color={button.isShowing ? 'white': 'gray.500'}
                                                bg={button.isShowing ? 'gray.600': 'gray.200'}
                                                borderRadius='5px'
                                                position="relative"
                                                transition="0.1s linear"
                                                _hover={{opacity:'80%', cursor:"pointer", transition:"0.15s linear"}}
                                            >
                                                {/* for horizontal line*/}
                                                <a
                                                    href={button.page}
                                                    className='center button black'
                                                    onClick={ button.clickFunction }
                                                >
                                                    <Icon as={button.icon} pos="relative" boxSize={4} top={0.5} mr={2}/>
                                                    { button.text } { button.page === "#comments" ? `(${comments.length})` : "" }
                                                </a>
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                        </Center>
            
                        {/* RESULTS SECTION */}
                        {showResults ? 
                            <Center>
                                <Box className='containerAcross'>
                                    {/* You Scored, Rate Quiz */}
                                    <Box
                                        width={["48vw","48vw","48vw","37vw"]}
                                        h='350px'
                                        bg='#373535'
                                        paddingTop={33}
                                        borderLeftRadius='20px'
                                    >
                                        <VStack>
                                            <Text fontSize="40px" color="white"> You scored: {numCorrect}/{quiz.numQuestions} = {quizScore}%</Text>
                                            <Text fontWeight="thin" fontSize="20px" color="white"> The average score is {quiz.averageScore}</Text>
                                            <Text fontWeight="thin" fontSize="20px" color="white">{calculateBetterScore(quizScore, quiz.averageScore, quiz.numAttempts)}</Text>
                                            <Text fontSize="30px" top="20px" color="white">
                                                Rate Quiz &nbsp;
                                                <Icon pos="relative" as={StarIcon} bottom="5px" boxSize="8" color="yellow.500"/>
                                                &nbsp;{data2.getQuiz.rating ? data2.getQuiz.rating : 'N/A'}
                                            </Text>
                                            <Box>
                                                {
                                                    !isRated ? 
                                                    <Rating onClick={handleRating} ratingValue={rating} size={50}/>
                                                    :
                                                    <RatingView ratingValue={rating} size={50}/>
                                                }
                                                
                                            </Box>
                                            { isRated ? <Text fontSize="20px" color="white">Thank you for rating!</Text> : ""}
                                        </VStack>
                                    </Box>

                                    {/* Time Taken, Attempt #, Coins Gained */}
                                    <Box
                                        width={["38vw","38vw","38vw","28vw"]}
                                        h='350px'
                                        bg='#E3E3E3'
                                        borderRightRadius='20px'
                                    >
                                        <Box h="100%" display="flex" flexDirection="column" justifyContent="center">
                                            <Stack spacing={4} pl={8}>
                                                <Flex direction="row">
                                                    <Icon as={IoMdClock} h="80px" w="80px" position="relative" top="-16px" mr={3}></Icon>
                                                    <Text fontSize="28px">{elapsedTime}</Text>
                                                </Flex>

                                                <Flex direction="row">
                                                    <Image src={quizicon} h="80px" w="80px" position="relative" top="-16px" mr={3}></Image>
                                                    <Text fontSize="28px">Attempt {attemptNumber}</Text>
                                                </Flex>

                                                <Flex direction="row">
                                                    <Image src={coin} h="80px" w="80px" position="relative" top="-16px" mr={3}></Image>
                                                    <Text fontSize="28px">{coinsEarned == 0 ? 'No Coins Given' : coinsEarned}</Text>
                                                </Flex>
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Box>
                            </Center>
                            : ""}

                        {/* ANSWERS SECTION */}
                        {showAnswers ?
                            <Box paddingLeft={8}>
                                <Box className='answerbox'>
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
                        : ""}

                        {/* COMMENTS SECTION */}
                        {showComments ?
                            <Box
                                width="90%"
                                mt='15px'
                                paddingLeft={14}
                                paddingRight="15px"
                            >
                                <Text marginBottom="20px" borderBottom="1px" borderColor="gray.300" fontSize="22px">Comments ({comments.length})</Text>
                                { logged_in ? 
                                    <Flex direction="row">
                                        <Avatar src={player_icon}/>
                                        <Input value={comment} onChange={handleCommentChange} variant='filled' placeholder='Add a public comment...' marginLeft="20px" marginBottom="20px"
                                            _hover={{pointer:"cursor", bgColor:"gray.200"}}
                                            _focus={{bgColor:"white", border:"1px", borderColor:"blue.400"}}/>
                                        <Button w="140px" colorScheme='blue' size="md" marginLeft="20px" onClick={handleAddComment}>
                                            Comment
                                        </Button>
                                    </Flex>
                                : ""}

                                <Flex direction="column" display="flex" flexWrap="wrap">
                                    {comments.map((comment, key) => {
                                        return (
                                            <CommentCard
                                                comment={comment}
                                                logged_in={logged_in}
                                                user_id={user_id}
                                                player_icon={player_icon}
                                                handleDeleteComment={handleDeleteComment}
                                                refetch={refetch}
                                                quiz_id={quizId}
                                                key={key}
                                            />
                                        )
                                    })}
                                </Flex>
                            </Box>
                        : ""}
                    </Box>
                </Box>

                {/* Right Side of Page (Recommendations / Leaderboard) */}
                <Box>
                    <Stack spacing={10}>
                        {/* Recommended Quizzes */}
                        <Stack w="95%" bg='gray.100' borderRadius="2%" >
                            <Box mt="1%" ml="2%" mr="2%">
                                <Text fontSize="125%" mt={2} ml="1%" fontWeight="medium" textColor="gray.700"> Recommended Quizzes </Text>
                                <Flex mt="0.5%" spacing="10%" display="flex" flexWrap="wrap" >
                                    {quiz_recommendations.map((quiz, key) => {
                                        return <QuizCard 
                                            quiz={quiz} 
                                            width="7.5%" 
                                            title_fontsize="80%" 
                                            author_fontsize="75%" 
                                            include_author={true}
                                            char_limit={30} 
                                            key={key}
                                        />
                                    })}
                                </Flex>
                            </Box>
                            <Button 
                                w="100%" 
                                h="40px" 
                                color="white"
                                bg='#165CAF' 
                                borderRadius='5px' 
                                _hover={{bgColor:"#3780d7", cursor:"pointer", transition:"0.15s linear"}}
                                onClick={() => history.push('/prequizpage/' + quiz._id)}
                            >
                                Retry Quiz
                            </Button>
                        </Stack>
                        
                        {/* Leaderboard */}
                        <Box w="95%" minW="430px" overflow="hidden">
                            <Box h='50px' bg='gray.800' color="white" lineHeight="2" position="relative" borderTopRadius={6}>
                                <Text className='leaderboard_title'>
                                    Leaderboard
                                </Text>
                            </Box>
                            <Box borderBottomRadius="2%" h='350px' position="relative" paddingTop="10px" border="1px" borderColor="gray.300">
                                <Grid h={8} templateColumns="0.2fr 0.40fr 0.2fr 0.2fr" fontWeight="medium">
                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Center>
                                            <Text>
                                                <Icon as={BsTrophy} pos="relative" top={-0.4}  mr={2}/>
                                                Rank
                                            </Text>
                                        </Center>
                                    </Box>
                                    
                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Text>
                                            <Icon as={BsPerson} pos="relative" top={-0.4}  mr={2}/>
                                            Name
                                        </Text>
                                    </Box>

                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Center>
                                            <Text>
                                                <Icon as={BsAlarm} pos="relative" top={-0.4}  mr={2}/>
                                                Time
                                            </Text>
                                        </Center>
                                    </Box>

                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Center>
                                            <Text>
                                                <Icon as={BsCheck2Square} pos="relative" top={-0.4}  mr={2}/>
                                                Score
                                            </Text>
                                        </Center>
                                    </Box>
                                </Grid>
                                
                                <Box h="1px" mt={1} mb={1} bgColor="gray.300" />

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
                    </Stack>
                </Box>
            </Grid>
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

function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}
