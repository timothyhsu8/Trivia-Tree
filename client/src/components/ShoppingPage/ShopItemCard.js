import { Box, VStack, Text, Image, Spacer, Flex, HStack, Avatar, useColorModeValue } from '@chakra-ui/react'
import coin from '../../images/coin.png'
import '../../styles/styles.css'

export default function ShopItemCard( props ) {
    
    const itemData = props.item
    const isOwned = props.isOwned

    const bgColor = useColorModeValue("white", "gray.700")

    return (
        <VStack 
            pos="relative"
            bgColor={bgColor}
            w="82%"
            mt={5}
            spacing={0}
            transition=".1s linear"
            _hover={{ cursor: !isOwned ? "pointer" : null, opacity: !isOwned ? "85%" : null, transition:".15s linear" }} 
            _active={{ opacity: !isOwned ? "75%" : null }}
            onClick={() => !isOwned ? props.callback(itemData) : null}
        >   
            <Image pos="absolute" w={ props.item.type !== "iconEffect" ? "100%" : null } h="20vh" src={itemData.item} fit={itemData.type === "background" ? "cover" : "" } borderTopRadius={itemData.type === "background" ? "5" : "0"} />
            <Image w="100%" h="20vh" fit="cover" borderTopRadius={5} src={itemData.template} /> 
            <Flex w="100%" h={10} borderBottomRadius={5} boxShadow="md">
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <HStack>
                        <Text pl={3} fontWeight="medium"> { itemData.name } </Text>
                        <Text pl={3} fontWeight="medium" color="green.500"> { isOwned ? "OWNED" : null } </Text>
                    </HStack>
                </Box>
                <Spacer />
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <HStack overflow="hidden">
                        <Avatar size="xs" src={coin}/>
                        <Text pr={3}> { itemData.price } </Text>
                    </HStack>
                </Box>
            </Flex>
        </VStack>
    )
}