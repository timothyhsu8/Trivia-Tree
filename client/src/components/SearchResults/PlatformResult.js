import { Box, Text, Image, HStack, Stack, Tag, TagLabel  } from "@chakra-ui/react"
import quizImage from '../../images/defaultquiz.jpeg';
import { Link } from 'react-router-dom';

export default function PlatformResult( {platform} ) {
    console.log(platform)
    return (
        <Link to={'/platformpage/' + platform._id}>
            <HStack
                h="14vh" 
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
                {/* PLATFORM ICON */}
                <Box className='squareimage_container' w="6%" minW="60px" ml="2.8%"> 
                    <Image className="squareimage" src={platform.iconImage} fallbackSrc={quizImage} objectFit="cover" borderRadius="50%"></Image>
                </Box>

                {/* PLATFORM NAME */}
                <Stack spacing="1" direction="column">
                    <Stack spacing="0">
                        <Text fontSize="135%" fontWeight="medium"> {platform.name}</Text>
                        <Text fontSize="110%" textColor="gray.600"> {platform.followers.length} Followers </Text>
                        <Text textColor="gray.600"> {platform.description} </Text>
                    </Stack>
                    <Tag w="fit-content" size="sm" variant="outline" colorScheme="orange">
                        <TagLabel> Platform </TagLabel>
                    </Tag>
                </Stack>
            </HStack>
        </Link>
    )
}