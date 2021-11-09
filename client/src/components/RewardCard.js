import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Center, Text, Grid, VStack, Button, Image, Badge, propNames, Flex} from "@chakra-ui/react"
import '../styles/postpage.css';
import coin from '../images/coin.png';

export default function RewardCard(props) {
    /*Assumes props.text(array),images(array),(row) position exist */
    let offset=props.position //position is which row the program is on

    const claimReward = () => {
        console.log(props.currency[offset])
    };
    function listCreator(images, title, text, currency) {
        let list = []
            list.push( /*10,26,42,58,74,90,100*/
                <Grid templateColumns="0.2fr 0.5fr 0.1fr 5fr 1fr 0.1fr">
                {/*Space to left*/}
                <Box></Box>
                {/*Makes the spacing of each section*/}
                <Box paddingY="4px" paddingX={["7.5px","7.5px","7.5px","15px"]} border="1px" mb="10px" mt="10px" w={["35.75px","54.5px","92px","182px"]}>
                    <div>
                        <div>
                            <Image w={["18.75px","37.5px","75px","150px"]} h={["18.75px","37.5px","75px","150px"]} src={images[offset]} alt="pfp" />
                        </div>
                        <Center flex="center">
            <Text fontStyle="10px">{title[offset]}</Text>
                        </Center>
                    </div>
                </Box>
                <Box></Box>
                <Flex alignSelf="center">
                    <Text align="center" fontSize={["20px","20px","25px","30px"]}>{currency[offset]}</Text>
                    <Image w={["30px","30px","40px","50px"]} h={["30px","30px","40px","50px"]} src={coin} alt="pfp" />
                    <Box w="10px"></Box>
                    <Text align="center" fontSize={["20px","20px","25px","30px"]}>{text[offset]}</Text>
                </Flex>
                <Button onClick={claimReward} className="center button white" bg='#165CAF' pos="relative" right="0" w={["100px","100px","150px","150px"]} alignSelf="center" alignContent="center">Claim</Button>
                <Box></Box>
                </Grid>
            )
        return list;
    }
            //What it returns, a row of 5 elements, 

    return ( 
            <div className="containerAcross"> 
                {listCreator(props.image, props.title, props.desc, props.currency)}
            </div>
    )
            //if you want a varied number, replace the 5 in the loop
            //with a variable and give a variable everywhere it is called instead
            //Also the template columns would need to be variable as well, but not my problem.
}
