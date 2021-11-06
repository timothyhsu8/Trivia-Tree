import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORMS } from "../cache/queries";
import QuizCard from "../components/QuizCard";
import { useState } from 'react';
import '../styles/styles.css'

export default function PlatformPage() {

    const [following, setFollowing] = useState(false)
    const [page, setPage] = useState('platform')

    const quiz_sections = ["Best Quizzes", "Most Played Quizzes", "Geography"]
    let icon_src = "https://i.pinimg.com/originals/89/23/39/89233942fb503391dca979161884019c.jpg"
    let banner_src = "https://www.commonapp.org/static/0581e02788013cdfe4ba0076e17c37a8/suny-stony-brook-university_346.jpg"

    // Fetch quiz data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platforms = useQuery(GET_PLATFORMS, { fetchPolicy: 'cache-and-network' })

    const loading = quizzes.loading || platforms.loading
    const error = quizzes.error || platforms.error
    
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

    const quiz_data = quizzes.data.getQuizzes
    const platform_data = platforms.data.getPlatforms

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
                        <VStack pos="relative" right="41%" top="50%" spacing="-1">
                            <Box className='squareimage_container' w="11%"> 
                                <Image className="squareimage" src={icon_src} alt="Profile Picture" objectFit="cover" border="3px solid white" borderRadius="50%"></Image>
                            </Box>
                            <Text fontSize="1.4vw" fontWeight="medium"> {platform_data[0].name} </Text>
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
                                <Box w="100%" borderRadius="10" overflowX="auto" key={key}>
                                    <Text pl="1.5%" pt="1%" fontSize="1.2vw" fontWeight="medium"> {section} </Text>
                                    {/* FEATURED QUIZZES */}
                                    <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                        {quiz_data.map((quiz, key) => {
                                            return <QuizCard 
                                                quiz={quiz} 
                                                width="8%" 
                                                title_fontsize="0.7vw" 
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