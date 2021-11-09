import { React, useContext, useState } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Text, Image, VStack, Flex, Spinner, Center, Heading, Grid } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORMS, GET_USERS } from "../cache/queries";
import { useHistory, Link } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import QuizCard from '../components/QuizCard';
import '../styles/styles.css'
import PlatformCard from '../components/PlatformCard';
import UserCard from '../components/UserCard';

export default function Homepage() {
    let icon_src = quizImage
    const { user } = useContext(AuthContext);
    
    const [currentSection, setCurrentSection] = useState("FEATURED")
    const sections = ["FEATURED", "SUBSCRIPTIONS", "FAVORITED", "NEW", "BEST"]

    // Fetch quiz/platform data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platforms = useQuery(GET_PLATFORMS, { fetchPolicy: 'cache-and-network' })
    const users = useQuery(GET_USERS, { fetchPolicy: 'cache-and-network' })

    const loading = quizzes.loading || platforms.loading || users.loading
    const error = quizzes.error || platforms.error || users.error

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

    const quiz_data = quizzes.data.getQuizzes
    const platform_data = platforms.data.getPlatforms
    const user_data = users.data.getUsers

    return (
        <Box>
            {/* HEADER */}
            <Center>
                <Grid w="90%" minW="800px" mt="1%" templateColumns="1fr 1fr 1fr 1fr 1fr"> 
                    {sections.map((section, key) => {
                        return (
                            <Box key={key}>
                                <Text 
                                    className="disable-select"
                                    fontSize="125%" 
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

            {/* QUIZZES */}
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="150%" ml="1%" fontWeight="medium"> Featured Quizzes </Text>
                {/* <Box w="13%" bgColor="gray.300" h="0.2vh"></Box> */}
                <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                    {quiz_data.map((quiz, key) => {
                        return <QuizCard 
                            quiz={quiz} 
                            width="7.7%" 
                            title_fontsize="100%" 
                            author_fontsize="90%" 
                            include_author={true}
                            char_limit={30} 
                            key={key}
                        />
                    })}
                </Flex>
            </Box>
            <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center>


            {/* USERS */}
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="150%" ml="1%" fontWeight="medium"> Featured Users </Text>
                {/* <Box w="13%" bgColor="gray.300" h="0.2vh"></Box> */}
                <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                    {user_data.map((user, key) => {
                        return <UserCard 
                            user={user} 
                            width="7.7%" 
                            title_fontsize="100%" 
                            author_fontsize="90%" 
                            include_author={true}
                            char_limit={30} 
                            key={key}
                        />
                    })}
                </Flex>
            </Box>
            
            <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center>
            {/* PLATFORMS */}
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="150%" ml="1%" fontWeight="medium"> Featured Platforms </Text>
                {/* <Box w="13%" bgColor="gray.300" h="0.2vh"></Box> */}
                <Flex mt="0.5%" ml="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                    {platform_data.map((platform, key) => {
                        return <PlatformCard 
                            platform={platform}
                            width="14%"
                            minWidth="200px"
                            img_height="75px"
                            char_limit={44} 
                            key={key}
                        />
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
