import { Box, Center, Text, Image, Img, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react'
import coin from '../images/coin.png'
import defaultIcon from '../images/defaultquiz.jpeg';
import { useHistory } from 'react-router-dom';
import '../styles/styles.css'
import { AuthContext } from '../context/auth';
import { useContext, useState } from 'react';

export default function ShopItemCard( props ) {
    let history = useHistory();
    const { user } = useContext(AuthContext);

    const Imgheight = "12vw"
    const w1="30vw"
    const w2="32vw"
    const w3="34vw"
    const w4="36vw"
    const offset= props.offset
    const imgArr = props.imgArr
    const borderArr = props.borderArr
    const costArr = props.costArr
    const type = props.type
    //+ platform._id
    return (
        <Box>
            
        <Image onClick={() => history.push('/previewpage/'+ user._id+'/'+type+'='+offset )}
                            /*platform={platform}
                            width="15%"
                            minWidth="200px"
                            img_height="75px"
                            char_limit={44} 
                            key={key}*/
                            width={[w1,w2,w3,w4]} height= {Imgheight} backgroundRepeat="no-repeat" backgroundSize ={[w1+" "+Imgheight,w2+" "+Imgheight,w3+" "+Imgheight,w4+" "+Imgheight]} backgroundImage={imgArr[offset]} src={borderArr[offset]} alt={"Tree Shop Banner"}/>
                            <Center><Box bg="GRAY" h="25px" w={[w1,w2,w3,w4]}>
                                    <HStack>
                                    <Text>mee</Text>
                                    <Box w={["100px","200px","230px","35vw"]}></Box>
                                    <Img src={coin} w="20px"/>
                                    <Text>{costArr[offset]}</Text>
                                </HStack>
                            </Box></Center>
    </Box>
    )
}