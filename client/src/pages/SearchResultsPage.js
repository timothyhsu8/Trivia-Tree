import { Box, Grid, Text, Image, HStack, Icon, Button, Center, VStack, Select, Spinner } from "@chakra-ui/react"
import { StarIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_QUIZZES } from "../cache/queries";
import quizImage from '../images/defaultquiz.jpeg';
import '../styles/styles.css'

export default function SearchResultsPage() {

    const location = useLocation()
    let search = location.state.search
    let search_text = 'Search Results for "' + search + '" Quizzes'

    // Placeholder data for the quiz info we don't have in the database yet
    let quiz_description = "Do you know these Celeste songs? Take this quiz to find out!!"
    let quiz_rating = 5
    let quiz_icon_src = quizImage;
    let quiz_platform = "Celeste"
    let quiz_creator = "CelesteGamer200"

    const {
        loading,
        error,
        data: { getQuizzes: quiz_data } = {},
    } = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' });

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
    
    // Filters quizzes to match the search parameters
    const quizzes = quiz_data.filter((quiz) => {
        let quiz_title = quiz.title.toLowerCase()
        let search_word = search.toLowerCase()
        return quiz_title.includes(search_word)
    })

    // Render search results to the user
    function renderSearchResults(){
        // No quizzes found
        if (quizzes.length === 0)
            return (
                <Center mt="1%">
                    <Text fontSize="2vw" fontWeight="thin">No quizzes found for "{search}"</Text>
                </Center>
            )

        // Show quizzes that matched user's search
        return (
        quizzes.map((quiz, index) => {
            return( 
            <Link to={'/prequizpage/' + quiz._id} key={index}>
                <Grid 
                    h="12vh" 
                    top="50%" 
                    templateColumns="2fr 9fr 1fr 2fr 3fr" 
                    borderBottom="1px" 
                    borderColor="gray.300" 
                    dipslay="flex" 
                    alignItems="center" 
                    _hover={{bgColor:"gray.200", 
                    cursor:"pointer", 
                    transition:"background-color 0.2s linear"}} 
                    transition="background-color 0.1s linear"
                >
                
                    {/* QUIZ ICON */}
                    <Center>
                        <Box className='squareimage_container' w="48%"> 
                            <Image className="squareimage" src={quiz_icon_src} alt="Profile Picture" objectFit="cover" borderRadius="23%"></Image>
                        </Box>
                    </Center>

                    {/* QUIZ TITLE AND DESCRIPTION */}
                    <Grid templateRows="1fr 1fr">
                        <Text fontSize="2.4vh" fontWeight="medium"> {quiz.title} </Text>
                        <Text fontSize="1.8vh"> {quiz_description} </Text>
                    </Grid>

                    {/* RATING */}
                    <Center>
                        <Text fontSize="2.0vh" fontWeight="thin">
                            <Icon as={StarIcon} boxSize="5" color="yellow.500"/>
                            &nbsp;{quiz_rating}
                        </Text>
                    </Center>

                    {/* PLATFORM */}
                    <Center>
                        <Text top="50%" fontSize="1.8vh" color="blue.500" > {quiz_platform} </Text> 
                    </Center>

                    {/* CREATOR */}
                    <Center>
                        <Text top="50%" fontSize="1.8vh"> {quiz_creator} </Text> 
                    </Center>
                </Grid>
            </Link>
            )})
        )
    }

    return (
        <Box data-testid="main-component">
            <Grid templateColumns="1fr 6fr">
                {/* FILTERS */}
                <VStack pt="5vh">
                    <Text fontSize="1.5vw" fontWeight="medium" >Filters</Text>
                    <Box w="75%" h="0.15vh" bgColor="gray.300"/>

                    <Text fontSize="0.9vw"> Difficulties </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px" _focus={{boxShadow:"none"}}> 
                        <option> All Difficulties </option>
                        <option> Easy </option>
                        <option> Intermediate </option>
                        <option> Difficult </option>
                        <option> Expert </option>
                    </Select>

                    <Text fontSize="0.9vw"> Quiz Types </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px" _focus={{boxShadow:"none"}}> 
                        <option> All Quiz Types </option>
                        <option> Standard </option>
                        <option> Instant </option>
                    </Select>

                    <Text fontSize="0.9vw"> Timers </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px" _focus={{boxShadow:"none"}}> 
                        <option> Any Time Limit </option>
                        <option> Standard </option>
                        <option> Instant </option>
                    </Select>
                </VStack>

                {/* SEARCH RESULTS */}
                <Box pt="2vh">
                    <Text fontSize="3.4vh" fontWeight="light"> {search_text} </Text>
                    <Box w="100%" h="0.2vh" bgColor="gray.300"> </Box>

                    {/* ALL SEARCH RESULTS */}
                    {renderSearchResults()}
                </Box>
            </Grid>
        </Box>
    )
}