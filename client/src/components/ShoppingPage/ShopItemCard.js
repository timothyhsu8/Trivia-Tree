import { Box, VStack, Text, Image, Spacer, Flex, HStack, Avatar } from '@chakra-ui/react'
import coin from '../../images/coin.png'
import '../../styles/styles.css'

export default function ShopItemCard( props ) {
    const itemData = props.item

    return (
        <VStack 
            pos="relative"
            w="75%"
            mt={5}
            spacing={0}
            transition=".1s linear"
            _hover={{cursor:"pointer", opacity:"85%", transition:".15s linear"}} 
            _active={{opacity:"75%"}}
            onClick={() => props.callback(itemData)}
        >
            <Image pos="absolute" w="100%" h="20vh" src={itemData.item} fit={itemData.type === "background" ? "cover" : "" } borderTopRadius={itemData.type === "background" ? "5" : "0"} />
            <Image w="100%" h="20vh" fit="cover" borderTopRadius={5} src={itemData.template} /> 
            <Flex w="100%" h={10} borderBottomRadius={5} boxShadow="md">
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Text pl={3}> { itemData.name } </Text>
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