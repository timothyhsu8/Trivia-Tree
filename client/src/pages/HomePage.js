import { React, useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import { Box, Text, Flex, Spinner, Center, Grid, useColorMode, Image, Icon, Avatar, HStack, VStack, Stack } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORMS, GET_USERS, GET_USER, GET_USER_RECOMMENDATIONS} from "../cache/queries";
import QuizCard from '../components/QuizCard';
import PlatformCard from '../components/PlatformCard';
import UserCard from '../components/UserCard';
import { StarIcon, ViewIcon } from '@chakra-ui/icons'
import { BsFillBookmarkHeartFill, BsFillBookmarkStarFill, BsFillHeartFill, BsFillLightningFill, BsFillReplyFill, BsFillTrophyFill, BsPersonCircle } from 'react-icons/bs';
import * as mutations from '../cache/mutations';
import '../styles/styles.css'

export default function Homepage() {

    const { user } = useContext(AuthContext);
    let recommendation_list = [];
    
    const [currentSection, setCurrentSection] = useState("FEATURED")
    const header_sections = [
        {
            pageName: "FEATURED",
            icon: BsFillBookmarkHeartFill
        },
        {
            pageName: "RECOMMENDATIONS",
            icon: BsFillReplyFill
        },
        {
            pageName: "FAVORITED",
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

    // Fetch quiz/platform data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platforms = useQuery(GET_PLATFORMS, { fetchPolicy: 'cache-and-network' })
    const users = useQuery(GET_USERS, { fetchPolicy: 'cache-and-network' })

    const doneLoading = !quizzes.loading && !platforms.loading && !users.loading
    const error = quizzes.error || platforms.error || users.error

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
    const featured_quizzes = quiz_data.filter((quiz) => {
        return quiz.isFeatured === true
    })

    recommendation_list = userRecommendations;

    return (
        <Box>
            {/* HEADER */}
            <Center>
                <Grid w="90%" minW="800px" mt="1%" templateColumns="1fr 1fr 1fr 1fr 1fr"> 
                    {header_sections.map((section, key) => {
                        return (
                            <Box key={key}>
                                <Text 
                                    className="disable-select"
                                    fontSize="125%" 
                                    textColor={section.pageName === currentSection ? "gray.900" : "gray.400" }
                                    textAlign="center"
                                    _hover={{ cursor:"pointer", textColor:"gray.600", transition:"0.15s linear" }}
                                    transition="0.1s linear"
                                    onClick={() => setCurrentSection(section.pageName)}
                                >
                                    <Icon as={section.icon} pos="relative" top={-0.5}  mr={2} />
                                    {section.pageName}
                                </Text>
                                <Box h="0.2vh" mt="3%" bgColor={section.pageName === currentSection ? "blue.500" : "gray.400" }  transition="0.15s linear"/>
                            </Box>
                        )
                    })}
                </Grid>
            </Center>
            
            {/* <Image w="100%" h="20vh" pt={6} fit="cover" src="https://cdna.artstation.com/p/assets/images/images/039/410/842/4k/kan-liu-666k-huoniao.jpg?1625819697" /> */}

            { renderSection() }
            <Box h="15vh" />
        </Box>
    );

    function renderSection() {
        if (currentSection === "FEATURED") return renderFeaturedSection()
        if (currentSection === "RECOMMENDATIONS") return renderFeaturedSection()
        if (currentSection === "FAVORITED") return renderFeaturedSection()
        if (currentSection === "NEW") return renderNewSection()
        if (currentSection === "BEST") return renderBestSection()
    }
    
    function renderFeaturedSection() {
        return (
            <Box>
                {/* QUIZZES */}
                {currentSection === "RECOMMENDATIONS" ? 
                    <Box mt="1%" ml="2%" mr="2%">
                    <Text fontSize="150%" ml="1%" fontWeight="medium"> Recommended Quizzes </Text>
                    {
                        userId !== null ?
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
                        : 
                        <Center>
                            <Text fontSize="150%" mt={21} mb={20}> You must be logged in to view recommendations </Text>
                        </Center>
                    }
                    </Box>
                    :
                    <Box mt="1%" ml="2%" mr="2%">
                    <Text fontSize="150%" ml="1%" fontWeight="medium"> Featured Quizzes </Text>
                    <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                        {featured_quizzes.map((quiz, key) => {
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

                {/* Testing out big featured cards */}
                {/* <Box w="30%" bgColor="white" borderRadius={10} border="1px" borderColor="gray.200" boxShadow="md" padding={5}
                        _hover={{bgColor:"gray.100", transition:".15s linear", cursor:"pointer"}}
                        transition=".15s linear"    
                    >
                        <HStack>
                            <Avatar src={featured_quizzes[0].icon} size="2xl" borderRadius={10} />
                            <Grid templateColumns="2fr 1fr">
                                <Stack spacing={1}>
                                    <Text fontSize="130%" fontWeight="medium" whiteSpace="nowrap"> {featured_quizzes[0].title} </Text>
                                    <HStack>
                                        <Avatar src={featured_quizzes[0].user.iconImage} size="sm"/>
                                        <Text whiteSpace="nowrap"> {featured_quizzes[0].user.displayName} </Text>
                                    </HStack>
                                    <Text> {featured_quizzes[0].description}</Text>
                                </Stack>

                                <Stack>
                                    <Text>
                                        <Icon as={ViewIcon} color="blue.400" pos="relative" top="-1px" mr="5px"/> 
                                        {featured_quizzes[0].numAttempts} Attempts 
                                    </Text>
                                    <Text>
                                        <Icon as={BsFillHeartFill} color="red.400" pos="relative" top="-1px" mr="5px"/> 
                                        {featured_quizzes[0].numFavorites} Favorites
                                    </Text>
                                    <Text>
                                        <Icon as={StarIcon} color="yellow.400" pos="relative" top="-1px" mr="5px"/> 
                                        {featured_quizzes[0].rating} Stars
                                    </Text>
                                </Stack>
                            </Grid>
                        </HStack>
                    </Box> */}
                
                {/* <Center> <Box w="95%" h="1px" bgColor="gray.300" /> </Center> */}


                {/* USERS */}
                {/* <Box mt="1%" ml="2%" mr="2%">
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
                </Box> */}
                
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
            </Box>
        )
    }

    function renderNewSection() {
        return (
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="150%" ml="1%" fontWeight="medium"> New Quizzes </Text>
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
        )
    }

    function renderBestSection() {
        let quizData = [...quiz_data]
        const popular_quizzes = quizData.sort((a, b) => {
            return a.numAttempts < b.numAttempts ? 1 : -1
        })

        return (
            <Box mt="1%" ml="2%" mr="2%">
                <Text fontSize="150%" ml="1%" fontWeight="medium"> Top Quizzes of All Time </Text>
                <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                    {popular_quizzes.map((quiz, key) => {
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
