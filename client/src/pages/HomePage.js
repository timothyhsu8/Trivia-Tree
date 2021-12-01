import { React, useContext, useState, useEffect } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Text, VStack, Flex, Spinner, Center, Heading, Grid, useColorMode } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORMS, GET_USERS, GET_USER, GET_USER_RECOMMENDATIONS} from "../cache/queries";
import { Link } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import QuizCard from '../components/QuizCard';
import '../styles/styles.css'
import PlatformCard from '../components/PlatformCard';
import UserCard from '../components/UserCard';

import * as mutations from '../cache/mutations';

export default function Homepage() {
          
    let icon_src = quizImage
    let recommendation_list = [];
    const { user } = useContext(AuthContext);

    console.log(user)
    
    const [currentSection, setCurrentSection] = useState("FEATURED")
    const sections = ["FEATURED", "RECOMMENDATIONS", "FAVORITED", "NEW", "BEST"]

    // Fetch quiz/platform data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platforms = useQuery(GET_PLATFORMS, { fetchPolicy: 'cache-and-network' })
    const users = useQuery(GET_USERS, { fetchPolicy: 'cache-and-network' })

    const loading = quizzes.loading || platforms.loading || users.loading
    const error = quizzes.error || platforms.error || users.error

    //I am sorry for this but to recognize dark mode on login from any account. Needs to check user info. 
    let userId = null;
    if (user !== null && user !== "NoUser"){
        userId = user._id
    }
    const {
        data: { getUser: userData } = {},
    } = useQuery(GET_USER, {
        fetchPolicy: 'cache-and-network',
        variables: { _id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
        onCompleted({ getUser: userData }) {
            setDarkMode(userData.darkMode);
        },
    });
    const {
        data: { getUserRecommendations: userRecommendations } = {},
    } = useQuery(GET_USER_RECOMMENDATIONS, {
        variables: {user_id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    });
    const [darkMode, setDarkMode] = useState("");
    //console.log(darkMode)
    const { colorMode, toggleColorMode } = useColorMode()
    //console.log(colorMode)
    function initialDark(){
        //If dark when light, make dark
        if(darkMode==true && colorMode=="light"){
            toggleColorMode()
            setDarkMode(false)
            saveChanges()
        }
    }
    const { refreshUserData } = useContext(AuthContext);
    const [updateSettings] = useMutation(mutations.UPDATE_SETTINGS, {
        onCompleted() {
            refreshUserData();
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });
    //I dunno if this is bad...
    useEffect(() => {
        initialDark()
    }, [darkMode])
    async function saveChanges() {
        const {data} = await updateSettings({ variables: {settingInput:{ darkMode:darkMode}}});
        return;
    }
    //Changes for dark mode end here

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


    recommendation_list = userRecommendations;

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
            {currentSection == "RECOMMENDATIONS" ? 
            <Box mt="1%" ml="2%" mr="2%">
            <Text fontSize="150%" ml="1%" fontWeight="medium"> Recommended Quizzes </Text>
            <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                {recommendation_list.map((quiz, key) => {
                    return <QuizCard 
                        quiz={quiz} 
                        width="7.3%" 
                        title_fontsize="95%" 
                        author_fontsize="85%" 
                        include_author={true}
                        char_limit={30} 
                        key={key}
                    />
                })}
            </Flex>
            </Box>
            :
            <Box mt="1%" ml="2%" mr="2%">
            <Text fontSize="150%" ml="1%" fontWeight="medium"> Featured Quizzes </Text>
            <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                {quiz_data.map((quiz, key) => {
                    return <QuizCard 
                        quiz={quiz} 
                        width="7.3%" 
                        title_fontsize="95%" 
                        author_fontsize="85%" 
                        include_author={true}
                        char_limit={30} 
                        key={key}
                    />
                })}
            </Flex>
            </Box>
            }

            <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center>


            {/* USERS */}
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="150%" ml="1%" fontWeight="medium"> Featured Users </Text>
                <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                    {user_data.map((user, key) => {
                        return <UserCard 
                            user={user} 
                            width="7.5%" 
                            title_fontsize="95%" 
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
                <Grid mt="0.5%" ml="0.5%" mr="0.5%" templateColumns="repeat(auto-fill, minmax(325px, 1fr))">
                    {platform_data.map((platform, key) => {
                        return <PlatformCard 
                            platform={platform}
                            margin="5%"
                            img_height="75px"
                            char_limit={44} 
                            key={key}
                        />
                    })}
                </Grid>
            </Box>
            <Box h="15vh" />
        </Box>
    );
}
