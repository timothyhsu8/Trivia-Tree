import {
    Box,
    Text,
    Grid,
    Avatar,
    VStack,
    Button,
    Image,
    Center,
    Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    HStack,
    Icon,
    IconButton
} from '@chakra-ui/react';
import { GET_USER } from '../cache/queries';
import { useQuery, useMutation, gql } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { useState, useContext, createRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BsArrowUp, BsFillArrowUpCircleFill, BsFillCaretRightFill, BsFillFileEarmarkTextFill, BsFillHeartFill, BsFillPersonFill, BsFillTrashFill, BsHeart, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { ViewIcon, StarIcon, ArrowBackIcon } from '@chakra-ui/icons';
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

    function renderDeleteButton(quiz) {
        return (
            <Popover placement="top-start">
                <PopoverTrigger>
                    <IconButton icon={<BsFillTrashFill/>} colorScheme='red' _focus={{ outline: 'none' }} />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverCloseButton />
                    <PopoverBody>
                        Delete this quiz permanently?
                    </PopoverBody>
                    <PopoverFooter>
                        <Center>
                            <Button colorScheme="red" onClick={() => handleDeleteQuiz(quiz._id)}> Yes, Delete It </Button>
                        </Center>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        )
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

    
    return (
        <Box >
            <Center> 
                <Text mt="1%" fontSize="250%" fontWeight="medium" color="gray.700"> Your Quizzes </Text>
            </Center>
            
            <Button 
                leftIcon={<BsFillFileEarmarkTextFill/>}
                pos='absolute' 
                top='85px' 
                right='55px' 
                backgroundColor='cyan.500' color='white'
                onClick={() => history.push('/createQuiz')} 
                _focus={{ outline: 'none' }} 
                _hover={{ backgroundColor: 'cyan.600' }} 
                _active={{backgroundColor: 'cyan.700'}}
                size="lg"
            >
                    Create Quiz
            </Button>

            {/* PLATFORM CARDS */}
            {
                userData.quizzesMade.length !== 0 ?
                    <Grid mt="0.5%" ml="5%" mr="5%" justifyItems='center' rowGap='3%' templateColumns="repeat(auto-fill, minmax(300px, 1fr))">
                        {
                            userData.quizzesMade.map((quiz, key) => {
                                return (
                                    <Box 
                                        key={key}
                                        w="90%" 
                                        padding={4}
                                        mt={5} 
                                        borderRadius={10} 
                                        boxShadow="md" 
                                        transition=".1s linear"
                                        border="1px"
                                        borderColor="gray.200"
                                    >
                                        <VStack>
                                            {/* Quiz Image */}
                                            <Center>
                                                <Avatar src={quiz.icon} size="xl" />
                                            </Center>

                                            {/* Quiz Name */}
                                            <Text fontWeight="medium" fontSize="120%" textColor="gray.800" wordBreak="break-word" textAlign="center"> {quiz.title} </Text>
                                            
                                            {/* Attempts */}
                                            <HStack spacing={4}>
                                                <HStack>
                                                    <Text>
                                                        <Icon as={ViewIcon} pos="relative" top="-1px" mr="5px"/> 
                                                        {quiz.numAttempts} Attempts 
                                                    </Text>
                                                </HStack>

                                                {/* Favorites */}
                                                <HStack>
                                                    <Text>
                                                        <Icon as={BsFillHeartFill} pos="relative" top="-1px" mr="5px" color="red.400" /> 
                                                        {quiz.numFavorites} Favorites 
                                                    </Text>
                                                </HStack>
                                            </HStack>

                                            {/* Rating */}
                                            <HStack>
                                                <Text>
                                                    <Icon as={StarIcon} pos="relative" top="-1.5px" mr="5px" color="yellow.400" /> 
                                                    {quiz.rating ? quiz.rating : 'N/A'} {quiz.rating ? `(${quiz.numRatings} Ratings)`: ''}
                                                </Text>
                                            </HStack>

                                            {/* Average Score */}
                                            <HStack>
                                                <Text className="disable-select"> 
                                                    <Icon as={GrScorecard} pos="relative" top="-1.5px" mr="5px"/>
                                                    {quiz.averageScore !== null ? `${quiz.averageScore}%` : 'No'} Average
                                                </Text>
                                            </HStack>
                                        
                                            {/* Median Score */}
                                            <HStack>
                                                <Text className="disable-select"> 
                                                    <Icon as={GrScorecard} pos="relative" top="-1.5px" mr="5px"/>
                                                    {quiz.medianScore !== null ? `${quiz.medianScore}%` : 'No'} Median
                                                </Text>
                                            </HStack>

                                            <HStack justifyContent='center' pt='1%' pb='1%'>
                                                <IconButton icon={<BsFillCaretRightFill/>} backgroundColor='green.500' color='white' onClick={() => history.push('/prequizpage/' + quiz._id)} _focus={{ outline: 'none' }} _hover={{ backgroundColor: 'green.600' }} _active={{backgroundColor: 'green.700'}} />
                                                <IconButton icon={<BsPencilSquare/>} colorScheme='blue' onClick={() => history.push('/editQuiz/' + quiz._id)} _focus={{ outline: 'none' }} />
                                                { renderDeleteButton(quiz) }
                                            </HStack>
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
            <Box h="20vh"/>
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
