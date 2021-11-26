import { Box, VStack, Text, Image, Spacer, Flex, HStack, Avatar } from '@chakra-ui/react'
import coin from '../../images/coin.png'
import { useHistory } from 'react-router-dom';
import '../../styles/styles.css'
import { AuthContext } from '../../context/auth';
import { useContext } from 'react';

export default function ShopItemCard( props ) {
    let history = useHistory();
    const { user } = useContext(AuthContext);
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
            onClick={() => 
                history.push({
                    pathname: '/previewpage/' + user._id + '/' + props.itemType + '=' + 0,
                    state: {
                        itemType: props.itemType,
                        item: itemData.item
                    } 
                })
            }
        >
            <Image pos="absolute" w="100%" h="20vh" src={itemData.item} fit={ props.itemType === "backgrounds" ? "cover" : "" } borderTopRadius={props.itemType === "backgrounds" ? "5" : "0"} />
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