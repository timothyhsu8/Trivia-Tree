import { Box, Grid, Text, Image, HStack, Icon, Button, Center, VStack, Select, Spinner } from "@chakra-ui/react"
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_QUIZZES, SEARCH_PLATFORMS } from "../cache/queries";
import QuizResult from '../components/QuizResult'
import PlatformResult from '../components/PlatformResult'
import '../styles/styles.css'

export default function SearchResultsPage() {

    const location = useLocation()
    let search = location.state.search
    let searchType = location.state.searchType
    let search_text = 'Search Results for "' + search + '"'

    const quizzes = useQuery(SEARCH_QUIZZES, { variables: { searchText: search }, fetchPolicy: 'cache-and-network' })
    const platforms = useQuery(SEARCH_PLATFORMS, { variables: { searchText: search }, fetchPolicy: 'cache-and-network'})

    const loading = quizzes.loading || platforms.loading
    const error = quizzes.error || platforms.error

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

    const quiz_data = quizzes.data.searchQuizzes
    const platform_data = platforms.data.searchPlatforms

    // Gather all search results
    let search_results = getSearchResults(searchType, quiz_data, platform_data)

    // Puts the correct data into the search results array (Depending on if the user serached for quizzes, platforms, users, or all)
    function getSearchResults(searchType, quiz_data, platform_data) {
        let search_results = []
        
        switch(searchType) {
            case "All":
                search_results = search_results.concat(quiz_data)
                search_results = search_results.concat(platform_data)
                break
            case "Quizzes":
                search_results = search_results.concat(quiz_data)
                break
            case "Platforms":
                search_results = search_results.concat(platform_data)
                break
        }
        return search_results
    }

    // Render search results to the user
    function renderSearchResults(){
        // No quizzes found
        if (search_results.length === 0)
            return (
                <Center mt="1%">
                    <Text fontSize="2vw" fontWeight="thin"> No results found for "{search}"</Text>
                </Center>
            )
        
        // Show quizzes that matched user's search
        return (
            // Content refers to either a Quiz, Platform, or User
            search_results.map((content, index) => {
                if (content.__typename === "Quiz") {
                    return ( 
                        <QuizResult 
                            key={index}
                            quiz={content}
                        />)
                }

                else if (content.__typename === "Platform") {
                    return (
                        <PlatformResult 
                            key={index}
                            platform={content}
                        />
                    )
                }
                
            })
        )

    }

    return (
        <Box data-testid="main-component">
            <Grid templateColumns="1fr 6fr" minWidth="700px">
                {/* FILTERS */}
                <VStack pt="5vh">
                    <Text fontSize="125%" fontWeight="medium" >Filters</Text>
                    <Box w="75%" h="0.15vh" bgColor="gray.300"/>

                    <Text fontSize="100%"> Difficulties </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px" _focus={{boxShadow:"none"}}> 
                        <option> All Difficulties </option>
                        <option> Easy </option>
                        <option> Intermediate </option>
                        <option> Difficult </option>
                        <option> Expert </option>
                    </Select>

                    <Text fontSize="100%"> Quiz Types </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px" _focus={{boxShadow:"none"}}> 
                        <option> All Quiz Types </option>
                        <option> Standard </option>
                        <option> Instant </option>
                    </Select>

                    <Text fontSize="100%"> Timers </Text>
                    <Select w="75%" borderColor="gray.400" borderRadius="10px" _focus={{boxShadow:"none"}}> 
                        <option> Any Time Limit </option>
                        <option> Standard </option>
                        <option> Instant </option>
                    </Select>
                </VStack>

                {/* SEARCH RESULTS */}
                <Box pt="2vh">
                    <Text fontSize="200%" fontWeight="light"> {search_text} </Text>
                    <Box w="100%" h="0.2vh" bgColor="gray.300"> </Box>

                    {/* ALL SEARCH RESULTS */}
                    {renderSearchResults()}
                </Box>
            </Grid>
        </Box>
    )
}