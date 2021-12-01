import { Box, Flex, HStack, Text, Grid, Button, Image, GridItem,Icon, Avatar, Stack, } from "@chakra-ui/react"
import { useQuery, useMutation} from '@apollo/client';
import * as mutations from '../cache/mutations';
import { useState, useContext } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import { ViewIcon } from '@chakra-ui/icons'
import { BsHeart, BsHeartFill, BsShuffle, BsQuestionLg, BsFillPlayCircleFill, BsAlarm } from "react-icons/bs"
import { IoRibbonSharp } from "react-icons/io5";
import * as queries from '../cache/queries';
import { AuthContext } from '../context/auth';

export default function PreQuizPage({}) {
    const { user, refreshUserData } = useContext(AuthContext);
    let history = useHistory();
    let logged_in = false
    let { quizId } = useParams();

        // Checks if user is logged in
    if (user !== null && user !== "NoUser"){
        logged_in = true
    }

    let initialFavoriteState = false; 



    const [FavoriteQuiz] = useMutation(mutations.FAVORITE_QUIZ);
    const [UnfavoriteQuiz] = useMutation(mutations.UNFAVORITE_QUIZ);
    const [isFavorited, setIsFavorited] = useState(false);

    let quiz = null;
    let iconSize = "50px"
    let iconTextSize = "30px"
    

    const { data, loading, error, refetch } = useQuery(queries.GET_QUIZ, {
        variables: { quizId:quizId }, onCompleted() {
            if (logged_in){
                for(let i = 0; i < user.favoritedQuizzes.length; i++){
                    if(user.favoritedQuizzes[i] == quiz._id){
                        console.log("HERE")
                        console.log(user.favoritedQuizzes[i]);
                        console.log(quiz._id);
                        setIsFavorited(true);
                        break;
                    }
                }
            }         
        }
    });

    if (loading) {
        return <div></div>;
    }
    
    if (data) {
        quiz = data.getQuiz;
        console.log(quiz)
    }

    let quizTitle = quiz.title;
    let quizAuthor = quiz.user.displayName; 
    let quizDescription = quiz.description;
    let numQuestions = quiz.numQuestions; 
    let numAttempts = quiz.numAttempts;
    let numFavorites = quiz.numFavorites; 
    let quizTimer = quiz.quizTimer == null ? 'No Timer':quiz.quizTimer; 
    let icon_src = quiz.icon == null ? quizImage : quiz.icon
    console.log(quiz)

    const favoriteQuiz = async () => {
        if (logged_in){
            const {data} = await FavoriteQuiz({ variables: {quizId:quizId, userId: user._id}});
            console.log(data);
        }
        setIsFavorited(true);
        refetch()
        refreshUserData()
    }

    const unfavoriteQuiz = async () => {
        console.log(user.favoritedQuizzes)
        if (logged_in){
            const {data} = await UnfavoriteQuiz({ variables: {quizId:quizId, userId: user._id}});
            console.log(data);
        }
        setIsFavorited(false);
        refetch();
        refreshUserData();
        console.log(user.favoritedQuizzes)
    }

    const toggleQuizFavorited = async () => {
        console.log(user.favoritedQuizzes)
        if(logged_in){
            if(isFavorited == true){
                console.log("UNFAVORITE")
                unfavoriteQuiz();
            }
            else{
                console.log("FAVORITE")
                favoriteQuiz();
            }
        }
        console.log(user.favoritedQuizzes)
    }

    return ( 
        <Box>
            <Grid h="845px" templateRows="repeat(6, 1fr)" paddingTop="10px"> 

                {/* Title and Image */}
                <GridItem rowSpan={2} colSpan={6} borderBottom="1px solid" borderColor="gray.300" overflow="hidden">
                    <Flex pl="3%" direction="row" top="50%" transform="translateY(-45%)" position="relative"> 
                        <Image w="175px" h="175px" src={icon_src} objectFit="cover" borderRadius="10%"></Image>
                        <Text fontSize="275%" as="b" transform="translateY(62%)" paddingLeft="20px">
                            {quizTitle}
                            {
                                isFavorited ? 
                                <Icon as={BsHeartFill} color="red.500" w="45px" h="45px" marginLeft="30px" _hover={{cursor:"pointer", color:"red.300", transition:".1s linear" }} transition=".1s linear" onClick={toggleQuizFavorited}/>
                                : 
                                <Icon as={BsHeart} w="45px" h="45px" marginLeft="30px" color="gray.500" _hover={{cursor:"pointer", color:"red.400", transition:".1s linear" }} transition=".1s linear" onClick={toggleQuizFavorited}/>
                            }    
                        </Text>
                    </Flex>
                </GridItem>

                {/* Description */}
                <GridItem rowStart={3} colSpan={4} borderBottom="1px solid" borderColor="gray.300">
                    <Text pl="2%" top="20px" left="5px" position="relative" fontSize="22" noOfLines={3}> {quizDescription} </Text>
                </GridItem>

                {/* Settings */}
                <GridItem rowStart={4} rowSpan={3} colSpan={4} overflow="hidden">
                    <Grid pt="7%" pl="5%" templateColumns="1fr 1fr" >
                        <HStack spacing={4}>
                            <Icon as={BsAlarm} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> {quizTimer}</Text>
                        </HStack>
                        
                        <HStack spacing={3}>
                            <Icon as={BsShuffle} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> Ordered Questions </Text>
                        </HStack>
                    </Grid>

                    <Grid pt="4%" pl="5%" templateColumns="1fr 1fr">
                        <HStack>
                            <Icon as={BsQuestionLg} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> {numQuestions} Questions </Text>
                        </HStack>
                        
                        <HStack spacing={3}>
                            <Icon as={IoRibbonSharp} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> Standard Quiz </Text>
                        </HStack>
                    </Grid>
                </GridItem>

                {/* Other Info */}
                <GridItem rowStart={3} rowSpan={4} colSpan={2} borderLeft="1px" borderColor="gray.300">
                    <Flex direction="column" position="relative" top="5%" left="3%">
                        <HStack>
                            <Avatar src={quiz.user.iconImage} size="lg"/>
                            <Stack spacing={0}>
                                <Text fontSize="140%" as="b" >Creator</Text>
                                <Text fontSize="120%" left="10px">{quizAuthor}</Text>
                            </Stack>
                        </HStack>
                        <Text fontSize="140%" left="10px" top="30px" position="relative" >  <Icon as={ViewIcon} color="blue.400" /> {numAttempts} Plays</Text>
                        <Text fontSize="140%" left="10px" top="40px" position="relative"> <Icon as={BsHeartFill} color="red.400" /> {numFavorites} Favorites</Text>
                        
                        {/* Start Quiz Button */}
                        <Button 
                            w="fit-content" 
                            colorScheme="blue" 
                            rightIcon={<BsFillPlayCircleFill/>} 
                            variant="solid" 
                            position="relative" 
                            top="265px" 
                            h="60px" 
                            fontSize="25px"
                            onClick={() => history.push('/quiztakingpage/' + quiz._id)}
                        > 
                            Start Quiz 
                        </Button>
                    </Flex>
                </GridItem>
            </Grid>

  
        </Box>
    )
}
