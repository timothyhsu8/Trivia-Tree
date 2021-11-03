import { Box, Text, Image, VStack, Tooltip } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
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

    let icon_src = quizImage
    // quiz_title = "Longatitle areallyalongtite long title really really long title title title" // FOR TESTING: long titles
    
    if (quiz_title.length > char_limit)
        quiz_title = quiz_title.slice(0, char_limit) + "..."

    function renderAuthor() {
        if (include_author !== true) return

        return (
            <Tooltip label="Quiz Author" openDelay={300}>
                <Text className="disable-select" fontSize={author_fontsize} textAlign="center" textColor="purple.500">
                    {author}
                </Text>
            </Tooltip>
        )
    }

    return (
        <VStack 
            className="disable-select"
            w={width} 
            padding="0.5%" 
            margin="0.5%" 
            spacing="2%" 
            borderRadius="4%" 
            _hover={{bgColor:"blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
            _active={{opacity:"80%",  transition:"opacity 0.15s linear"}}
            transition="background-color 0.1s linear"
            onClick={() => history.push('/prequizpage/' + quiz_data._id)}
        >
            <Box className='squareimage_container' w="100%"> 
                <Image className="squareimage" src={icon_src} alt="Quiz Icon" objectFit="cover" borderRadius="20%"></Image>
            </Box>
            <Tooltip label={quiz_data.title} openDelay={350}>
                <Text fontSize={title_fontsize} textAlign="center" fontWeight="medium" wordBreak="break-word">
                    {quiz_title}
                </Text>
            </Tooltip>
            {renderAuthor()}
        </VStack>
    )
}