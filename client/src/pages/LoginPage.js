import { Box, Grid, Text, Image, Center } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import treeicon from '../images/triviatree_icon.png'

export default function LoginPage({}) {
    return (
        <Box>
            <Navbar />
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

                        <Box w="55%" h="7vh" mt="4%" border="1px solid" borderColor="gray.300" borderRadius="5"></Box>
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