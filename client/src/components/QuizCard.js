import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import { ViewIcon } from '@chakra-ui/icons'
import { BsHeart } from "react-icons/bs"
import '../styles/styles.css'

export default function QuizCard( props ) {
    let history = useHistory();
    
    let quiz_data = props.quiz
    let quiz_title = quiz_data.title
    let width = props.width
    let title_fontsize = props.title_fontsize
    let author_fontsize = props.author_fontsize
    let include_author = props.include_author
    let char_limit = props.char_limit
    let author = quiz_data.user.displayName
    let icon_src = quiz_data.icon == null ? quizImage : quiz_data.icon
    let numAttempts = quiz_data.numAttempts
    let numFavorites = quiz_data.numFavorites

    // quiz_title = "Longatitle areallyalongtite long title really really long title title title" // FOR TESTING: long titles
    
    if (quiz_title.length > char_limit)
        quiz_title = quiz_title.slice(0, char_limit) + "..."

    return (
        <VStack 
            className="disable-select"
            w={width}
            minW="80px" 
            padding="0.5%" 
            margin="0.5%" 
            spacing="2%" 
            borderRadius="4%" 
            _hover={{bgColor:"blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
            _active={{bgColor:"gray.200",  transition:"background-color 0.1s linear"}}
            transition="background-color 0.1s linear"
            onClick={() => history.push('/prequizpage/' + quiz_data._id)}
        >
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
                            history.push('/accountpage/')
                            event.stopPropagation()
                        }}
                        >
                        {author}
                    </Text>
                </Tooltip>
            }

            {/* QUIZ VIEWS/PLAYS */}
            <Grid w="100%" templateColumns="1fr 1fr"> 
                <HStack spacing="0">
                    <Icon boxSize="50%" as={ViewIcon} pos="relative" top="3%"/>
                    <Text fontSize="90%"> {numAttempts} </Text>
                </HStack>
                
                <HStack spacing="0">
                    <Icon as={BsHeart} boxSize="45%" pos="relative" left="10%" top="6%"/>
                    <Text fontSize="90%" pos="relative" left="8%"> {numFavorites} </Text>
                </HStack>
            </Grid>
        </VStack>
    )
}