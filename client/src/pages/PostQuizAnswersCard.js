import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Center, Text, Grid, VStack, Button, Image, Badge, propNames} from "@chakra-ui/react"
import moon from '../images/moon.jpg'
import heart from '../images/heart.jpeg'
import '../styles/postpage.css';

export default function PostQuizAnswersCard(props) {
    const [showDetails, setShowDetails] = React.useState(false)
    const onClickDetails = () => {setShowDetails(!showDetails);}
    var color = '#DB7769'
    if(props.correct){
        color = '#90CC7B'
    }
    /*Edit the mt/mb to change the spacing between elements */
    return ( 
        <Box className="containerAcross">
            { showDetails ? 
                <Box ml="15px" mt="10px" mb="26px">
                <img src={heart} alt="Right Pointing Arrow" className="round_image" onClick={onClickDetails}/>
                </Box>
            : 
                <Box ml="15px" mt="10px" mb="26px">
                <img src={moon} alt="Down Pointing Arrow" className="round_image" onClick={onClickDetails}/>
                </Box>
            
            }
            
            <Box ml="15px" mr="26px" mb="26px" display="flex" alignItems="center" justifyContent="space-between" className="containerDown">
                <Box w = "850px" h="45px" bg={color} >  {/* Gradebox */}
                    <h2 className="answer_text">{props.place}.   {props.name} </h2>
                </Box>


                { showDetails ? 
                <Box w = "850px" h="200px" bg='#D3D3D3' >  {/* Gradebox */}
                    <h2 className="answer_text">{props.place}.   {props.name} </h2>
                </Box>
                : null}

            </Box>
        </Box>
        
    )
}
