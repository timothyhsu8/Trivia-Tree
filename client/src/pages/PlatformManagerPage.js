import { Box, Grid, Icon, Text, VStack, HStack, Image, Center, Spinner, Button } from '@chakra-ui/react';
import { GET_USER } from '../cache/queries';
import { useQuery } from '@apollo/client';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { BsFillFileEarmarkTextFill, BsFillPersonFill } from 'react-icons/bs';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/styles.css'

export default function PlatformManagerPage() {
    const { user } = useContext(AuthContext);
    let { userId } = useParams();
    let history = useHistory();

    // Get User data (contains platform information)
    const { loading, error, data: { getUser: userData } = {}} = 
        useQuery(GET_USER, { skip: !user, fetchPolicy: 'cache-and-network', variables: { _id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    });

    // Ensures a user is the owner before displaying any content
    if (user === null || user === "NoUser" || user._id !== userId) {
        return null;
    }
    
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

    const platform_data = userData.platformsMade

    return (
        <Box>
            <Center> 
                <Text mt="1%" fontSize="250%" fontWeight="medium" color="gray.700"> Your Platforms </Text>
            </Center>
            
            {/* PLATFORM CARDS */}
            {
                platform_data.length !== 0 ?
                    <Grid mt="0.5%" ml="5%" mr="5%" templateColumns="repeat(auto-fill, minmax(425px, 1fr))">
                        {
                            platform_data.map((platform, key) => {
                                return (
                                    <Box 
                                        key={key}
                                        w="90%" 
                                        mt={5} 
                                        borderRadius={10} 
                                        boxShadow="lg" 
                                        transition=".1s linear"
                                        _hover={{cursor:"pointer", opacity:"85%", transition:".15s linear"}} 
                                        _active={{opacity:"75%"}}
                                        onClick={() => history.push('/platformpage/' + platform._id)}
                                    >
                                        <VStack>
                                            {/* PLATFORM IMAGE */}
                                            <Box
                                                pos="relative"
                                                w="100%"
                                                h="20vh"
                                                bgColor="gray.300"
                                                bgImage={"linear-gradient(to bottom, rgba(245, 246, 252, 0.10), rgba(30, 30, 30, 0.75)), url('" + platform.bannerImage +  "')"}
                                                bgSize="cover" 
                                                bgPosition="center"
                                                borderTopRadius={10}
                                            >
                                                <HStack w="100%" spacing={3} pos="absolute" bottom="5%" ml="2%">
                                                    <Box className='squareimage_container' w="15%" minW={50}> 
                                                        <Image className="squareimage" src={platform.iconImage} objectFit="cover" borderRadius="50%" border="2px solid white"></Image>
                                                    </Box>
                                                    <Text className="disable-select" fontSize="160%" textColor="white" fontWeight="medium"> {platform.name} </Text>
                                                </HStack>
                                            </Box>
                    
                                            <Text className="disable-select" fontSize="125%"> 
                                                <Icon as={BsFillPersonFill} /> { platform.followers.length !== 1 ? platform.followers.length + " Followers" : "1 Follower"}
                                            </Text>
                                            <Text className="disable-select" fontSize="125%" pb={3}> 
                                                <Icon as={BsFillFileEarmarkTextFill}/> { platform.quizzes.length !== 1 ? platform.quizzes.length + " Quizzes" : "1 Quiz" }
                                            </Text>
                                        </VStack>
                                    </Box>   
                                )
                            })
                        }
                    </Grid>
                    :
                    // User has not created any platforms
                    <Center>
                        <Text mt="15%" fontSize="200%"> You don't have any platforms! </Text>
                    </Center>
            } 
        </Box>
    )
}