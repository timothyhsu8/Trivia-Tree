import { Box, Flex, Text, Image, Icon } from '@chakra-ui/react'
import defaultIcon from '../images/defaultquiz.jpeg';
import { BsFillPersonFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import '../styles/styles.css'

export default function PlatformCard( props ) {
    let history = useHistory();

    const platform = props.platform
    const width = props.width
    const minWidth = props.minWidth
    const img_height = props.img_height
    const char_limit = props.char_limit
    let isEditing = props.isEditing ? true:false;
   
    const margin = props.margin !== undefined ? props.margin : "1%"

    let platform_name = platform.name
    if (platform_name.length > char_limit)
        platform_name = platform_name.slice(0, char_limit) + "..."

    function platformToDelete() {
        props.handleDeleteFeaturedPlatform(platform)
    }

    return (
        <Box 
            w={width}
            minWidth={minWidth}
            margin={margin}
            _hover={{cursor:"pointer", opacity:"0.8", transition:"0.15s linear"}}
            _active={{opacity:"0.6"}}
            transition="0.10s linear"
            border={isEditing ? "1px":""}
            borderColor={isEditing ? "red":""}
            onClick={isEditing ? ()=> platformToDelete():() => history.push('/platformpage/' + platform._id)}
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
                    bgColor="gray.800"
                    overflow="hidden"
                >
                    {/* PLATFORM NAME / ICON */}
                    <Flex className="disable-select" w="100%" direction="row" pl={2.5} pt={1.5} pb={2.5}>
                        {/* PLATFORM ICON */}
                        <Box className='squareimage_container' w="20%" h="25%"> 
                            <Image className="squareimage" src={platform.iconImage} fallbackSrc={defaultIcon} objectFit="cover" borderRadius="50%" border="2px solid white" />
                        </Box>

                        <Flex w="100%" direction="column" ml="3%" paddingRight="5%">
                            {/* PLATFORM NAME */}
                            <Text fontSize="110%" textColor="white" fontWeight="medium" lineHeight="120%" paddingRight=""> {platform.name} </Text>
                            <Text pos="relative" mt="1%" bottom="4%" fontSize="100%" textColor="white" fontWeight="thin"> <Icon as={BsFillPersonFill} />  {platform.followers.length} {platform.followers.length == 1 ? " Follower":" Followers"} </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}