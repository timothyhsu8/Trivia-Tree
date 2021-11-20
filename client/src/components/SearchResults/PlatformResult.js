import { Box, Text, Image, HStack, Stack, Tag, TagLabel, Icon  } from "@chakra-ui/react"
import quizImage from '../../images/defaultquiz.jpeg';
import { Link } from 'react-router-dom';
import { BsFillPersonFill, BsFillFileEarmarkTextFill } from "react-icons/bs";

export default function PlatformResult( {platform} ) {
    return (
        <Link to={'/platformpage/' + platform._id}>
            <HStack
                pt={2}
                pb={2}
                minH="80px"
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
                <Box className='squareimage_container' w="5.5%" minW="55px" ml="2.8%"> 
                    <Image className="squareimage" src={platform.iconImage} fallbackSrc={quizImage} objectFit="cover" borderRadius="50%"></Image>
                </Box>

                {/* PLATFORM NAME */}
                <Stack spacing="1" direction="column" pr="2%">
                    <Stack spacing="0">
                        <Text fontSize="135%" fontWeight="medium"> {platform.name}</Text>
                        <Text fontSize="90%" textColor="gray.600"> {platform.description} </Text>
                    </Stack>
                    <HStack>
                        <Tag w="fit-content" size="sm" variant="outline" colorScheme="orange">
                            <TagLabel> Platform </TagLabel>
                        </Tag>

                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={BsFillPersonFill} color="blue.400"/> {platform.followers.length} Followers  
                        </Text>

                        <Text textColor="gray.600" fontSize="95%"> 
                            <Icon as={BsFillFileEarmarkTextFill} color="red.400"/> { platform.quizzes.length } { platform.quizzes.length !== 1 ? "Quizzes" : "Quiz" }
                        </Text>
                    </HStack>
                </Stack>
            </HStack>
        </Link>
    )
}