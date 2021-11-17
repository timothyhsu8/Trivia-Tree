import { Box, Text, Image, HStack, Stack } from "@chakra-ui/react"
import quizImage from '../images/defaultquiz.jpeg';
import { Link } from 'react-router-dom';

export default function UserResult( {user} ) {
    return (
        <Link to={'/accountpage/' + user._id}>
            <HStack
                h="12vh" 
                minH="80px"
                top="50%" 
                spacing="1.5%"
                borderBottom="1px" 
                borderColor="gray.300" 
                dipslay="flex" 
                alignItems="center" 
                _hover={{bgColor:"gray.200", 
                cursor:"pointer", 
                transition:"background-color 0.2s linear"}} 
                transition="background-color 0.1s linear"
                overflow="hidden"
            >
                {/* USER ICON */}
                <Box className='squareimage_container' w="5%" minW="55px" ml="2.8%"> 
                    <Image className="squareimage" src={user.iconImage} fallbackSrc={quizImage} objectFit="cover" borderRadius="50%"></Image>
                </Box>

                {/* USER NAME */}
                <Stack spacing="0" direction="column">
                    <Text fontSize="120%" fontWeight="medium"> {user.displayName}</Text>
                    {/* <Text fontSize="110%"> {platform.followers.length} Followers </Text> */}
                </Stack>
            </HStack>
        </Link>
    )
}