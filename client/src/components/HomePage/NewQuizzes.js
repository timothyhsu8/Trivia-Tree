import { React, useContext, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { Box, Text, Flex, Spinner, Center, Grid, Icon, Avatar, HStack, Stack } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GET_NEWEST_QUIZZES } from "../../cache/queries";
import { useHistory } from 'react-router-dom';
import QuizCard from '../QuizCard';
import { StarIcon, ViewIcon } from '@chakra-ui/icons'
import { BsFillHeartFill } from 'react-icons/bs';
import '../../styles/styles.css'

export default function NewQuizzes() {
    let history = useHistory();
    const { user } = useContext(AuthContext);
    const quizzes = useQuery(GET_NEWEST_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const [initialLoad, setInitialLoad] = useState(false);

    const doneLoading = !quizzes.loading
    const error = quizzes.error

    // Loading Screen
    if (!doneLoading && !initialLoad) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    } else {
        if (!initialLoad) {
            setInitialLoad(true);
        }
    }

    // Error Screen
    if (error) {
        console.log(error)
        return (
            <Center>
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    if (!user) {
        return null;
    }

    const quiz_data = quizzes.data.getNewestQuizzes

    const new_quizzes = quiz_data.slice(0, 20)
    // const new_quizzes = quiz_data.slice(0).reverse()
    const first_three = new_quizzes.slice(0, 3)
    return (
        <Box mt="1%" ml="2%" mr="2%">
            <Text fontSize="140%" ml="1%" mb={2} fontWeight="medium"> New Quizzes </Text>

            {/* Gives first 3 quizzes a big card */}
            <HStack pt={5} pb={5} spacing={4} borderRadius={5} justifyContent="center" boxShadow="lg" bgSize="cover" bgPos="center" bgImage={
                        "linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(100, 0, 0, .5)), url('" +
                        "https://res.cloudinary.com/dsry3cnco/image/upload/v1639197385/triva_tree_featured_afuxb3.png" +
                        "')"
                    }>
                {
                    first_three.map((quiz, key) => {
                        return (
                            renderLargeQuizCard(quiz)   
                        )
                    })
                }
            </HStack>

            <Flex mt="0.5%" spacing="3%" display="flex" flexWrap="wrap" >
                {new_quizzes.slice(3).map((quiz, key) => {
                    return <QuizCard 
                        quiz={quiz} 
                        width="7.3%" 
                        title_fontsize="95%" 
                        author_fontsize="85%" 
                        include_author={true}
                        char_limit={30} 
                        key={key}
                    />
                })}
            </Flex>
        </Box>
    )

     // Larger quiz cards for the first 2 or 3 new quizzes (or best quizzes or whatever)
     function renderLargeQuizCard(quiz) {
        return (
            <Box w="30%" minW={400} bgColor="white" borderRadius={10} border="1px" borderColor="gray.200" boxShadow="md" padding={5} overflow="hidden"
                _hover={{bgColor:"gray.100", transition:".15s linear", cursor:"pointer"}}
                transition=".15s linear"    
                onClick={() => history.push('/prequizpage/' + quiz._id)}
            >
                <HStack>
                    <Avatar src={quiz.icon} size="2xl" borderRadius={10} />
                    <Grid templateColumns="2fr 1fr">
                        <Stack spacing={1} p={1}>
                            <Text fontSize="130%" fontWeight="medium"> {quiz.title} </Text>
                            <HStack>
                                <Avatar src={quiz.user.iconImage} size="sm"/>
                                <Text whiteSpace="nowrap"> {quiz.user.displayName} </Text>
                            </HStack>
                            <Text> {quiz.description}</Text>
                        </Stack>

                        <Stack p={1}>
                            <Text>
                                <Icon as={ViewIcon} color="blue.400" pos="relative" top="-1px" mr="5px"/> 
                                {quiz.numAttempts} Attempts 
                            </Text>
                            <Text>
                                <Icon as={BsFillHeartFill} color="red.400" pos="relative" top="-1px" mr="5px"/> 
                                {quiz.numFavorites} Favorites
                            </Text>
                            <Text>
                                <Icon as={StarIcon} color="yellow.400" pos="relative" top="-1px" mr="5px"/> 
                                {quiz.rating} Stars
                            </Text>
                        </Stack>
                    </Grid>
                </HStack>
            </Box>
        )
    }
}