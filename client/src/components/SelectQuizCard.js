import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import '../styles/styles.css'


export default function SelectQuizCard( props ) {
    let quiz_data = props.quiz
    let quiz_title = quiz_data.title
    let width = props.width
    let title_fontsize = props.title_fontsize
    let char_limit = props.char_limit
    let setChosenQuiz = props.setChosenQuiz

    let show_stats = true
    if (props.show_stats === false)
        show_stats = false

    let chosen = false
    if (props.chosenQuiz === quiz_data)
        chosen = true
    

    let icon_src = quiz_data.icon == null ? quizImage : quiz_data.icon
    // quiz_title = "Longatitle areallyalongtite long title really really long title title title" // FOR TESTING: long titles
    
    // Cut off long titles with a ...
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
            bgColor={chosen ? "green.400" : ""}
            _hover={{bgColor: chosen ? "green.300" : "blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
            _active={{bgColor:"gray.200",  transition:"background-color 0.1s linear"}}
            transition="background-color 0.1s linear"
            onClick={() => setChosenQuiz(quiz_data)}
        >
            <Box className='squareimage_container' w="75%"> 
                <Image className="squareimage" src={icon_src} alt="Quiz Icon" objectFit="cover" borderRadius="20%"></Image>
            </Box>

            {/* QUIZ TITLE */}
            <Tooltip label={quiz_data.title} openDelay={350} bgColor="white" textColor="black">
                <Text fontSize={title_fontsize} textAlign="center" fontWeight="medium" wordBreak="break-word" textColor="white">
                    {quiz_title}
                </Text>
            </Tooltip>

        </VStack>
    )
}