import { Box, Flex, HStack, Text, Grid, VStack, Button, Image, GridItem,Icon, Spacer} from "@chakra-ui/react"
import { useQuery, useMutation} from '@apollo/client';
import * as mutations from '../cache/mutations';
import { useState, useContext } from 'react';
import { Link, Redirect, useParams, useHistory } from 'react-router-dom';
import userImage from '../images/guest.png';
import quizImage from '../images/defaultquiz.jpeg';
import {BsHeart, BsShuffle, BsQuestionLg, BsFillPlayCircleFill} from "react-icons/bs"
import { MdTimer } from "react-icons/md";
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
            <Grid h="845px" templateRows="repeat(6, 1fr)"  pl="2%" pr="2%" bgColor="white" paddingTop="10px"> 

                {/* Title and Image */}
                <GridItem rowSpan={2} colSpan={6} borderBottom="2px" borderColor="gray.400">
                    <Flex direction="row" top="50%" left="2%" transform="translateY(-45%)" position="relative"> 
                        <Image w="175px" h="175px" src={icon_src} objectFit="cover" borderRadius="10%"></Image>
                        <Text fontSize="2.7vw" as="b" transform="translateY(57%)" paddingLeft="20px">{quizTitle}</Text>
                        {
                            isFavorited ? 
                            <Image as={BsHeart} color="red" w="50px" h="50px" transform="translateY(240%)" marginLeft="30px" _hover={{cursor:"pointer" }}onClick={toggleQuizFavorited}/>
                            : 
                            <Image as={BsHeart} w="50px" h="50px" transform="translateY(240%)" marginLeft="30px" _hover={{cursor:"pointer" }} onClick={toggleQuizFavorited}/>
                        }
                    </Flex>
                </GridItem>

                {/* Description */}
                <GridItem rowStart={3} colSpan={4} borderBottom="2px" borderColor="gray.400">
                    <Text top="20px" left="5px" position="relative" fontSize="22" noOfLines={3}> {quizDescription} </Text>
                </GridItem>

                {/* Settings */}
                <GridItem rowStart={4} rowSpan={3} colSpan={4}>
                    <Grid pt="7%" pl="5%" templateColumns="1fr 1fr" >
                        <HStack>
                            <Icon as={MdTimer} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> {quizTimer}</Text>
                        </HStack>
                        
                        <HStack>
                            <Icon as={BsShuffle} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> Ordered Questions </Text>
                        </HStack>
                    </Grid>

                    <Grid pt="4%" pl="5%" templateColumns="1fr 1fr">
                        <HStack>
                            <Icon as={BsQuestionLg} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> {numQuestions} Questions </Text>
                        </HStack>
                        
                        <HStack>
                            <Icon as={IoRibbonSharp} w={iconSize} h={iconSize} position="relative"/> 
                            <Text fontSize={iconTextSize} as="b"> Standard Quiz </Text>
                        </HStack>
                    </Grid>
                </GridItem>

                {/* Other Info */}
                <GridItem rowStart={3} rowSpan={4} colSpan={2} borderLeft="2px" borderColor="gray.400">
                    <Flex direction="column" position="relative" top="5%" left="3%">
                        <Flex direction="row" top="5%" left="3%" position="relative"> 
                                <Image w="70px" h="70px" src={userImage} objectFit="cover" borderRadius="50%"></Image>
                                <Flex direction="column" position="relative"> 
                                    <Text fontSize="24" as="b" left="10px" top="10px" position="relative" >Creator</Text>
                                    <Text fontSize="21" left="10px" top="7px" position="relative">{quizAuthor}</Text>
                                </Flex>
                        </Flex>
                        <Text fontSize="24" left="10px" top="30px" position="relative" >{numAttempts} Plays</Text>
                        <Text fontSize="24" left="10px" top="40px" position="relative">{numFavorites} Favorites</Text>
        
                        <Link to={'/quiztakingpage/' + quiz._id}> <Button colorScheme="blue" rightIcon={<BsFillPlayCircleFill/>} variant="solid" 
                        position="relative" top="265px" left="px" h="60px" fontSize="25px"> Start Quiz </Button></Link>
                    </Flex>
                </GridItem>
            </Grid>

  
        </Box>
    )
}
