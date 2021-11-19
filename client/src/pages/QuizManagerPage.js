import {
    Box,
    Text,
    Grid,
    VStack,
    Button,
    Image,
    Center,
    Spinner,
    Flex,
    Textarea,
    FormControl,
    FormLabel,
    Select,
    HStack,
    Icon
} from '@chakra-ui/react';
import { GET_USER } from '../cache/queries';
import { useQuery, useMutation, gql } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { useState, useContext, createRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BsFillFileEarmarkTextFill, BsFillPersonFill, BsHeart } from 'react-icons/bs';
import { ViewIcon } from '@chakra-ui/icons';

export default function QuizManagerPage() {
    const { user } = useContext(AuthContext);
    let history = useHistory();

    const [firstQueryDone, setFirstQueryDone] = useState(false);
    const {
        loading,
        error,
        data: { getUser: userData } = {},
    } = useQuery(GET_USER,
        (!user || user === 'NoUser') ?
        {skip: true} : {
        fetchPolicy: 'cache-and-network',
        variables: { _id: user._id},
        onCompleted({ getUser: userData }) {
            if (userData) {
                setFirstQueryDone(true);
            }
        },
        
    });

    if (user === 'NoUser') {
        return (
            <Center>
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                   You need an account to be able to manage quizzes{' '}
                </Text>
            </Center>
        );
    }

    if ((loading || !user) && !firstQueryDone) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    if (error) {
        return (
            <Center>
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                    Sorry, something went wrong{' '}
                </Text>
            </Center>
        );
    }

    console.log(userData);
    return (
        <Box>
            <Center> 
                <Text mt="1%" fontSize="250%" fontWeight="medium" color="gray.700"> Your Quizzes </Text>
            </Center>
            
            {/* PLATFORM CARDS */}
            {
                userData.quizzesMade.length !== 0 ?
                    <Grid mt="0.5%" ml="5%" mr="5%" templateColumns="repeat(auto-fill, minmax(425px, 1fr))">
                        {
                            userData.quizzesMade.map((quiz, key) => {
                                return (
                                    <Box 
                                        key={key}
                                        w="90%" 
                                        mt={5} 
                                        borderRadius={10} 
                                        boxShadow="lg" 
                                        transition=".1s linear"
                                        _hover={{cursor:"pointer", opacity:"85%", transition:".15s linear"}} 
                                        _active={{opacity:"75%"}}
                                        onClick={() => history.push('/prequizpage/' + quiz._id)}
                                    >
                                        <VStack>
                                            {/* PLATFORM IMAGE */}
                                            <Box
                                                pos="relative"
                                                w="100%"
                                                h="20vh"
                                                bgColor="gray.300"
                                                // bgImage={"linear-gradient(to bottom, rgba(245, 246, 252, 0.10), rgba(30, 30, 30, 0.75)), url('" + platform.bannerImage +  "')"}
                                                bgSize="cover" 
                                                bgPosition="center"
                                                borderTopRadius={10}
                                            >
                                                <HStack w="100%" spacing={3} pos="absolute" bottom="5%" ml="2%">
                                                    <Box className='squareimage_container' w="15%" minW={50}> 
                                                        <Image className="squareimage" src={quiz.icon} objectFit="cover" borderRadius="50%" border="2px solid white"></Image>
                                                    </Box>
                                                    <Text className="disable-select" fontSize="160%" textColor="white" fontWeight="medium"> {quiz.title} </Text>
                                                </HStack>
                                            </Box>
                                            <Text className="disable-select" fontSize="125%"> 
                                                <Icon as={ViewIcon} /> {quiz.numAttempts} Attempts 
                                            </Text>
                                            <Text className="disable-select" fontSize="125%" pb={3}> 
                                                <Icon as={BsHeart} /> {quiz.numFavorites} Favorites 
                                            </Text>
    
                                        </VStack>
                                    </Box>   
                                )
                            })
                        }
                    </Grid>
                    :
                    // User has not created any quizzes
                    <Center>
                        <Text mt="15%" fontSize="200%"> You don't have any quizzes! </Text>
                    </Center>
            } 
        </Box>
    )
}
