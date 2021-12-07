import { Box, Grid, Text, Image, Center, Button } from '@chakra-ui/react';
import treeicon from '../images/triviatree_icon.png'
import { React, useContext, useState, useEffect } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { useParams, useHistory, Prompt } from 'react-router-dom';

export default function LoginPage({}) {
    const { user } = useContext(AuthContext);
    let history = useHistory();

    function continueGuest(){
        history.push('/homepage');
    }

    if(user != null && user != "NoUser"){
        history.push('/homepage');
    }

    return (
        <Box>
            <Grid templateColumns="2fr 3fr">

                {/* LEFT SIDE OF PAGE */}
                <Box>
                    <Box mt="4%" pl="17%" borderRight="1px" borderColor="gray.600">
                        <Text fontSize="3vw" fontWeight="thin"> 
                            Where the world <br/> 
                            takes quizzes 
                        </Text>

                        <Box w="60%" mt="4%" padding="4%" borderRadius="10" bgColor="gray.200" boxShadow="lg">
                            <Text fontSize="1.3vw"> 
                                A site designed and             <br/> 
                                developed with both quiz        <br/> 
                                creators and quiz takers in     <br/> 
                                the forefront. Experience the   <br/> 
                                elegance of a elegant and       <br/> 
                                responsive UI while             <br/> 
                                expressing your knowledge       <br/> 
                                when creating and taking        <br/> 
                                quizzes
                            </Text>
                        </Box>

                        {/* Login Button */}
                        <a href={`${config.API_URL}/auth/google`}>
                            <Button w="55%" h="7vh" mt="6%" fontSize="1.1vw" border="1px solid" borderColor="gray.300" borderRadius="10" _focus={{boxShadow:"none"}}>
                                Login with Google
                            </Button>
                        </a>
                    
                        <Button onClick={continueGuest} w="55%" h="7vh" mt="6%" fontSize="1.1vw" border="1px solid" borderColor="gray.300" borderRadius="10" _focus={{boxShadow:"none"}}>
                                Continue as Guest
                         </Button>

                    </Box>
                </Box>

                {/* RIGHT SIDE OF PAGE */}
                <Box>
                    <Center>
                        <Image w="80%" mt="3%" src={treeicon}></Image>
                    </Center>
                </Box>
            </Grid>
        </Box>
    )
}