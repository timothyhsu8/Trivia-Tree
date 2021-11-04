import React from 'react';
import { useState, createRef } from 'react';
import { Radio, Input, Stack, Box, Flex, Center, Text, Grid, HStack, Button, Image, RadioGroup } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import '../styles/postpage.css';
import moon from '../images/moon.jpg';
import { useQuery } from '@apollo/client';
import * as queries from '../cache/queries';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';
import {
    useParams
} from 'react-router-dom';
import { subscribe } from 'graphql';

export default function SettingsPage() {
    let quizScore = null; 
    let logged_in = false

    let { quizId, quizAttemptId } = useParams();

    function retry() {
        return;
    }
    function saveChanges() {
        //Can check console to see that changes are effected before this printout
        console.log(username)
        console.log(darkMode)
        console.log(icon)
        return;
    }

    function updateUsername(event) {
        username = event.target.value;
    }

    function updateIcon(event) {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setIcon(URL.createObjectURL(img));
        }
    }

    /*
    const [updateSettings] = useMutation(UPDATE_SETTINGS, {
        update() {
            props.history.push('/');
        },
        onError(err) {
            console.log(err);
        },
    });
    */

/**_USer definition? 
 * id: ID!
        email: String!
        displayName: String!
        iconImage: String
        iconEffect: Item
        bannerImage: String
        bannerEffect: Item
        background: String
        bio: String
        currency: Int
        ownedBannerEffects: [Item]
        ownedBackgrounds: [Item]
        quizzesMade: [Quiz]
        quizzesTaken: [Quiz]
        platformsMade: [Platform]
        following: [Platform]
        featuredQuizzes: [Quiz]
        featuredPlatforms: [Platform]
        verified: Boolean
        admin: Boolean
        darkMode: Boolean */
   
   /*     function handleUpdateSettings() {
        updateSettings({
            variables: {
                userInput: {
                    displayName: username,
                    email: email,
                    darkMode: darkMode,
                    iconImage: icon,
                },
            },
        });
    }
*/



