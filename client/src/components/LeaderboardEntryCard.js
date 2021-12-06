import React from 'react'
import { Box, Text, Avatar, useColorModeValue, HStack, Grid, Center } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom';
import '../styles/postpage.css';

export default function LeaderboardEntryCard(props) {
    let history = useHistory();

    /*Edit the mt/mb to change the spacing between elements */
    //Dark mode styling
    const whiteBlackText=useColorModeValue("gray.600", "white")
    return ( 
            <Grid h={12} templateColumns="0.2fr 0.40fr 0.2fr 0.2fr" borderBottom="1px" borderColor="gray.200">
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Center>
                        <Text color={whiteBlackText} fontWeight="medium"> {props.place} </Text>
                    </Center>
                </Box>
                
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <HStack spacing={3}>
                        <Avatar src={props.entry.user.iconImage} size="sm"/>  
                        <Text color={whiteBlackText} whiteSpace="nowrap" fontWeight="medium"> {props.entry.user.displayName} </Text>
                    </HStack>
                </Box>

                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Center>
                        <Text color={whiteBlackText} > 00:00:24 </Text>
                    </Center>
                </Box>

                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Center>
                        <Text color={whiteBlackText} >{props.entry.score}</Text>
                    </Center>
                </Box>
            </Grid>
    )
}
