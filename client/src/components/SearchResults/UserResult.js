import { Box, Text, Image, HStack, Stack, Tag, TagLabel, useColorModeValue } from "@chakra-ui/react"
import quizImage from '../../images/defaultquiz.jpeg';
import { Link } from 'react-router-dom';

export default function UserResult( {user} ) {
    const textColor = useColorModeValue("gray.600", "gray.300")
    const hoverColor = useColorModeValue("gray.200", "gray.600")
    const bgColor = useColorModeValue("white", "gray.700")
    const borderColor = useColorModeValue("gray.300", "gray.500")

    return (
        <Link to={'/accountpage/' + user._id}>
            <HStack
                h="12vh" 
                minH="80px"
                top="50%" 
                spacing="1.5%"
                borderBottom="1px" 
                borderColor={borderColor}
                dipslay="flex" 
                alignItems="center" 
                bgColor={bgColor}
                _hover={{bgColor:hoverColor, 
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
                <Stack spacing="2" direction="column">
                    <Text fontSize="120%" fontWeight="medium"> {user.displayName}</Text>
                    <Tag w="fit-content" size="sm" variant="outline" colorScheme="gray">
                        <TagLabel> User </TagLabel>
                    </Tag>
                    {/* <Text fontSize="110%"> {platform.followers.length} Followers </Text> */}
                </Stack>
            </HStack>
        </Link>
    )
}