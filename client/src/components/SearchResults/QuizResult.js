import { Box, Grid, Text, Image, Icon, Center, Stack, Tag, TagLabel, HStack } from "@chakra-ui/react"
import { StarIcon, ViewIcon, CalendarIcon } from '@chakra-ui/icons'
import quizImage from '../../images/defaultquiz.jpeg';
import { BsHeartFill, BsFillAlarmFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function QuizResult( {quiz} ) {

    return (
        <Link to={'/prequizpage/' + quiz._id}>
            <Grid 
                pt={2}
                pb={2}
                minH="80px"
                templateColumns="1.5fr 9fr 2fr 3fr" 
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
                        <Image className="squareimage" src={quiz.icon} objectFit="cover" borderRadius="23%"></Image>
                    </Box>
                </Center>

                {/* QUIZ TITLE AND DESCRIPTION */}
                <Stack spacing="1">
                    <Stack spacing="0">
                        <Text fontSize="120%" fontWeight="medium"> {quiz.title} </Text>
                        <Text fontSize="95%" textColor="gray.600"> {quiz.description} </Text>
                    </Stack>
                    <HStack>
                        <Tag w="fit-content" size="sm" variant="outline" colorScheme="blue">
                            <TagLabel> Quiz </TagLabel>
                        </Tag>

                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={ViewIcon} color="blue.400"/> { quiz.numAttempts !== 1 ? quiz.numAttempts + " Plays" : "1 Play" }  
                        </Text>
                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={BsHeartFill} color="red.300"/> { quiz.numFavorites !== 1 ? quiz.numFavorites + " Favorites" : "1 Favorite" }
                        </Text>
                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={BsFillAlarmFill} color="purple.400"/> {converTimeToText(quiz.quizTimer)}
                        </Text>
                        <Text textColor="gray.600" fontSize="95%">
                            <Icon as={CalendarIcon} color="grey.400"/> {getTimeAgo(new Date(parseInt(quiz.createdAt)))}
                        </Text>
                    </HStack>
                </Stack>

                {/* RATING */}
                <Center>
                    <Text fontSize="110%" fontWeight="thin">
                        <Icon pos="relative" top={-0.5} as={StarIcon} boxSize="4" color="yellow.500"/>
                        &nbsp;{ quiz.rating !== null ? quiz.rating : "No Rating" }
                    </Text>
                </Center>

                {/* CREATOR */}
                <Center>
                    <HStack w="100%">
                        <Box className='squareimage_container' w="10%" minW="20px" ml="2.8%"> 
                            <Image className="squareimage" src={quiz.user.iconImage} objectFit="cover" borderRadius="50%"></Image>
                        </Box>
                        <Text top="50%" fontSize="1.8vh" color="blue.500"> {quiz.user.displayName} </Text> 
                    </HStack>
                </Center>
            </Grid>
        </Link>
    )

    
// Converts timer value into text (E.g. 00:10:00 -> 10 mins)
function converTimeToText(time) {
    let hour_min_sec = time.split(":")
    let hours = parseInt(hour_min_sec[0])
    let mins = parseInt(hour_min_sec[1])
    let secs = parseInt(hour_min_sec[2])
    let timeString = ""

    if (hours !== 0)
        timeString += hours !== 1 ? hours + " Hours " : hours + " Hour "

    if (mins !== 0)
        timeString += mins !== 1 ? mins + " Mins " : mins + " Min "

    if (secs !== 0)
        timeString += secs !== 1 ? secs + " Secs " : secs + " Second "

    return timeString
}

// Returns time since something was created (Ex: "3 days ago")
function getTimeAgo(creationDate) {
    // Get difference in time between now and the creation date
    let time_diff_ms= Math.abs(new Date() - creationDate)
    
    // Format as 'x weeks ago'
    let weeks_ago = parseInt(time_diff_ms / (7*24*60*60*1000))
    if (weeks_ago !== 0)
        return weeks_ago !== 1 ? weeks_ago + " weeks ago" : "1 week ago"

    // Format as 'x days ago'
    let days_ago = parseInt(time_diff_ms / (60*60*24*1000))
    if (days_ago !== 0)
        return days_ago !== 1 ? days_ago + " days ago" : "1 day ago"
    
    // Format as 'x hours ago'
    let hours_ago = parseInt(time_diff_ms / (60*60*1000))
    if (hours_ago !== 0)
        return hours_ago + " hours ago"

    // Format as 'x minutes ago'
    let minutes_ago = parseInt(time_diff_ms / (60*1000))
    if (minutes_ago !== 0)
        return minutes_ago !== 1 ? minutes_ago + " minutes ago" : "1 minute ago"

    // Format as 'x seconds ago'
    let seconds_ago = parseInt(time_diff_ms / 1000)
    if (seconds_ago !== 0)
        return seconds_ago + " seconds ago"

    return "Undefined Date"
}
}