import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react';
import addIcon from '../images/addicon.png';
import '../styles/styles.css'

export default function CreateQuizCard( props ) {

    let width = props.width
    let height = props.height;
    let title_fontsize = props.title_fontsize
    let callback = props.callback

    return (
        <VStack
            pos="relative"
            className="disable-select"
            w={width}
            h={height}
            // backgroundColor='whiteAlpha.600'
            minW="80px" 
            padding="0.5%" 
            margin="0.5%" 
            spacing="10%" 
            border="1px solid"
            borderColor="transparent"
            borderRadius="4%"             
            _hover={{bgColor:"blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
            _active={{bgColor:"gray.200",  transition:"background-color 0.1s linear"}}
            transition="background-color 0.1s linear"
            onClick={() => callback(true)}
        >
            <Box className='squareimage_container' w="50%" mt="15%"> 
                <Image className="squareimage" src={addIcon} objectFit="cover" borderRadius="20%" />
            </Box>

            {/* QUIZ TITLE */}
            <Text fontSize={title_fontsize} textColor='white' textAlign="center" fontWeight="medium" wordBreak="break-word">
                Create { props.type == 1 ? "Quiz":"Platform" }
            </Text>
            
        </VStack>
    )
}