import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORM } from "../cache/queries";
import { useParams } from 'react-router-dom';
import QuizCard from "../components/QuizCard";
import { useState } from 'react';
import defaultIcon from '../images/defaultquiz.jpeg';
import '../styles/styles.css'

export default function PlatformPage({}) {
    let { platformId } = useParams();

    const [following, setFollowing] = useState(false)
    const [page, setPage] = useState('platform')

    const quiz_sections = ["Best Quizzes", "Most Played Quizzes", "Geography"]

    // Fetch quiz data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platform = useQuery(GET_PLATFORM, { variables: { platformId: platformId} })

    const loading = quizzes.loading || platform.loading
    const error = quizzes.error || platform.error
    
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
    const platform_data = platform.data.getPlatform

    return (
        <Box>
            <Grid templateColumns="1fr 20fr 1fr">
                <Box/>
                <Box>
                     {/* HEADER BUTTONS */}
                     <Grid w="100%" h="6vh" minH="50px" templateColumns="1fr 1fr 1fr 1fr"> 
                        <Button height="100%" fontSize="115%" bgColor="white" textColor={ page === 'platform' ? "blue" : "black" } _focus={{boxShadow:"none"}}> Platform Name</Button>
                        <Button height="100%" fontSize="115%" bgColor="white" _focus={{boxShadow:"none"}}> Quizzes </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" _focus={{boxShadow:"none"}}> Leaderboard </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" _focus={{boxShadow:"none"}}> Badges </Button>
                    </Grid>

                    {/* BANNER */}
                    <Box
                        h="27vh"
                        minH="200px"
                        pos="relative"
                        bgColor="gray.300"
                        bgImage={"url('" + platform_data.bannerImage +  "')"} 
                        bgSize="cover" 
                        bgPosition="center"
                        borderRadius="10"
                    >
                        {/* PLATFORM ICON / NAME / FOLLOWERS */}
                        <VStack pos="relative" right="41%" top="50%" spacing="-1">
                            <Box className='squareimage_container' w="11%" minW="75px" minH="75px"> 
                                <Image className="squareimage" src={platform_data.iconImage} fallbackSrc={defaultIcon} objectFit="cover" border="3px solid white" borderRadius="50%"></Image>
                            </Box>
                            <Text fontSize="160%" fontWeight="medium"> {platform_data.name} </Text>
                            <Text fontSize="110%"> {platform_data.followers.length} Followers </Text>
                        </VStack>
                    </Box>

                    {/* FOLLOW BUTTON */}
                    {
                        following ?
                            <Button 
                                w="7%" 
                                minW="80px"
                                h="50px" 
                                mt="1%" 
                                bgColor="red.600" 
                                fontSize="120%" 
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
                                w="7%" 
                                minW="80px"
                                h="50px" 
                                mt="1%" 
                                bgColor="gray.800" 
                                fontSize="120%" 
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
                                    <Text pl="1.5%" pt="1%" fontSize="130%" fontWeight="medium"> {section} </Text>
                                    {/* FEATURED QUIZZES */}
                                    <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                        {quiz_data.map((quiz, key) => {
                                            return <QuizCard 
                                                quiz={quiz} 
                                                width="7.5%"
                                                title_fontsize="92%" 
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