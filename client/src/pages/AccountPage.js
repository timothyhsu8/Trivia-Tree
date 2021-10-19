import { Box, Flex, Center, Text, Grid, VStack, Button, Image } from "@chakra-ui/react"

export default function AccountPage() {
    let user = "User1849021"
    let pfp_src = "https://yt3.ggpht.com/ytc/AKedOLTcxhIAhfigoiA59ZB6aB8z4mruPJnAoBQNd6b0YA=s900-c-k-c0x00ffffff-no-rj"
    let banner_src = "https://cdnb.artstation.com/p/assets/images/images/027/468/579/4k/kan-liu-666k-chilling-time.jpg?1591633242"
    let quiz_sections = ["Featured Quizzes", "Featured Platforms"]
    let bio = "This is a biography test. Testing out the biography text wrapping and the look of the displayed text within the biography element. Actual\
        biography will go here and will go here."

    return (
        <Box data-testid="main-component">
            <Grid templateColumns="1fr 6fr 1fr">
                <Box w="100%" h="100vh"></Box>
                
                {/* MAIN CONTENT */}
                <Box w="100%" h="100vh">
                    
                    {/* HEADER AND BANNER */}
                    <Grid templateRows="1fr 4fr" h="40vh">
                        {/* HEADER BUTTONS */}
                        <Grid w="100%" templateColumns="1fr 1fr 1fr 1fr"> 
                            <Button height="100%" fontSize="1vw" bgColor="white"> {user} </Button>
                            <Button height="100%" fontSize="1vw" bgColor="white"> Platforms </Button>
                            <Button height="100%" fontSize="1vw" bgColor="white"> Quizzes </Button>
                            <Button height="100%" fontSize="1vw" bgColor="white"> Badges </Button>
                        </Grid>

                        {/* BANNER */}
                        <Box
                            bgImage={"linear-gradient(to bottom, rgba(245, 246, 252, 0.30), rgba(255, 255, 255, 0.90)), url('" + banner_src +  "')"} 
                            bgSize="cover" 
                            bgPosition="center"
                            borderRadius="10">
                                {/* PROFILE PICTURE AND NAME */}
                                <Flex direction="row" top="50%" left="2%" transform="translateY(-50%)" position="relative"> 
                                    <Image w="15%"src={pfp_src} borderRadius="150"></Image>
                                    <Text pos="absolute" bottom="30%" left="16%" fontSize="3vw" as="b" >{user}</Text>
                                </Flex>
                        </Box>
                    </Grid>

                    {/* FEATURED QUIZZES/PLATFORMS AND BIOGRAPHY */}
                    <Grid pt="1%" templateColumns="3fr 1fr">

                        {/* FEATURED QUIZZES/PLATFORMS */}
                        <Box w="98.5%" h="60vh" borderRadius="10">
                            <VStack spacing="1.5vh">
                                {quiz_sections.map((name, index) => {
                                    return(
                                        <Box key={index} w="100%" h="30vh" bgColor="gray.200" borderRadius="10">
                                            <Text pl="1.5%" fontSize="1.5vw">{name}</Text>
                                        </Box>
                                    )
                                })}
                            </VStack>
                        </Box>

                        {/* BIOGRAPHY */}
                        <Box bgColor="gray.200" borderRadius="10">
                            <Text pl="3%" fontSize="1.5vw">Biography</Text>
                            <Text pl="3%" pr="3%" fontSize="0.9vw"> {bio} </Text>
                        </Box>
                    </Grid>
                </Box>
                <Box w="100%" h="100vh"></Box>
            </Grid>
        </Box>
    )
}