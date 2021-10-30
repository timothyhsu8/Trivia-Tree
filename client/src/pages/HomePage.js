import { React, useContext } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Text, Image, VStack, Flex, Spinner, Center, Heading } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GET_QUIZZES } from "../cache/queries";
import { useHistory, Link } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import '../styles/styles.css'

export default function Homepage() {
    let history = useHistory();
    let icon_src = quizImage
    const { user } = useContext(AuthContext);

    // Fetch quiz data from the backend
    const {
        loading,
        error,
        data: { getQuizzes: quiz_data } = {},
    } = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' });

    // Loading Screen
    if (loading) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    // Error Screen
    if (error) {
        return (
            <Center>
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <Box>
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="2.3vw" fontWeight="medium"> All Quizzes </Text>
                <Box w="13%" bgColor="gray.300" h="0.2vh"></Box>
                <Flex mt="1%" spacing="3%" display="flex" flexWrap="wrap" >
                    {quiz_data.map((quiz) => {
                        return (
                            <VStack 
                                w="9%" 
                                padding="0.5%" 
                                margin="0.5%" 
                                spacing="2%" 
                                borderRadius="4%" 
                                _hover={{bgColor:"blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
                                transition="background-color 0.1s linear"
                                onClick={() => history.push('/prequizpage/' + quiz._id)}
                            >
                                <Box className='squareimage_container' w="100%"> 
                                    <Image className="squareimage" src={icon_src} alt="Quiz Icon" objectFit="cover" borderRadius="20%"></Image>
                                </Box>
                                <Text className="disable-select" fontSize="1.5vw" textAlign="center" fontWeight="medium">
                                    {quiz.title}
                                </Text>
                                <Text className="disable-select" fontSize="1.2vw" textAlign="center" textColor="purple.500">
                                    Quiz Author
                                </Text>
                            </VStack>
                        )
                    })}
                </Flex>
            </Box>
            
            <Center marginTop='70vh'>
                {user !== 'NoUser' ? (
                    <div>
                        <Heading marginBottom='20px'>
                            {'Hello, ' + user.displayName}
                        </Heading>
                        <Center>
                            <img
                                style={{ ce: 'center' }}
                                src={user.iconImage}
                            />
                        </Center>
                        <Center>
                            <Heading marginTop='20px'>
                                <a href={`${config.API_URL}/auth/logout`}>
                                    Logout
                                </a>
                            </Heading>
                        </Center>
                    </div>
                ) : (
                    <Heading>
                        <a href={`${config.API_URL}/auth/google`}>
                            Login with Google
                        </a>
                    </Heading>
                )}
            </Center>
            <div>
                <VStack marginTop='50px'>
                    <Link style={{ fontSize: '25px' }} to='/quizzes'>
                        Quizzes with CRUD
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/loginpage'>
                        Login Page
                    </Link>
                </VStack>
            </div>
        </Box>
    );
}
