import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import { ViewIcon } from '@chakra-ui/icons'
import { BsHeart } from "react-icons/bs"
import grayBg from '../images/gray.png'
import '../styles/styles.css'

export default function UserCard( props ) {
    let history = useHistory();
    
    let user_data = props.user
    let user_displayName = user_data.displayName
    let width = props.width
    let title_fontsize = props.title_fontsize
    let icon_src = user_data.iconImage

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
            onClick={() => history.push('/accountpage/' + user_data._id)}
        >
            <Box className='squareimage_container' w="75%"> 
                <Image className="squareimage" src={icon_src} fallbackSrc={grayBg} objectFit="cover" borderRadius="50%"></Image>
            </Box>

            {/* QUIZ TITLE */}
            <Tooltip label={user_data.displayName} openDelay={350}>
                <Text fontSize={title_fontsize} textAlign="center" fontWeight="medium" wordBreak="break-word">
                    {user_displayName}
                </Text>
            </Tooltip>
        </VStack>
    )
}