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
import { ViewIcon, StarIcon } from '@chakra-ui/icons';
import { GrScorecard } from 'react-icons/gr';

export default function QuizManagerPage() {
    const { user } = useContext(AuthContext);
    let history = useHistory();

    const [firstQueryDone, setFirstQueryDone] = useState(false);
    const {
        loading,
        error,
        data: { getUser: userData } = {},
        refetch
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
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    });

    const [deleteQuiz] = useMutation(DELETE_QUIZ, {
        onCompleted() {
            refetch();
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    function handleDeleteQuiz(quizId) {
        deleteQuiz({
            variables: {
                quizId,
            },
        });
    }

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
            <Button display='inline' pos='absolute' top='70px' right='10px' backgroundColor='cyan.500' color='white' onClick={() => history.push('/createQuiz')} _focus={{ outline: 'none' }} _hover={{ backgroundColor: 'cyan.600' }} _active={{backgroundColor: 'cyan.700'}}>Create Quiz</Button>

            {/* PLATFORM CARDS */}
            {
                userData.quizzesMade.length !== 0 ?
                    <Grid mt="0.5%" ml="5%" mr="5%" justifyItems='center' rowGap='3%' templateColumns="repeat(auto-fill, minmax(600px, 1fr))">
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
                                        // _hover={{cursor:"pointer", opacity:"85%", transition:".15s linear"}} 
                                        // _active={{opacity:"75%"}}
                                        // onClick={() => history.push('/prequizpage/' + quiz._id)}
                                    >
                                            {/* PLATFORM IMAGE */}
                                            <Box
                                                pos="relative"
                                                w="100%"
                                                h="20vh"
                                                // bgColor="gray.300"
                                                bgGradient="linear(to-br, gray.100, gray.600)" 
                                                // bgImage={"linear-gradient(to bottom, rgba(245, 246, 252, 0.10), rgba(30, 30, 30, 0.75)), url('" + platform.bannerImage +  "')"}
                                                bgSize="cover" 
                                                bgPosition="center"
                                                borderTopRadius={10}
                                                display='flex'
                                            >
                                                <HStack w="100%" spacing={3} ml="2%">
                                                    <Box className='squareimage_container' w="15%" minW={50}> 
                                                        <Image className="squareimage" src={quiz.icon} objectFit="cover" borderRadius="50%" border="2px solid white"></Image>
                                                    </Box>
                                                    <Text className="disable-select" fontSize="160%" textColor="white" fontWeight="medium"> {quiz.title} </Text>
                                                    <Box pl='4%'>
                                                        <VStack spacing={4} align='start'>
                                                            <Text className="disable-select" fontSize="125%"> 
                                                                <Icon as={ViewIcon} /> {quiz.numAttempts} Attempts 
                                                            </Text>
                                                            <Text className="disable-select" fontSize="125%"> 
                                                                <Icon as={BsHeart} /> {quiz.numFavorites} Favorites 
                                                            </Text>
                                                            <Text className="disable-select" fontSize="125%"> 
                                                                <Icon as={StarIcon} /> {quiz.rating ? quiz.rating : 'N/A'} {quiz.rating ? `(${quiz.numRatings} Ratings)`: ''}
                                                            </Text>
                                                        </VStack>
                                                    </Box>
                                                    <Box pl='6%'>
                                                        <VStack spacing={4} align='start'>
                                                            <Text className="disable-select" fontSize="125%"> 
                                                                <Icon as={GrScorecard} /> {quiz.averageScore !== null ? `${quiz.averageScore}%` : 'No'} Average Score 
                                                            </Text>
                                                            <Text className="disable-select" fontSize="125%"> 
                                                                <Icon as={GrScorecard} /> {quiz.medianScore !== null ? `${quiz.medianScore}%` : 'No'} Median Score 
                                                            </Text>
                                                        </VStack>
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        <HStack justifyContent='center' spacing='15%' pt='1%' pb='1%'>
                                            <Button backgroundColor='green.500' color='white' onClick={() => history.push('/prequizpage/' + quiz._id)} _focus={{ outline: 'none' }} _hover={{ backgroundColor: 'green.600' }} _active={{backgroundColor: 'green.700'}}>Go To Quiz</Button>
                                            <Button colorScheme='blue' onClick={() => history.push('/editQuiz/' + quiz._id)} _focus={{ outline: 'none' }}>Edit Quiz</Button>
                                            <Button colorScheme='red' onClick={() => handleDeleteQuiz(quiz._id)} _focus={{ outline: 'none' }}>Delete Quiz</Button>
                                        </HStack>
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

const DELETE_QUIZ = gql`
    mutation ($quizId: ID!) {
        deleteQuiz(quizId: $quizId) {
            _id
        }
    }
`;
