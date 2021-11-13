import { Box, Grid, Text, Image, Icon, Center, HStack, Stack } from "@chakra-ui/react"
import quizImage from '../images/defaultquiz.jpeg';
import { Link } from 'react-router-dom';

export default function PlatformResult( {platform} ) {
    console.log(platform)
    return (
        <Link to={'/platformpage/' + platform._id}>
            <HStack
                h="14vh" 
                minH="80px"
                top="50%" 
                spacing="1.5%"
                borderBottom="1px" 
                borderColor="gray.300" 
                dipslay="flex" 
                alignItems="center" 
                _hover={{bgColor:"gray.200", 
                cursor:"pointer", 
                transition:"background-color 0.2s linear"}} 
                transition="background-color 0.1s linear"
                overflow="hidden"
            >
                {/* PLATFORM ICON */}
                <Box className='squareimage_container' w="6%" minW="55px" ml="2.8%"> 
                    <Image className="squareimage" src={platform.iconImage} fallbackSrc={quizImage} objectFit="cover" borderRadius="50%"></Image>
                </Box>

                {/* PLATFORM NAME */}
                <Stack spacing="0" direction="column">
                    <Text fontSize="135%" fontWeight="medium"> {platform.name}</Text>
                    <Text fontSize="110%"> {platform.followers.length} Followers </Text>
                </Stack>
                
                {/* QUIZ TITLE AND DESCRIPTION */}
                {/* <Grid templateRows="1fr 1fr">
                    <Text fontSize="115%" fontWeight="medium"> {quiz.title} </Text>
                    <Text fontSize="95%"> {quiz.description} </Text>
                </Grid> */}

                {/* RATING */}
                {/* <Center>
                    <Text fontSize="110%" fontWeight="thin">
                        <Icon pos="relative" as={StarIcon} boxSize="4" color="yellow.500"/>
                        &nbsp;{quiz_rating}
                    </Text>
                </Center> */}

                {/* PLATFORM */}
                {/* <Center>
                    <Text top="50%" fontSize="1.8vh" color="blue.500" > {quiz_platform} </Text> 
                </Center> */}

                {/* CREATOR */}
                {/* <Center>
                    <Text top="50%" fontSize="1.8vh"> {quiz.user.displayName} </Text> 
                </Center> */}
            </HStack>
        </Link>
    )
}