import { Box, Grid, Text, Image, Icon, Center, Stack, Tag, TagLabel, HStack } from "@chakra-ui/react"
import { StarIcon } from '@chakra-ui/icons'
import quizImage from '../../images/defaultquiz.jpeg';
import { BsStar, BsFillPersonFill, BsStarFill, BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

// Placeholder data since we don't have this information yet
let quiz_rating = 5
let quiz_platform = "No Platform"

export default function QuizResult( {quiz} ) {
    return (
        <Link to={'/prequizpage/' + quiz._id}>
            <Grid 
                h="10.5vh" 
                minH="80px"
                top="50%" 
                templateColumns="1.5fr 9fr 1fr 2fr 3fr" 
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
                {/* QUIZ ICON */}
                <Center>
                    <Box className='squareimage_container' w="50%" minW="50px"> 
                        <Image className="squareimage" src={quiz.icon} fallbackSrc={quizImage} objectFit="cover" borderRadius="23%"></Image>
                    </Box>
                </Center>

                {/* QUIZ TITLE AND DESCRIPTION */}
                <Stack spacing="1">
                    <Stack spacing="0">
                        <Text fontSize="120%" fontWeight="medium"> {quiz.title} </Text>
                        <Text fontSize="95%"> {quiz.description} </Text>
                    </Stack>
                    <HStack>
                        <Tag w="fit-content" size="sm" variant="outline" colorScheme="blue">
                            <TagLabel> Quiz </TagLabel>
                        </Tag>

                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={BsFillPersonFill} color="blue.400"/> {quiz.numAttempts} Plays  
                        </Text>
                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={BsHeartFill} color="red.300"/> {quiz.numFavorites} Favorites  
                        </Text>

                    </HStack>
                </Stack>

                {/* RATING */}
                <Center>
                    <Text fontSize="110%" fontWeight="thin">
                        <Icon pos="relative" as={StarIcon} boxSize="4" color="yellow.500"/>
                        &nbsp;{quiz_rating}
                    </Text>
                </Center>

                {/* PLATFORM */}
                <Center>
                    <Text top="50%" fontSize="1.8vh" color="blue.500" > {quiz_platform} </Text> 
                </Center>

                {/* CREATOR */}
                <Center>
                    <Text top="50%" fontSize="1.8vh"> {quiz.user.displayName} </Text> 
                </Center>
            </Grid>
        </Link>
    )
}