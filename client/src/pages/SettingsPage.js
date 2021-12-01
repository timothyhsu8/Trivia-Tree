import React from 'react';
import { useState, createRef } from 'react';
import { Radio, Input, Stack, Box, Flex, Center, Text, Grid, HStack, Button, Image, RadioGroup, useRadio, Spinner, useColorMode } from "@chakra-ui/react"
import { Link, useHistory } from 'react-router-dom';
import '../styles/postpage.css';
import moon from '../images/moon.jpg';
import { useQuery, useMutation } from '@apollo/client';
import { GET_QUIZZES, GET_USER } from '../cache/queries';
import * as mutations from '../cache/mutations';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';
import {
    DELETE_USER
} from '../cache/mutations';
import {
    useParams
} from 'react-router-dom';
import { subscribe } from 'graphql';

export default function SettingsPage(props) {
    const { user, refreshUserData } = useContext(AuthContext);
    let profileImg = 'Same Image';

    let {userId} = useParams();
    let history = useHistory();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [darkMode, setDarkMode] = useState("");
    const [iconImage, setIconImage] = useState("");
    const [updateSettings] = useMutation(mutations.UPDATE_SETTINGS, {
        context:{
            headers: {
                profileimagetype: profileImg
            }
        },
        onCompleted() {
            refreshUserData();
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });
    const [deleteUser] = useMutation(mutations.DELETE_USER);
     

    const hiddenImageInput = createRef(null);


    const { colorMode, toggleColorMode } = useColorMode()
    function initialDark(){
        if(darkMode==true && colorMode=="light"){
            toggleColorMode()
        }
        if(darkMode==false && colorMode=="dark"){
            toggleColorMode()
        }
    }

    async function saveChanges() {
        const {data} = await updateSettings({ variables: {settingInput:{userId:userId, displayName:displayName, iconImage:iconImage, darkMode:darkMode}}});
        initialDark()
        return;
    }

    function updateDisplayName(event) {
        setDisplayName(event.target.value);
    }

    function updateDarkMode(event) {
        if(event == "true"){
            setDarkMode(true)
        }
        else{
            setDarkMode(false)
        }
    }

    function updateIcon(event) {
        // if (event.target.files && event.target.files[0]) {
        //     let img = event.target.files[0];
        //     setIconImage(URL.createObjectURL(img));
        // }
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.split('/')[0] === 'image'
        ) {
            let tempImg = event.target.files[0];
            let fr = new FileReader();
            fr.readAsDataURL(tempImg);
            fr.onload = () => {
                tempImg = fr.result;
                profileImg = 'New Image';
                setIconImage(tempImg);
            };
        }
    }


    const {
        loading,
        error,
        data: { getUser: userData } = {},
    } = useQuery(GET_USER, {
        fetchPolicy: 'cache-and-network',
        variables: { _id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
        onCompleted({ getUser: userData }) {
            setEmail(userData.email)
            setDisplayName(userData.displayName);
            setDarkMode(userData.darkMode);
            setIconImage(userData.iconImage);
        },
    });

    if (loading) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    // Error Screen
    if (error) {
        return (
            <Center>
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                    Sorry, something went wrong{' '}
                </Text>
            </Center>
        );
    }
    
    async function deleteAccount() {
        console.log(userData._id)
        const {data} = await deleteUser({ variables: {userId:userId}});
        //history.push('/')
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
                                    <Button w="200px" h="50px" borderRadius='5px' onClick={deleteAccount}>Delete Account</Button>  
                                </Box>
                        </Box>
                      
                        
                    </Grid>
                    
                </Box>




                {/*Main section Right*/}
                {/*Main section of All the Parts that Update Data and the save button*/}
                {/*Main section Right*/}
                <Box>
                <Input
                    onBlur={(event) => updateDisplayName(event)}
                    placeholder={displayName}
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
                <RadioGroup onChange={(event) => updateDarkMode(event)} value={darkMode}>
                    <Stack direction="row">
                        <Radio value={false} ><Text className="title" fontSize={["20px","20px","20px","30px"]}>Light Mode</Text></Radio>
                        <Radio value={true}><Text className="title" fontSize={["20px","20px","20px","30px"]}>Dark Mode</Text></Radio>
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
                        src={iconImage}
                    />
                    </HStack>

                <Box h="100px"></Box>

                    <Box position="absolute" bottom="0" className="containerRight">
                        <Box className="containerAcross">
                                        
                            <Box w={["200px","200px","200px","200px"]} h="50px" bg='#165CAF' borderRadius='5px'>
                                <Link to='/' className="center button white" onClick={saveChanges}><Text  mt={["0px","0px","0px","0px"]} fontSize={["23px","23px","23px","23px"]}>Save Changes</Text></Link>  
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
