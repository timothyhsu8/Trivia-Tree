import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { GET_QUIZZES } from "../cache/queries";
import QuizCard from "../components/QuizCard";
import { useState } from 'react';
import '../styles/styles.css'

export default function PlatformPage() {

    const [following, setFollowing] = useState(false)
    const [page, setPage] = useState('platform')

    const quiz_sections = ["Best Quizzes", "Most Played Quizzes", "Geography"]
    let icon_src = "https://pbs.twimg.com/profile_images/1444935701926191109/ozzShYNH_400x400.jpg"
    let banner_src = "https://cdnb.artstation.com/p/assets/images/images/033/698/651/4k/kan-liu-666k-xiaoluxiangsmall.jpg?1610351893"

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

    return (
        <Box>
            <Grid templateColumns="1fr 20fr 1fr">
                <Box/>
                <Box>
                     {/* HEADER BUTTONS */}
                     <Grid w="100%" h="6vh" templateColumns="1fr 1fr 1fr 1fr"> 
                        <Button height="100%" fontSize="1.0vw" bgColor="white" textColor={ page === 'platform' ? "blue" : "black" } _focus={{boxShadow:"none"}}> Platform Name</Button>
                        <Button height="100%" fontSize="1.0vw" bgColor="white" _focus={{boxShadow:"none"}}> Quizzes </Button>
                        <Button height="100%" fontSize="1.0vw" bgColor="white" _focus={{boxShadow:"none"}}> Leaderboard </Button>
                        <Button height="100%" fontSize="1.0vw" bgColor="white" _focus={{boxShadow:"none"}}> Badges </Button>
                    </Grid>

                    {/* BANNER */}
                    <Box
                        h="27vh"
                        pos="relative"
                        bgImage={"url('" + banner_src +  "')"} 
                        bgSize="cover" 
                        bgPosition="center"
                        borderRadius="10"
                    >
                        {/* PLATFORM ICON / NAME / FOLLOWERS */}
                        <VStack pos="relative" right="41%" top="45%" spacing="-1">
                            <Box className='squareimage_container' w="11%"> 
                                <Image className="squareimage" src={icon_src} alt="Profile Picture" objectFit="cover" border="3px solid white" borderRadius="50%"></Image>
                            </Box>
                            <Text fontSize="1.4vw" fontWeight="medium">Platform Name</Text>
                            <Text fontSize="1vw"> 1200 Followers </Text>
                        </VStack>
                    </Box>

                    {/* FOLLOW BUTTON */}
                    {
                        following ?
                            <Button 
                                w="7%" 
                                h="5vh" 
                                mt="1%" 
                                bgColor="red.600" 
                                fontSize="0.9vw" 
                                color="white" 
                                float="right"
                                onClick={() => setFollowing(false)}
                                _hover={{opacity:"85%"}} 
                                _active={{opacity:"75%"}} 
                                _focus={{boxShadow:"none"}}
                            > 
                                Unfollow 
                            </Button>
                            :
                            <Button 
                                w="6%" 
                                h="5vh" 
                                mt="1%" 
                                bgColor="gray.800" 
                                fontSize="0.9vw" 
                                color="white" 
                                float="right"
                                onClick={() => setFollowing(true)}
                                _hover={{opacity:"85%"}} 
                                _active={{opacity:"75%"}} 
                                _focus={{boxShadow:"none"}}
                            > 
                                Follow 
                            </Button>
                    }
                    <Box pos="relative" top="11%" bgColor="gray.300" h="0.2vh" />

                    {/* QUIZZES */}
                    <Box mt="7%">
                        {quiz_sections.map((section, key) => {
                            return (
                                <Box w="100%" borderRadius="10" overflowX="auto">
                                    <Text pl="1.5%" pt="1%" fontSize="1.2vw" fontWeight="medium"> {section} </Text>
                                    {/* FEATURED QUIZZES */}
                                    <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                        {quiz_data.map((quiz, key) => {
                                            return <QuizCard 
                                                quiz={quiz} 
                                                width="9%" 
                                                title_fontsize="0.8vw" 
                                                include_author={false}
                                                char_limit={35}  
                                                key={key}
                                                />
                                        })}
                                    </Flex>
                                    <Box bgColor="gray.300" h="0.2vh" />
                                </Box>
                        )})}
                    </Box>
                </Box>
            </Grid>
        </Box>
    )
}