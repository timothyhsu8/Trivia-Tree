import { React, useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import { Box, Text, Flex, Spinner, Center, Grid, useColorMode, Image, Icon, Avatar, HStack, VStack, Stack, useColorModeValue } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FEATURED_QUIZZES, GET_PLATFORMS, GET_USER, GET_USER_RECOMMENDATIONS, GET_QUIZ_OF_THE_DAY, GET_PLATFORM_OF_THE_DAY } from "../cache/queries";
import { useHistory } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import PlatformCard from '../components/PlatformCard';
import { StarIcon, ViewIcon } from '@chakra-ui/icons'
import { BsFillBookmarkHeartFill, BsFillFileEarmarkTextFill, BsFillHeartFill, BsFillHouseDoorFill, BsFillLightningFill, BsFillPersonFill, BsFillTrophyFill, BsLock, BsLockFill } from 'react-icons/bs';
import * as mutations from '../cache/mutations';
import '../styles/styles.css'
import NewQuizzes from '../components/HomePage/NewQuizzes';
import BestQuizzes from '../components/HomePage/BestQuizzes';

export default function Homepage() {
    let history = useHistory();
    const { user } = useContext(AuthContext);
    let recommendation_list = [];
    
    const [currentSection, setCurrentSection] = useState("FEATURED")
    const header_sections = [
        {
            pageName: "FEATURED",
            icon: BsFillBookmarkHeartFill
        },
        {
            pageName: "FOR YOU",
            icon: StarIcon
        },
        {
            pageName: "NEW",
            icon: BsFillLightningFill
        },
        {
            pageName: "BEST",
            icon: BsFillTrophyFill
        }
    ]
    const [initialLoad, setInitialLoad] = useState(false);

    // Dark mode styling
    const borderColor = useColorModeValue("gray.200", "gray.500")
    const bgColor = useColorModeValue("gray.100", "gray.700")
    const headerColor = useColorModeValue("gray.100", "gray.800")
    const hoverColor = useColorModeValue("gray.200", "gray.600")
    const selectedTextColor = useColorModeValue("gray.900", "white")
    const textColor = useColorModeValue("gray.600", "gray.100")

    // Fetch quiz/platform data from the backend
    const featuredQuizzes = useQuery(GET_FEATURED_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platforms = useQuery(GET_PLATFORMS, { fetchPolicy: 'cache-and-network' })
    const quizOfTheDay = useQuery(GET_QUIZ_OF_THE_DAY, { fetchPolicy: 'cache-and-network' })
    const platformOfTheDay = useQuery(GET_PLATFORM_OF_THE_DAY, { fetchPolicy: 'cache-and-network' })

    const doneLoading = !featuredQuizzes.loading && !platforms.loading && !quizOfTheDay.loading && !platformOfTheDay.loading
    const error = featuredQuizzes.error || platforms.error || quizOfTheDay.error || platformOfTheDay.error

    //I am sorry for this but to recognize dark mode on login from any account. Needs to check user info. 
    let userId = null;
    if (user !== null && user !== "NoUser"){
        userId = user._id
    }
    const {
        data: { getUser: userData } = {},
    } = useQuery(GET_USER,
        (!user || user === 'NoUser') ?
        {skip: true} : {
        fetchPolicy: 'cache-and-network',
        variables: { _id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
        onCompleted({ getUser: userData }) {
            setDarkMode(userData.darkMode);
        }
    });

    const {
        data: { getUserRecommendations: userRecommendations } = {},
    } = useQuery(GET_USER_RECOMMENDATIONS,
        (!user || user === 'NoUser') ?
        {skip: true} : {
        variables: {user_id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    });
    const [darkMode, setDarkMode] = useState("");
    const { colorMode, toggleColorMode } = useColorMode()

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
    if (!doneLoading && !initialLoad) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    } else {
        if (!initialLoad) {
            setInitialLoad(true);
        }
    }

    // Error Screen
    if (error) {
        console.log(error)
        return (
            <Center>
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    if (!user) {
        return null;
    }

    const platform_data = platforms.data.getPlatforms
    const featured_quizzes = featuredQuizzes.data.getFeaturedQuizzes.slice(0, 12)

    recommendation_list = userRecommendations;
    if (recommendation_list === undefined)
        recommendation_list = []

    else if (recommendation_list.length === 0)
        recommendation_list = featured_quizzes.slice(0, 4).reverse()
    
    // Get Data for Quiz of the Day
    let quizOfTheDay_data = null
    if (quizOfTheDay.data.getQuizOfTheDay !== null)
        quizOfTheDay_data = quizOfTheDay.data.getQuizOfTheDay
    
    else
        quizOfTheDay_data = recommendation_list[0]

    // Get Data for Platform of the Day
    let platformOfTheDay_data = null
    if (platformOfTheDay.data.getPlatformOfTheDay !== null)
        platformOfTheDay_data = platformOfTheDay.data.getPlatformOfTheDay
    
    else
        platformOfTheDay_data = recommendation_list[0]
        
    return (
        <Box>
            {/* HEADER */}
            <Center>
                <Grid w="100%" minW="800px" templateColumns="1fr 1fr 1fr 1fr" boxShadow="md" bgColor={headerColor}> 
                    {header_sections.map((section, key) => {
                        return (
                            <Box h="55px" key={key}>
                                <Box h="100%" display="flex" flexDirection="column" justifyContent="center">
                                    <Text 
                                        className="disable-select"
                                        fontSize="125%" 
                                        textColor={section.pageName === currentSection ? selectedTextColor : "gray.400" }
                                        textAlign="center"
                                        _hover={{ cursor:"pointer", textColor:"gray.600", transition:"0.15s linear" }}
                                        transition="0.1s linear"
                                        onClick={() => setCurrentSection(section.pageName)}
                                    >
                                        <Icon as={section.icon} pos="relative" top={-0.5}  mr={2} />
                                        {section.pageName}
                                    </Text>
                                </Box>
                                <Center>
                                    <Box h="3px" w='90%' bgColor={section.pageName === currentSection ? "blue.500" : "" }  transition="0.15s linear"/>
                                </Center>
                            </Box>
                        )
                    })}
                </Grid>
            </Center>
            
            {/* Quiz/Platform of the Day Section */}
            {
                currentSection === "FEATURED" ?
                    <Box w='100%' mt="5px" p={3} pb={7} display="flex" flexDirection="row" justifyContent="center" bgSize="cover" bgPos="center" boxShadow="lg"
                        bgImage={
                            "linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(100, 0, 0, .5)), url('" +
                            "https://res.cloudinary.com/dsry3cnco/image/upload/v1639197385/triva_tree_featured_afuxb3.png" +
                            "')"
                        }>
                        <HStack spacing={200}>
                        { quizOfTheDay_data !== undefined ? renderQuizOfTheDay() : null }
                        { platformOfTheDay_data !== undefined ? renderPlatformOfTheDay() : null }
                        </HStack>
                    </Box>
                : ""
            }

            { renderSection() }
            <Box mt={50} h="15vh"/>
        </Box>
    );

    function renderSection() {
        if (currentSection === "FEATURED") return renderFeaturedSection()
        if (currentSection === "FOR YOU") return renderFavoritedSection()
        if (currentSection === "NEW") return <NewQuizzes />
        if (currentSection === "BEST") return <BestQuizzes />
    }
    
    function renderFeaturedSection() {
        return (
            <Box>
                {/* Featured Quizzes */}
                <Box mt="1%" ml="2%" mr="2%">
                    <Text fontSize="140%" ml="1%" fontWeight="medium"> Featured Quizzes </Text>
                    <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                        {featured_quizzes.map((quiz, key) => {
                            if (quiz !== null && quiz !== undefined) {
                                return <QuizCard 
                                    quiz={quiz} 
                                    width="7.3%" 
                                    title_fontsize="95%" 
                                    author_fontsize="85%" 
                                    include_author={true}
                                    char_limit={30} 
                                    key={key}
                                />
                            }
                        })}
                    </Flex>
                </Box>
         
                <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center>

                {/* Recommended Quizzes */}
                <Box mt="1%" ml="2%" mr="2%">
                    <Text fontSize="140%" ml="1%" fontWeight="medium"> 
                        Recommended Quizzes 
                    </Text>
                    {
                        userId !== null ?
                        <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                            {recommendation_list.map((quiz, key) => {
                                if (quiz !== null && quiz !== undefined) {
                                    return <QuizCard 
                                        quiz={quiz} 
                                        width="7.3%" 
                                        title_fontsize="95%" 
                                        author_fontsize="85%" 
                                        include_author={true}
                                        char_limit={30} 
                                        key={key}
                                    />
                                }
                            })}
                        </Flex>
                        : 
                        <Center>
                            <Text fontSize="140%" mt={30} mb={10} textColor={textColor}> 
                                <Icon as={BsLockFill} pos="relative" mr={2} top="-4px" />
                                You must be logged in to view recommendations 
                            </Text>
                        </Center>
                    }
                    </Box>
                    
                    <Box mt="1%" ml="2%" mr="2%">
                </Box>
                <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center>
                
                {/* Featured Platforms */}
                <Box mt="1%" ml="2%" mr="2%">
                    <Text fontSize="140%" ml="1%" fontWeight="medium"> Featured Platforms </Text>
                    {/* <Box w="13%" bgColor="gray.300" h="0.2vh"></Box> */}
                    <Grid mt="0.5%" ml="0.5%" mr="0.5%" templateColumns="repeat(auto-fill, minmax(325px, 1fr))">
                        {platform_data.slice(0).reverse().map((platform, key) => {
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
            </Box>
        )
    }

    function renderFavoritedSection() {
        if (userId === null || userData === undefined) {
            return (
                <Center>
                    <Text fontSize="140%" mt={30} mb={10} textColor={textColor}> 
                        <Icon as={BsLockFill} pos="relative" mr={2} top="-4px" />
                        You must be logged in to view For You
                    </Text>
                </Center>
            )
        }

        const favoritedQuizzes = userData.favoritedQuizzes.slice(0).reverse()
        const first_three = favoritedQuizzes.slice(0, 3)

        return (
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="140%" ml="1%" mb={2} fontWeight="medium"> Favorited Quizzes </Text>
                {/* Gives first 3 quizzes a big card */}
                {
                    favoritedQuizzes.length !== 0 ? 
                    <Box>
                        <HStack pt={5} pb={5} spacing={4} borderRadius={5} justifyContent="center" boxShadow="lg" bgSize="cover" bgPos="center" bgImage={
                                    "linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(100, 0, 0, .5)), url('" +
                                    "https://res.cloudinary.com/dsry3cnco/image/upload/v1639197385/triva_tree_featured_afuxb3.png" +
                                    "')"
                                }>
                            {
                                first_three.map((quiz, key) => {
                                    return (
                                        renderLargeQuizCard(quiz)   
                                    )
                                })
                            }
                        </HStack>

                        <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                            {favoritedQuizzes.slice(3).map((quiz, key) => {
                                if (quiz !== null && quiz !== undefined) {
                                    return <QuizCard 
                                        quiz={quiz} 
                                        width="7.3%" 
                                        title_fontsize="95%" 
                                        author_fontsize="85%" 
                                        include_author={true}
                                        char_limit={30} 
                                        key={key}
                                    />
                                }
                            })}
                        </Flex>
                    </Box>
                    :
                    <Center>
                        <Text fontSize="140%" mt={45} mb={10} textColor={textColor}> 
                            You don't have any favorited quizzes!
                        </Text>
                    </Center>
                }


                <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center>

                {/* Recommended Quizzes */}
                <Box mt="1%" mr="2%">
                    <Text fontSize="140%" ml="1%" fontWeight="medium"> 
                        Recommended Quizzes 
                    </Text>
                    {
                        userId !== null ?
                        <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                            {recommendation_list.map((quiz, key) => {
                                if (quiz !== null && quiz !== undefined) {
                                    return <QuizCard 
                                        quiz={quiz} 
                                        width="7.3%" 
                                        title_fontsize="95%" 
                                        author_fontsize="85%" 
                                        include_author={true}
                                        char_limit={30} 
                                        key={key}
                                    />
                                }
                            })}
                        </Flex>
                        : 
                        <Center>
                            <Text fontSize="140%" mt={30} mb={10} textColor={textColor}> 
                                <Icon as={BsLockFill} pos="relative" mr={2} top="-4px" />
                                You must be logged in to view recommendations 
                            </Text>
                        </Center>
                    }
                    </Box>
                    
                    <Box mt="1%" ml="2%" mr="2%">
                </Box>
            </Box>
        )
    }

    function renderQuizOfTheDay() {
        const quiz = quizOfTheDay_data
        return (
            <Box w={500} minW={300}>
                <Center> 
                    <Box mb={2} padding={2} pl={4} pr={4} borderRadius="40px" bgColor="white" boxShadow="base">
                        <Text fontWeight="medium" fontSize="100%" textColor="blue.500">
                            <Icon as={BsFillFileEarmarkTextFill} pos="relative" top="-2.3px" mr="5px"/>
                            Quiz of the Day 
                        </Text>
                    </Box>
                </Center>
                <Box w='100%' bgColor="white" borderRadius={5} border="1px" bgColor={bgColor} borderColor={borderColor} boxShadow="md" padding={5}
                    _hover={{bgColor:hoverColor, transition:".15s linear", cursor:"pointer"}}
                    onClick={() => history.push('/prequizpage/' + quiz._id)}
                    transition=".15s linear"    
                >
                    <HStack>
                        <Avatar src={quiz.icon} size="2xl" borderRadius={10} />
                            <Stack spacing={1}>
                                <Text fontSize="130%" fontWeight="medium"> {quiz.title} </Text>
                                <HStack>
                                    <Avatar src={quiz.user.iconImage} size="sm"/>
                                    <Text whiteSpace="nowrap"> {quiz.user.displayName} </Text>
                                </HStack>
                            </Stack>
                    </HStack>
                    
                    {/* Description */}
                    <Text pt={2}> {quiz.description}</Text>
                    <Stack pt={2}>
                        <Text>
                            <Icon as={ViewIcon} color="blue.400" pos="relative" top="-1px" mr="5px"/> 
                            {quiz.numAttempts} Attempts 
                        </Text>
                        <Text>
                            <Icon as={BsFillHeartFill} color="red.400" pos="relative" top="-1px" mr="5px"/> 
                            {quiz.numFavorites} Favorites
                        </Text>
                        <Text>
                            <Icon as={StarIcon} color="yellow.400" pos="relative" top="-1px" mr="5px"/> 
                            {quiz.rating !== null ? quiz.rating : "N/A"} Stars
                        </Text>
                    </Stack>
                </Box>
            </Box>
        )
    }

    function renderPlatformOfTheDay() {
        const platform = platformOfTheDay_data
        return (
            <Box w={500} minW={300}>
                <Center> 
                    <Box mb={2} padding={2} pl={4} pr={4} borderRadius="40px" bgColor="white" boxShadow="base">
                        <Text fontWeight="medium" fontSize="100%" textColor="blue.500">
                            <Icon as={BsFillHouseDoorFill} pos="relative" top="-2.3px" mr="5px"/>
                            Platform of the Day 
                        </Text>
                    </Box>
                </Center>
                <Box w='100%' borderRadius={5} border="1px" bgColor={bgColor} borderColor={borderColor} boxShadow="md" padding={5}
                    _hover={{bgColor:hoverColor, transition:".15s linear", cursor:"pointer"}}
                    onClick={() => history.push('/platformpage/' + platform._id)}
                    transition=".15s linear"    
                >
                    <HStack>
                        <Avatar src={platform.iconImage} size="2xl" borderRadius={10} />
                            <Stack spacing={1}>
                                <Text fontSize="130%" fontWeight="medium"> {platform.name} </Text>
                                <HStack>
                                    <Avatar src={platform.user.iconImage} size="sm"/>
                                    <Text whiteSpace="nowrap"> {platform.user.displayName} </Text>
                                </HStack>
                            </Stack>
                    </HStack>
                    
                    {/* Description */}
                    <Text pt={2}> {platform.description}</Text>
                    <Stack pt={2}>
                        <Text>
                            <Icon as={BsFillFileEarmarkTextFill} color="red.400" pos="relative" top="-1px" mr="5px"/> 
                            { platform.quizzes.length } { platform.quizzes.length !== 1 ? "Quizzes" : "Quiz" }
                        </Text>
                        <Text>
                            <Icon as={BsFillPersonFill} color="blue.400" pos="relative" top="-1px" mr="5px"/> 
                            {platform.followers.length}
                            {platform.followers.length === 1 ? ' Follower' : ' Followers'}
                        </Text>
                    </Stack>
                </Box>
            </Box>
        )
    }

    // Larger quiz cards for the first 2 or 3 new quizzes (or best quizzes or whatever)
    function renderLargeQuizCard(quiz) {
        return (
            <Box w="30%" minW={400} bgColor={bgColor} borderRadius={10} border="1px" borderColor={borderColor} boxShadow="md" padding={5} overflow="hidden"
                _hover={{bgColor:hoverColor, transition:".15s linear", cursor:"pointer"}}
                transition=".15s linear"    
                onClick={() => history.push('/prequizpage/' + quiz._id)}
            >
                <HStack>
                    <Avatar src={quiz.icon} size="2xl" borderRadius={10} />
                    <Grid templateColumns="2fr 1fr">
                        <Stack spacing={1} p={1}>
                            <Text fontSize="130%" fontWeight="medium"> {quiz.title} </Text>
                            <HStack>
                                <Avatar src={quiz.user.iconImage} size="sm"/>
                                <Text whiteSpace="nowrap"> {quiz.user.displayName} </Text>
                            </HStack>
                            <Text> {quiz.description}</Text>
                        </Stack>

                        <Stack p={1}>
                            <Text>
                                <Icon as={ViewIcon} color="blue.400" pos="relative" top="-1px" mr="5px"/> 
                                {quiz.numAttempts} Attempts 
                            </Text>
                            <Text>
                                <Icon as={BsFillHeartFill} color="red.400" pos="relative" top="-1px" mr="5px"/> 
                                {quiz.numFavorites} Favorites
                            </Text>
                            <Text>
                                <Icon as={StarIcon} color="yellow.400" pos="relative" top="-1px" mr="5px"/> 
                                {quiz.rating} Stars
                            </Text>
                        </Stack>
                    </Grid>
                </HStack>
            </Box>
        )
    }
    // Sorts quizzes by popularity (# of total attempts)
    // function sortPopular(search_results) {
    //     return search_results.sort((a, b) => {
    //         let resultA = getPopularity(a)
    //         let resultB = getPopularity(b)
    //         return resultA < resultB ? 1 : -1
    //     })
    // }
}
