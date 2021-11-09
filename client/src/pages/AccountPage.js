import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { GET_QUIZZES, GET_USER } from "../cache/queries";
import { Link, Redirect, useParams } from 'react-router-dom';
import QuizCard from "../components/QuizCard";
import { AuthContext } from '../context/auth';
import { useState, useContext } from 'react';
import '../styles/styles.css'

export default function AccountPage() {
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState('user')
    let { userId } = useParams();
    let accountUser = null;

    let logged_in = false
    let username = null;
    let user_title = "Gamer / Quiz Taker"
    let pfp_src = null;
    let banner_src = "https://cdnb.artstation.com/p/assets/images/images/027/468/579/4k/kan-liu-666k-chilling-time.jpg?1591633242"
    let quiz_sections = ["Featured Quizzes", "Featured Platforms"]
    let bio = null;
    
    // Checks if user is logged in
    if (user !== null && user !== "NoUser"){
        logged_in = true
        //username = user.googleDisplayName
        // pfp_src = user.iconImage
    }

    // Fetch quiz data from the backend
    const {
        loading,
        error,
        data: { getQuizzes: quiz_data } = {},
    } = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' });


    const {data:data2, error:error2, loading:loading2} = useQuery(GET_USER, {
        variables: { _id: userId },
    });

    // Loading Screen
    if (loading) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    if (loading2) {
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

    if(data2) { 
        accountUser = data2.getUser;
        username = accountUser.displayName;
        pfp_src = accountUser.iconImage; 
        bio = accountUser.bio;
    }

    // FOR TESTING: Many Quizzes
    let quiz_test = []
    let quiz_copy = quiz_data[0]
    for (let i = 0; i < 20; i++)
        quiz_test.push(quiz_copy)

    function renderPage() {
        if (page === 'user') 
            return renderUser()
        if (page === 'platforms') 
            return renderPlatforms()
        if (page === 'quizzes') 
            return renderQuizzes()
        if (page === 'badges') 
            return renderBadges()
    }

    // Render User
    function renderUser() {
        return(
                <Box minW="500px">  
                    {/* BANNER */}
                    <Box
                        h="28vh"
                        minH="200px"
                        pos="relative"
                        bgImage={"linear-gradient(to bottom, rgba(245, 246, 252, 0.30), rgba(255, 255, 255, 0.90)), url('" + banner_src +  "')"} 
                        bgSize="cover" 
                        bgPosition="center"
                        borderRadius="10"
                    >       
                        {/* PROFILE PICTURE AND NAME */}
                        <Box top="50%" left="2%" transform="translateY(-50%)" position="relative"> 
                            <Box className='squareimage_container' w="12%" minW="100px"> 
                                <Image className="squareimage" src={pfp_src} alt="Profile Picture" objectFit="cover" borderRadius="50%"></Image>
                            </Box>
                        
                            <Text pos="absolute" bottom="30%" left="14%" fontSize="300%" as="b" >{username}</Text>
                            <Text pos="absolute" bottom="8%" left="14.2%" fontSize="190%" fontWeight="thin"> {user_title} </Text>
                        </Box>
                    </Box>

                    {/* FEATURED QUIZZES/PLATFORMS AND BIOGRAPHY */}
                    <Grid pt="1%" templateColumns="4fr 1fr">

                        {/* FEATURED QUIZZES/PLATFORMS */}
                        <Box w="98.5%" borderRadius="10">
                            <VStack spacing="1.5vh">
                                {quiz_sections.map((name, index) => {
                                    return(
                                        <Box key={index} w="100%" bgColor="gray.200" borderRadius="10" overflowX="auto">
                                            <Text pl="1.5%" pt="1%" fontSize="130%" fontWeight="medium">{name}</Text>

                                            {/* QUIZZES */}
                                            <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                                {quiz_data.map((quiz, key) => {
                                                    return <QuizCard 
                                                        quiz={quiz} 
                                                        width="11%" 
                                                        title_fontsize="90%" 
                                                        include_author={false}
                                                        char_limit={35}  
                                                        key={key}
                                                        />
                                                })}
                                            </Flex>
                                        </Box>
                                    )
                                })}
                            </VStack>
                        </Box>

                        {/* BIOGRAPHY */}
                        <Box minWidth="100px" bgColor="gray.200" borderRadius="10" overflow="hidden">
                            <Text pl="4%" pt="2%" fontSize="130%" fontWeight="medium"> Biography </Text>
                            <Text pl="4%" pr="4%" pt="3%" fontSize="100%"> {bio} </Text>
                        </Box>
                    </Grid>
                </Box>
            )
    }

    // Render Platforms
    function renderPlatforms(){
        return (
            <Box bgColor="gray.200" borderRadius="10">
                <Text pl="1.5%" pt="1%" fontSize="1.2vw" fontWeight="bold">All Platforms</Text>
                <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap">
                    {quiz_test.map((quiz, key) => {
                        return <QuizCard 
                            quiz={quiz} 
                            width="10%" 
                            title_fontsize="0.8vw" 
                            include_author={false}
                            char_limit={35}  
                            key={key}
                            />
                    })}
                </Flex>
            </Box>
        )
    }

    // Render Quizzes
    function renderQuizzes(){
        return (
            <Box bgColor="gray.200" borderRadius="10">
                <Text pl="1.5%" pt="1%" fontSize="1.2vw" fontWeight="bold">All Quizzes</Text>
                <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap">
                    {quiz_test.map((quiz, key) => {
                        return <QuizCard 
                            quiz={quiz} 
                            width="10%" 
                            title_fontsize="0.8vw" 
                            include_author={false}
                            char_limit={35}  
                            key={key}
                            />
                    })}
                </Flex>
            </Box>
        )
    }

    // Render Badges
    function renderBadges(){
        return (
            <Box bgColor="gray.200" borderRadius="10">
                <Text pl="1.5%" pt="1%" fontSize="1.2vw" fontWeight="bold">All Badges</Text>
                <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap">
                    {quiz_test.map((quiz, key) => {
                        return <QuizCard 
                            quiz={quiz} 
                            width="10%" 
                            title_fontsize="0.8vw" 
                            include_author={false}
                            char_limit={35}  
                            key={key}
                            />
                    })}
                </Flex>
            </Box>
        )
    }

    if (!user) {
        return null;
    }


    return (
        <Box data-testid="main-component">
            <Grid templateColumns="1fr 6fr 1fr">
                <Box w="100%"></Box>
                
                {/* MAIN CONTENT */}
                <Box w="100%">
                    {/* HEADER BUTTONS */}
                    <Grid w="100%" h="6vh" minH="50px" templateColumns="1fr 1fr 1fr 1fr"> 
                        <Button height="100%" fontSize="115%" bgColor="white" textColor={ page === 'user' ? "blue" : "black" } onClick={() => setPage('user')} _focus={{boxShadow:"none"}}> {username} </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" textColor={ page === 'platforms' ? "blue" : "black" } onClick={() => setPage('platforms')} _focus={{boxShadow:"none"}}> Platforms </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" textColor={ page === 'quizzes' ? "blue" : "black" } onClick={() => setPage('quizzes')} _focus={{boxShadow:"none"}}> Quizzes </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" textColor={ page === 'badges' ? "blue" : "black" } onClick={() => setPage('badges')} _focus={{boxShadow:"none"}}> Badges </Button>
                    </Grid>
                    {renderPage()}
                </Box>
            </Grid>
            {/* {renderPage()} */}
        </Box>
    )
}