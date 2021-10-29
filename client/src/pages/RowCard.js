import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Center, Text, Grid, VStack, Button, Image, Badge, propNames, Flex} from "@chakra-ui/react"
import '../styles/postpage.css';

export default function RowCard(props) {
    /*Assumes props.text(array),images(array),(row) position exist */
    let offset=props.position*5 //position is which row the program is on
    function listCreator(images, text) {
        let list = []
        for(let i=0;i<5;i++) {
            list.push( /*10,26,42,58,74,90,100*/
                <Grid templateColumns="3fr 1fr 1fr 1fr 1fr">
                {/*Space to left*/}
                <Box></Box>
                {/*Makes the spacing of each section*/}
                <Box w={["18.75px","37.5px","75px","150px"]}>
                    <div >
                        <div>
                            <Image w={["18.75px","37.5px","75px","150px"]} h={["18.75px","37.5px","75px","150px"]} src={images[i+offset]} alt="pfp" />
                        </div>
                        <Center flex="center">
                            <Text fontStyle="10px">{text[i+offset]}</Text>
                        </Center>
                    </div>
                </Box>
                </Grid>
            )
        }
        return list;
    }
            //What it returns, a row of 5 elements, 

    return ( 
            <div className="containerAcross"> 
                {listCreator(props.image, props.title)}
            </div>
    )
            //if you want a varied number, replace the 5 in the loop
            //with a variable and give a variable everywhere it is called instead
            //Also the template columns would need to be variable as well, but not my problem.
}
