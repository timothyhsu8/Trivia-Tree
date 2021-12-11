import React, { useEffect } from 'react';
import { useState, createRef } from 'react';
import { Radio, Input, Stack, Box, Flex, Center, Text, Grid, HStack, Button, Image, RadioGroup, useRadio, Spinner, useColorMode, Avatar, PopoverContent, PopoverCloseButton, PopoverBody, PopoverFooter, Popover, PopoverTrigger, IconButton } from "@chakra-ui/react"
import { Link, useHistory } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
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
import '../styles/postpage.css';
import { BsFillTrashFill } from 'react-icons/bs';

export default function SettingsPage(props) {
    const { user, refreshUserData } = useContext(AuthContext);
    let profileImg = 'Same Image';

    let history = useHistory();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [darkMode, setDarkMode] = useState("");
    const [iconImage, setIconImage] = useState("");
    const [initDone, setInitDone] = useState(false);
    const [updateSettings] = useMutation(mutations.UPDATE_SETTINGS, {
        context:{
            headers: {
                profileimagetype: profileImg
            }
        },
        onCompleted() {
            refreshUserData();
            // history.go(0)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });
    const [deleteUser] = useMutation(mutations.DELETE_USER, {
        onCompleted() {
            refreshUserData();
            if(colorMode=="dark"){
                toggleColorMode();
            }
            history.push('/');
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    });
     

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

    useEffect(() => {
        if (user && user === 'NoUser') {
            history.push('/loginpage');
        }
    }, [user]);

    async function saveChanges() {
        const { data } = await updateSettings({ variables: {settingInput:{userId:user._id, displayName:displayName, iconImage:iconImage, darkMode:darkMode}}});
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
    } = useQuery(GET_USER,
        (!user || user === 'NoUser') ?
        {skip: true} : {
        fetchPolicy: 'cache-and-network',
        variables: { _id: user._id },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
        onCompleted({ getUser: userData }) {
            setEmail(userData.email)
            setDisplayName(userData.displayName);
            setDarkMode(userData.darkMode);
            setIconImage(userData.iconImage);
            setInitDone(true);
        },
    });

    if (loading || !initDone) {
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
        const {data} = await deleteUser({ variables: {userId: user._id}});
        //history.push('/')
    }

    function renderDeleteButton(quiz) {
        return (
            <Popover placement='top-start'>
                <PopoverTrigger>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <Button w="fit-content" colorScheme="red" size="md">Delete Account</Button>  
                    </Box>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverCloseButton />
                    <PopoverBody>
                        Delete your account permanently?
                    </PopoverBody>
                    <PopoverFooter>
                        <Center>
                            <Button colorScheme="red" onClick={() => deleteAccount()}> Yes, Delete It </Button>
                        </Center>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        )
    }

    return(
        <Box> 
            <Center>
                {/* Main section */}
                <Grid w="50%" mt={20} templateColumns="1fr 1fr">
                    {/* Left Section */}
                    <Grid h={500} templateRows="1fr 1fr 1fr 1fr 1fr">  
                        {/* Display Name */}
                        <Text display="flex" flexDirection="column" justifyContent="center"> Display Name: </Text>

                        {/* Email */}
                        <Text display="flex" flexDirection="column" justifyContent="center"> Email: </Text>

                        {/* Theme Type */}
                        <Text display="flex" flexDirection="column" justifyContent="center"> Theme: </Text>
                            
                        {/* Profile Picture */}
                        <Text display="flex" flexDirection="column" justifyContent="center"> Profile Picture: </Text>

                        {/* Delete Account Button */}
                        { renderDeleteButton() }
                    </Grid>                  
                    

                    {/* Right Section */}
                    <Grid h={500} templateRows="1fr 1fr 1fr 1fr 1fr">
                        {/* Display Name */}
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            <Input
                                value={ displayName }
                                onChange={(e) => setDisplayName(e.target.value)}
                                borderColor="gray.300"
                                width='80%'
                            /> 
                        </Box>

                        {/* Email */}
                        <Text display="flex" flexDirection="column" justifyContent="center"> { email } </Text>

                        {/* Dark Mode */}
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            <RadioGroup onChange={(event) => updateDarkMode(event)} value={darkMode} whiteSpace="nowrap">
                                <Stack direction="row" spacing={10}>
                                    <Radio value={false}>
                                        Light Mode
                                    </Radio>
                                    <Radio value={true}>
                                        Dark Mode
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>

                        {/* Profile Picture */}
                        <HStack spacing={10}>
                            <Button
                                variant="outline"
                                _focus={{ outline: 'none' }}
                                width='fit-content'
                                borderColor="gray.300"
                                onClick={() => hiddenImageInput.current.click()}
                            >
                                Upload Image
                            </Button>
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={hiddenImageInput}
                                onChange={(event) => updateIcon(event)}
                            />
                            <Avatar maxW="80px" maxH="80px" w="auto" h="auto" borderRadius={5} src={iconImage} />
                        </HStack>

                        <Box display="flex" flexDirection="column" justifyContent="center">
                            <Button w="fit-content" colorScheme="blue" onClick={saveChanges}> Save Changes </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Center>
        </Box>
    );
}
