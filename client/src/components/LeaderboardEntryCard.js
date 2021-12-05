import React from 'react'
import { Box, Text, Avatar, useColorModeValue, HStack } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom';
import '../styles/postpage.css';

export default function LeaderboardEntryCard(props) {
    let history = useHistory();

    /*Edit the mt/mb to change the spacing between elements */
    //Dark mode styling
    const whiteBlackText=useColorModeValue("black", "white")
    return ( 
            <Box ml="15px" mr="26px" mt="5px" mb="18px" display="flex" alignItems="center" justifyContent="space-between">
                <HStack>
                    <Text color={whiteBlackText}>{props.place}. </Text>
                    <Avatar src={props.entry.user.iconImage} size="sm"/>  
                    <Text> {props.entry.user.displayName} </Text>
                </HStack>
                
                <Text color={whiteBlackText} >{props.entry.score}</Text>
            </Box>
    )
}
