import { Box, Flex, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react'
import defaultIcon from '../images/defaultquiz.jpeg';
import { useHistory } from 'react-router-dom';
import '../styles/styles.css'

export default function SelectPlatformCard( props ) {
    const platform = props.platform
    const width = props.width
    const minWidth = props.minWidth
    const img_height = props.img_height
    const char_limit = props.char_limit
    let setChosenPlatform = props.setChosenPlatform

    let chosen = false
    if (props.chosenPlatform === platform)
        chosen = true
   
    let platform_name = platform.name
    if (platform_name.length > char_limit)
        platform_name = platform_name.slice(0, char_limit) + "..."

    return (
        <Box 
            w={width}
            minWidth={minWidth}
            margin="1%"
            _hover={{bgColor: chosen ? "green" : "blue.100", cursor:"pointer", transition:"background-color 0.15s linear"}} 
            _active={{bgColor:"gray.200",  transition:"background-color 0.1s linear", opacity:"0.6"}}
            transition="0.10s linear"
            onClick={() => setChosenPlatform(platform)}
        >
            <Flex flexDirection="column">
                {/* MAIN IMAGE */}
                <Box
                    w="100%"
                    h="100px"
                    bgColor="gray.300"
                    bgImage={"linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(255, 255, 255, 0.25)), url('" + platform.bannerImage +  "')"} 
                    bgSize="cover" 
                    bgPosition="center"
                    borderTopRadius="10"
                />

                {/* ADDITIONAL INFO */}
                <Box 
                    pos="relative"
                    h={img_height}
                    borderBottomRadius="10"
                    bgColor={chosen ? "green":"gray.800"}
                >
                    {/* PLATFORM NAME / ICON */}
                    <Flex className="disable-select" w="100%" direction="row" position="absolute" top="8%" ml="3%">
                        {/* PLATFORM ICON */}
                        {/* <Image w="50px" h="50px" src={platform.iconImage} objectFit="cover" borderRadius="50%" border="2px solid white"></Image> */}
                        <Box className='squareimage_container' w="25%" h="25%"> 
                            <Image className="squareimage" src={platform.iconImage} fallbackSrc={defaultIcon} objectFit="cover" borderRadius="50%" border="2px solid white"></Image>
                        </Box>

                        <Flex w="100%" direction="column" ml="3%" paddingRight="5%">
                            {/* PLATFORM NAME */}
                            <Text fontSize="110%" textColor="white" fontWeight="medium" lineHeight="120%" paddingRight=""> {platform.name} </Text>
                            <Text pos="relative" mt="1%" bottom="4%" fontSize="100%" textColor="white" fontWeight="thin"> {platform.followers.length} Followers </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}