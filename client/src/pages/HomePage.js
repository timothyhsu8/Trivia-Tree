import { React, useContext, useState } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Text, Image, VStack, Flex, Spinner, Center, Heading, Grid } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GET_QUIZZES } from "../cache/queries";
import { useHistory, Link } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import QuizCard from '../components/QuizCard';
import '../styles/styles.css'

export default function Homepage() {
    let icon_src = quizImage
    const { user } = useContext(AuthContext);
    
    const [currentSection, setCurrentSection] = useState("FEATURED")
    const sections = ["FEATURED", "SUBSCRIPTIONS", "FAVORITED", "NEW", "BEST"]

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
            {/* HEADER */}
            <Center>
                <Grid w="90%" mt="1%" templateColumns="1fr 1fr 1fr 1fr 1fr"> 
                    {sections.map((section) => {
                        return (
                            <Box>
                                <Text 
                                    className="disable-select"
                                    fontSize="1.1vw" 
                                    textColor={section === currentSection ? "gray.900" : "gray.400" }
                                    textAlign="center"
                                    _hover={{ cursor:"pointer", textColor:"gray.600", transition:"0.15s linear" }}
                                    transition="0.1s linear"
                                    onClick={() => setCurrentSection(section)}
                                >
                                    {section}
                                </Text>
                                <Box h="0.2vh" mt="3%" bgColor={section === currentSection ? "blue.500" : "gray.400" }  transition="0.15s linear"/>
                            </Box>
                        )
                    })}
                </Grid>
            </Center>

            {/* CONTENT */}
            <Box mt="1%" ml="2%" mr="2%">
                {/* <Text fontSize="2.0vw" fontWeight="medium"> All Quizzes </Text> */}
                {/* <Box w="13%" bgColor="gray.300" h="0.2vh"></Box> */}
                <Flex mt="1%" spacing="3%" display="flex" flexWrap="wrap" >
                    {quiz_data.map((quiz, key) => {
                        return <QuizCard 
                            quiz={quiz} 
                            width="9%" 
                            title_fontsize="1.0vw" 
                            author_fontsize="0.85vw" 
                            include_author={true}
                            char_limit={30} 
                            key={key}/>
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
                    <Link style={{ fontSize: '25px' }} to='/platformpage'>
                        Platform Page
                    </Link>
                </VStack>
            </div>
        </Box>
    );
}
