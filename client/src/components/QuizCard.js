import { useState } from 'react';
import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid, Button, Center,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    PopoverCloseButton, } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import quizImage from '../images/defaultquiz.jpeg';
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { BsHeartFill } from "react-icons/bs"
import '../styles/styles.css'
import { REMOVE_QUIZ_FROM_PLATFORM } from '../cache/mutations';

export default function QuizCard( props ) {
    let history = useHistory();
    
    const [hovering, setHovering] = useState(false)

    let quiz_data = props.quiz
    let quiz_title = quiz_data.title
    let width = props.width
    let title_fontsize = props.title_fontsize
    let author_fontsize = props.author_fontsize
    let include_author = props.include_author
    let author = null
    if (include_author) {
        author = quiz_data.user.displayName
    }
    
    let char_limit = props.char_limit
    let icon_src = quiz_data.icon == null ? quizImage : quiz_data.icon
    let numAttempts = quiz_data.numAttempts
    let numFavorites = quiz_data.numFavorites
    let isEditing = props.isEditing ? true:false;
    let is_owner = false
    let isFeaturedQuiz = false
    if (props.is_owner) {
        is_owner = true
    }
    if (props.isFeaturedQuiz) {
        isFeaturedQuiz = true
    }

    // Removes this quiz from a platform
    const [removeQuizFromPlatform] = useMutation(REMOVE_QUIZ_FROM_PLATFORM, {
        onCompleted() {
            history.go(0)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })

    // Call function to remove quiz from a platform
    function handleRemoveQuizFromPlatform() {
        removeQuizFromPlatform({
            variables: {
                platformId: props.platform_id,
                quizId: quiz_data._id
            }
        })
    }

    // quiz_title = "Longatitle areallyalongtite long title really really long title title title" // FOR TESTING: long titles
    
    if (quiz_title.length > char_limit)
        quiz_title = quiz_title.slice(0, char_limit) + "..."

    function quizToDelete() {
        props.handleDeleteFeaturedQuiz(quiz_data)
    }

    return (
        <Box 
            className="disable-select"
            pos="relative"
            w={width}
            minW="80px" 
            padding="0.5%" 
            margin="0.5%"
            borderRadius="4%" 
            border={isEditing ? "1px":""}
            borderColor={isEditing ? "red":""}
            _hover={isEditing ? {bgColor:"red.100", cursor:"pointer", transition:"background-color 0.15s linear"}:{bgColor:"blue.100", cursor:"pointer", transition:"0.15s linear"}} 
            _active={{bgColor:"gray.200",  transition:"background-color 0.1s linear"}}
            transition="0.1s linear"
            onClick={isEditing ? ()=> quizToDelete():() => history.push('/prequizpage/' + quiz_data._id)}
            //color={disableClick ? 'white':'black'}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >

            {/* EDIT/DELETE BUTTONS (If user is owner) */}
            {renderEditButtons()}
            
            {/* MAIN CONTENT */}
            <VStack spacing="2%">
                <Box className='squareimage_container' w="75%"> 
                    <Image className="squareimage" src={icon_src} alt="Quiz Icon" objectFit="cover" borderRadius="20%"></Image>
                </Box>

                {/* QUIZ TITLE */}
                <Tooltip label={quiz_data.title} openDelay={350}>
                    <Text fontSize={title_fontsize} textAlign="center" fontWeight="medium" wordBreak="break-word">
                        {quiz_title}
                    </Text>
                </Tooltip>

                {/* QUIZ AUTHOR */}
                {
                    include_author !== true ? null :
                    <Tooltip label={author} openDelay={300}>
                        <Text 
                            className="disable-select" 
                            fontSize={author_fontsize} 
                            textAlign="center" 
                            textColor="purple.500"
                            _hover={{textColor:"blue.400", cursor:"pointer"}}
                            onClick={(event) => {
                                history.push('/accountpage/' + quiz_data.user._id)
                                event.stopPropagation()
                            }}
                            >
                            {author}
                        </Text>
                    </Tooltip>
                }

                {/* QUIZ VIEWS/PLAYS */}
                <Grid w="100%" templateColumns="1fr 1fr"> 
                    <Center>
                        <HStack spacing="0">
                            <Text fontSize="90%"> <Icon as={ViewIcon} pos="relative" top="3%" color="blue.400" /> {numAttempts} </Text>
                        </HStack>
                    </Center>
                    
                    <Center>
                        <HStack spacing="0">
                            <Text fontSize="90%" pos="relative"> <Icon as={BsHeartFill} pos="relative" color="red.400"/> {numFavorites} </Text>
                        </HStack>
                    </Center>
                </Grid>
            </VStack>
        </Box>
    )

    // EDIT/DELETE BUTTONS (If user is owner)
    function renderEditButtons() {
        return (
            is_owner && hovering ? 
                <VStack pos="absolute" right="2%" transition="0.2s linear">
                    <Icon as={EditIcon} _hover={{color:"gray.500", transition:"0.1s linear"}} transition="0.1s linear" 
                        onClick={(event) => {
                            console.log("HEY")
                            event.stopPropagation()
                        }} />
                    
                    {isFeaturedQuiz ? <Icon as={DeleteIcon} _hover={{ color: "gray.500", transition: "0.1s linear" }} transition="0.1s linear"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        quizToDelete()}} /> :
                        <Popover>
                            <PopoverTrigger>
                                <Icon as={DeleteIcon} _hover={{ color: "gray.500", transition: "0.1s linear" }} transition="0.1s linear"
                                    onClick={(event) => { event.stopPropagation() }} />
                            </PopoverTrigger>
                            <PopoverContent onClick={(event) => event.stopPropagation()}>
                                <PopoverCloseButton />
                                <PopoverBody> Remove this quiz from the platform? </PopoverBody>
                                <PopoverFooter>
                                    <Center>
                                        <Button colorScheme="red" onClick={() => handleRemoveQuizFromPlatform()}> Yes, remove it </Button>
                                    </Center>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    }
                </VStack>
                :
                null
        )
    }
}