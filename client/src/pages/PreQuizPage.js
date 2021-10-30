import { Box, Flex, Center, Text, Grid, VStack, Button, Image, GridItem,Icon, Spacer} from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { Link, Redirect, useParams } from 'react-router-dom';
import userImage from '../images/default.png';
import quizImage from '../images/defaultquiz.jpeg';
import {BsHeart, BsShuffle, BsQuestionLg, BsFillPlayCircleFill} from "react-icons/bs"
import { MdTimer } from "react-icons/md";
import { IoRibbonSharp } from "react-icons/io5";
import * as queries from '../cache/queries';

export default function PreQuizPage({}) {
    let { quizId } = useParams();
    let quiz = null;


    const { data, loading, error } = useQuery(queries.GET_QUIZ, {
        variables: { quizId:quizId },
    });

    if (loading) {
        return <div></div>;
    }
    
    if (data) {
        quiz = data.getQuiz;
    }


    let quizTitle = quiz.title;
    let quizDescription = quiz.description;
    let user = "No User Found";
    let pfp_src = quizImage;
    let numQuestions = quiz.numQuestions; 
    let numAttempts = quiz.numAttempts;
    let numFavorites = quiz.numFavorites; 

    return ( 
        <Box>
   

            <Grid h="845px" templateRows="repeat(6, 1fr)" templateColumns="repeat(6, 1fr)" px="20px" py="20px" bgColor="white" paddingTop="10px"> 

                {/* Title and Image */}
                <GridItem rowSpan={2} colSpan={6} borderBottom="1px">
                    <Flex direction="row" top="50%" left="2%" transform="translateY(-45%)" position="relative"> 
                            <Image w="200px" h="200px" src={pfp_src} objectFit="cover" borderRadius="10%" border="solid"></Image>
                            <Text top="56%" position="absolute" left="13%" fontSize="4vw" as="b" >{quizTitle}</Text>
                            <Icon as={BsHeart} w="50px" h="50px" position="absolute" left = "53%" top="74%"/>
                    </Flex>
                </GridItem>

                {/* Description */}
                <GridItem rowStart={3} colSpan={4} borderBottom="1px">
                    <Text top="30px" left="30px" position="relative" fontSize="20">{quizDescription}</Text>
                </GridItem>

                {/* Settings */}
                <GridItem rowStart={4} rowSpan={3} colSpan={4}>
                    <Grid templateRows="repeat(2, 1fr)" gap={12} top="70px" position="relative">
                        <Flex direction="row">
                            <Icon as={MdTimer} w="75px" h="75px" left="30px" position="relative"/> 
                            <Text fontSize="40" as="b" left="40px" top="8px" position="relative">No Timer</Text>
                            <Spacer/>
                            <Icon as={BsShuffle} w="75px" h="75px" right="500px" position="relative"/> 
                            <Text fontSize="40" as="b" right="120px" top="8px" position="absolute"> Ordered Questions </Text>
                        </Flex>
                        
                        <Flex direction="row">
                            <Icon as={BsQuestionLg} w="75px" h="75px" left="30px" position="relative"/>
                            <Text fontSize="40" as="b" left="40px" top="8px" position="relative">{numQuestions} Questions</Text> 
                            <Spacer/>
                            <Icon as={IoRibbonSharp} w="75px" h="75px" right="500px" position="relative"/> 
                            <Text fontSize="40" as="b" right="210px" top="135px" position="absolute"> Standard Quiz </Text>
                        </Flex>

                    </Grid>
                </GridItem>

                {/* Other Info */}
                <GridItem rowStart={3} rowSpan={4} colSpan={2}borderLeft="1px">
                    <Flex direction="column" position="relative" top="5%" left="3%">
                        <Flex direction="row" top="5%" left="3%" position="relative"> 
                                <Image w="100px" h="100px" src={userImage} objectFit="cover" borderRadius="50%" border="solid"></Image>
                                <Flex direction="column" position="relative"> 
                                    <Text fontSize="26" as="b" left="10px" top="15px" position="relative" >Creator</Text>
                                    <Text fontSize="24" left="10px" top="15px" position="relative">{user}</Text>
                                </Flex>
                        </Flex>
                        <Text fontSize="24" left="10px" top="30px" as="b" position="relative" >{numAttempts} Plays</Text>
                        <Text fontSize="24" left="10px" top="40px" as="b" position="relative">{numFavorites} Favorites</Text>
        
                        <Link to={'/quiztakingpage/' + quiz._id}> <Button colorScheme="blue" rightIcon={<BsFillPlayCircleFill/>} variant="solid" 
                        position="relative" top="265px" left="px" h="60px" fontSize="40px"> Start Quiz </Button></Link>

                    </Flex>

                </GridItem>
            </Grid>

  
        </Box>
    )
}