/*
    const [deleteAccount] = useMutation(DELETE_ACCOUNT, {
        update() {
            props.history.push('/');
        },
        onError(err) {
            console.log(err);
        },
    });
    */

 /*     function handleDeleteAccount() {
        deleteAccount({
            variables: {
                userInput: {
                    email: email
                },
            },
        });
    }
*/


    //Later on these will pull from Leaderboard for given quiz in Database
    const { user } = useContext(AuthContext);

    const [previousData, changePreviousData] = useState([
        'SBU_Fan',
        "Email?",
        "1",
        'https://yt3.ggpht.com/ytc/AKedOLTcxhIAhfigoiA59ZB6aB8z4mruPJnAoBQNd6b0YA=s900-c-k-c0x00ffffff-no-rj'
    ]);
    //Username, email, light or dark, icon_path. 

    let username = previousData[0]; //String username
    
    let email = 'Create an Account to Save your Progress!' 
    if (user !== null && user !== "NoUser"){
        logged_in = true
        username = user.googleDisplayName
        email = user.email; 
        // pfp_src = user.iconImage
    }

    const [darkMode, setDarkMode] = useState(previousData[2]); //String int

    const [icon, setIcon] = useState(previousData[3]); //String path

    const hiddenImageInput = createRef(null);

    let quizAttempt = null; 
    let quiz = null; 

    const {data, loading} = useQuery(queries.GET_QUIZ_ATTEMPT, {
        variables: { _id: quizAttemptId },
    });

    const {data:data1, loading1 } = useQuery(queries.GET_QUIZ, {
        variables: { quizId: quizId },
    });
    
    if (loading) {
        return(
            <Box height="auto">
                <h1 className="maintitle">"Loading..."</h1>
                <Box className="quizIconCentered" w="50%" h="50%">
                            <img alt="Moon" src={moon} />
                </Box>
                <h1 className="center button white">"Here's a picuture of the moon while you wait!"</h1>
                <Box h="200px">
                </Box>
            </Box>
            
       //Displays a loading screen while it waits
        );
    }
    if (loading1) {
        return(
            <Box height="auto">
                <h1 className="maintitle">"Loading..."</h1>
                <Box className="quizIconCentered" w="50%" h="50%">
                            <img alt="Moon" src={moon} />
                </Box>
                <h1 className="center button white">"Here's a picuture of the moon while you wait!"</h1>
                <Box h="200px">
                </Box>
            </Box>
            
       //Displays a loading screen while it waits
        );
    }

    if(data){
        quizAttempt = data.getQuizAttempt
        quizScore = quizAttempt.score;
        console.log(quizAttempt);
    }

    if(data1){

    }

    return(
        /*Top Title Section with hr line*/
        <Box> 
            <Box h="50px"></Box>
            <Grid templateColumns="0.4fr 13fr 0.2fr">
                <Box></Box>
                <Box className="containerDown">
                    <Text as="b" className="title" lineHeight="0" fontSize={["20px","20px","20px","30px"]}>Settings</Text>    
                    {' '}
                    {/* for horizontal line*/}
                    <br></br>
                    <hr />
                    <br></br>
                </Box>
            </Grid>

                
            
            {/*Main section*/}
            <Box className="containerAcross">     
            <Box w={["20px","20px","100px","150px"]}></Box>    
            <Grid templateColumns=" 2fr 1fr">

                {/*Main section Left*/}
                {/*Main section of Labels and Delete Account Button*/}
                {/*Main section Left*/}
                <Box>
                    {/* HEADER AND BANNER {["1000px","1000px","1000px","1000px"]}*/}
                    <Grid>
                        {/* BANNER */}
                        <Box
                            bgSize="cover" 
                            bgPosition="center"
                            borderRadius="10">
                                {/* PROFILE PICTURE AND NAME className="fadeshow1" for image?*/}
                                <div className="SecretSauce"> 
                                    <Box className="containerDown">  
                                    {/*lineHeight={["40px","40px","40px","80px"]}  fontSize={["20px","20px","20px","30px"]}*/}
                                    
                                    {/*Display Name {["250px","250px","250px","250px"]}  fontSize={["20px","20px","20px","30px"]}*/}

                                    <Text mt="5px" w={["175px","175px","200px","250px"]} fontSize={["20px","20px","20px","30px"]}>Display Name:</Text>
                                            

                                    
                                    {/*Email*/}
                                    <Box h="40px"></Box>
                                        <Text className="title"  fontSize={["20px","20px","20px","30px"]}>Email:</Text>

                                    {/*Theme Type*/}
                                    <Box h="40px"></Box>
                                    <Text className="title" fontSize={["20px","20px","20px","30px"]}>Theme:</Text>
                                        

                                    {/*Profile Picture*/}
                                    <Box h={["45px","45px","45px","35px",]}></Box>
                                    <Box className="containerAcross">  
                                        <HStack marginTop='30px' >
                                        <Text fontSize={["20px","20px","20px","30px"]} >Profile Picture:</Text>
                                        </HStack>
                                        
                                    </Box>
                                    
                                    
                                    </Box>

                                    
                                    
                                    {/*used a little absolute positioning */}
                                    
                                </div>
                                
                                <Box ></Box>

                                <Box position="absolute" bottom="0">
                                    <Box className="containerAcross">
                                                    
                                        <Box w={["200px","200px","200px","200px"]} h="50px" bg='#ff0000' borderRadius='5px'>
                                            <Link to={'/'} className="center button white" onClick={saveChanges}><Text  mt={["0px","0px","0px","0px"]} fontSize={["23px","23px","23px","23px"]}>Delete Account</Text></Link>  
                                        </Box>
                                    </Box>
                                </Box>
                        </Box>
                      
                        
                    </Grid>
                    
                </Box>




                {/*Main section Right*/}
                {/*Main section of All the Parts that Update Data and the save button*/}
                {/*Main section Right*/}
                <Box>
                <Input
                    onBlur={(event) => updateUsername(event)}
                    placeholder='Enter New Username'
                    variant='flushed'
                    borderColor='black'
                    borderBottomWidth='3px'
                    _focus={{ borderColor: 'black' }}
                    fontSize={["20px","20px","20px","30px"]}
                    height='fit-content'
                    width='80%'
                /> 

                <Box h="40px"></Box>
                <Text fontSize={["20px","20px","20px","30px"]}>{email}</Text>

                <Box h="40px"></Box>        
                <RadioGroup onChange={setDarkMode} value={darkMode}>
                    <Stack direction="row">
                        <Radio value="1" ><Text className="title" fontSize={["20px","20px","20px","30px"]}>Light Mode</Text></Radio>
                        <Radio value="2"><Text className="title" fontSize={["20px","20px","20px","30px"]}>Dark Mode</Text></Radio>
                    </Stack>
                </RadioGroup>

                <Box h="40px"></Box>
                
                <HStack marginTop='0px'>
                    {/*Stolen from the Create Quiz Page*/}
                    <Button
                        _focus={{ outline: 'none' }}
                        marginTop='10px'
                        fontSize='160%'
                        width='fit-content'
                        borderColor='black'
                        border='solid'
                        borderWidth='2px'
                        onClick={() => hiddenImageInput.current.click()}
                    >
                        <Text fontSize={["20px","20px","20px","30px"]} >Upload Image</Text>
                    </Button>
                    <input
                        type='file'
                        style={{ display: 'none' }}
                        ref={hiddenImageInput}
                        onChange={(event) => updateIcon(event)}
                    />
                    <img
                        style={{
                        maxHeight: '100px',
                        maxWidth: '100px',
                        objectFit: 'contain',
                        width: 'auto',
                        height: 'auto',
                        display: 'block',
                        }}
                        // borderRadius='20px'
                        src={icon}
                    />
                    </HStack>

                <Box h="100px"></Box>

                    <Box position="absolute" bottom="0" className="containerRight">
                        <Box className="containerAcross">
                                        
                            <Box w={["200px","200px","200px","200px"]} h="50px" bg='#165CAF' borderRadius='5px'>
                                <Link to={'/'} className="center button white" onClick={saveChanges}><Text  mt={["0px","0px","0px","0px"]} fontSize={["23px","23px","23px","23px"]}>Save Changes</Text></Link>  
                            </Box>
                            <Box w="30px"></Box>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            </Box>    

            </Box>
    );
}
