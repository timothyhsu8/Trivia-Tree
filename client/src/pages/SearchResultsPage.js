import { Box, Grid, Text, Image, HStack, Icon, Button, Center, VStack, Select } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { StarIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';

export default function SearchResultsPage() {

    let search = "video game music"
    let search_text = 'Search Results for "' + search + '" Quizzes'

    // Placeholder data until we have mock quizzes in the database to pull from (That have icon, name, description, rating, etc.)
    let quizzes = ["", "", "", "", "", "", ""]
    let quiz_name = "Celeste Songs"
    let quiz_description = "Do you know these Celeste songs? Take this quiz to find out!!"
    let quiz_rating = 5
    let quiz_platform = "Celeste"
    let quiz_creator = "CelesteGamer200"

    return (
        <Box>
            <Navbar />
            <Grid templateColumns="1fr 6fr">
                {/* FILTERS */}
                <VStack pt="5vh">
                    <Text fontSize="30px" fontWeight="medium" >Filters</Text>
                    <Box w="75%" h="0.15vh" bgColor="gray.300"/>

                    <Text fontSize="20px"> Difficulties </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px"> 
                        <option> All Difficulties </option>
                        <option> Easy </option>
                        <option> Intermediate </option>
                        <option> Difficult </option>
                        <option> Expert </option>
                    </Select>

                    <Text fontSize="20px"> Quiz Types </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px"> 
                        <option> All Quiz Types </option>
                        <option> Standard </option>
                        <option> Instant </option>
                    </Select>

                    <Text fontSize="20px"> Timers </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px"> 
                        <option> Any Time Limit </option>
                        <option> Standard </option>
                        <option> Instant </option>
                    </Select>
                </VStack>

                {/* SEARCH RESULTS */}
                <Box pt="2vh">
                    <Text fontSize="4.1vh" fontWeight="light"> {search_text} </Text>
                    <Box w="100%" h="0.2vh" bgColor="gray.300"> </Box>

                    {/* ALL SEARCH RESULTS */}
                    {quizzes.map(() => {
                        return( 
                        <Link to="prequizpage">
                            <Grid h="15vh" top="50%" templateColumns="2fr 9fr 1fr 2fr 3fr" borderBottom="1px" borderColor="gray.300" dipslay="flex" alignItems="center" _hover={{bgColor:"gray.200", cursor:"pointer"}}>
                            
                                {/* QUIZ ICON */}
                                <Center>
                                    <Image w="115px" h="115px" top="50%" borderRadius="25" objectFit="cover" src="https://assets.nintendo.com/image/upload/f_auto,q_auto,w_960,h_540/Nintendo%20Switch/Games/Third%20Party/Celeste/Video/posters/Celeste_Launch_Trailer"/>
                                </Center>

                                {/* QUIZ TITLE AND DESCRIPTION */}
                                <Grid templateRows="1fr 1fr">
                                    <Text fontSize="3.1vh" fontWeight="medium"> {quiz_name} </Text>
                                    <Text fontSize="2.2vh"> {quiz_description} </Text>
                                </Grid>

                                {/* RATING */}
                                <Center>
                                    <Text fontSize="2.3vh" fontWeight="thin">
                                        <Icon as={StarIcon} boxSize="6" color="yellow.500"/>
                                        &nbsp;{quiz_rating}
                                    </Text>
                                </Center>

                                {/* PLATFORM */}
                                <Center>
                                    <Text top="50%" fontSize="2.1vh" color="blue.500" > {quiz_platform} </Text> 
                                </Center>

                                {/* CREATOR */}
                                <Center>
                                    <Text top="50%" fontSize="2.1vh"> {quiz_creator} </Text> 
                                </Center>
                            </Grid>
                        </Link>
                        )})}
                </Box>
            </Grid>
        </Box>
    )
}