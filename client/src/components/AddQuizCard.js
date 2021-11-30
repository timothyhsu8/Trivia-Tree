import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react';
import addIcon from '../images/addicon.png';
import '../styles/styles.css'

export default function AddQuizCard( props ) {

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
            minW="80px" 
            padding="0.5%" 
            margin="0.5%" 
            spacing="2%" 
            border="1px solid"
            borderColor="gray.300"
            borderRadius="4%"             
            _hover={{bgColor:"blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
            _active={{bgColor:"gray.200",  transition:"background-color 0.1s linear"}}
            transition="background-color 0.1s linear"
            onClick={() => callback(true)}
        >
            <Box className='squareimage_container' w="50%" mt="27%"> 
                <Image className="squareimage" src={addIcon} objectFit="cover" borderRadius="20%" />
            </Box>

            {/* QUIZ TITLE */}
            <Text fontSize={title_fontsize} textAlign="center" fontWeight="medium" wordBreak="break-word">
                Add { props.type == 1 ? "Quiz":"Platform" }
            </Text>
            
        </VStack>
    )
}