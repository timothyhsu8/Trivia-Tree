import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Center, Text, Grid, VStack, Button, Image, Badge, propNames} from "@chakra-ui/react"
import '../styles/postpage.css';

export default function LeaderboardEntryCard(props) {
    /*Edit the mt/mb to change the spacing between elements */
    return ( 
            <Box ml="15px" mr="26px" mt="5px" mb="18px" display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Text className="leaderboard_text">{props.place}.  <img src={props.entry.user.iconImage} alt="pfp" className="round_image"/>  {props.entry.user.displayName} </Text>
                </Box>
                <Text>
                    <Text className="leaderboard_text">{props.entry.score}</Text>
                </Text>
            </Box>
    )
}
