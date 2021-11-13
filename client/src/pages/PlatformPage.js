import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex, Input, Tooltip, HStack } from "@chakra-ui/react"
import { useMutation, useQuery } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORM } from "../cache/queries";
import { UPDATE_PLATFORM } from '../cache/mutations';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import QuizCard from "../components/QuizCard";
import { useState, createRef, useContext } from 'react';
import defaultIcon from '../images/defaultquiz.jpeg';
import '../styles/styles.css'

export default function PlatformPage({}) {
    const { user } = useContext(AuthContext);
    let { platformId } = useParams();
    
    const [following, setFollowing] = useState(false)
    const [page, setPage] = useState('platform')

    const quiz_sections = ["Best Quizzes", "Most Played Quizzes", "Geography"]

    // Fetch quiz data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platform = useQuery(GET_PLATFORM, { variables: { platformId: platformId} })

    const loading = quizzes.loading || platform.loading
    const error = quizzes.error || platform.error

    // State Variables
    let is_owner = false
    let name = "Untitled Platform"
    const [iconChanged, setIconChanged] = useState(false)
    const [icon, setIcon] = useState(null);
    const [bannerChanged, setBannerChanged] = useState(false)
    const [banner, setBanner] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const hiddenIconInput = createRef(null);
    const hiddenImageInput = createRef(null);

    // Previous state (for canceling changes)
    const [prevIcon, setPrevIcon] = useState()
    const [prevBanner, setPrevBanner] = useState()

    // Updater Functions
    function updateName(newName){
        name = newName
    }

    function updateIcon(event) {
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.split('/')[0] === 'image'
        ) {
            let img = event.target.files[0];
            let fr = new FileReader();
            fr.readAsDataURL(img);
            fr.onload = () => {
                img = fr.result;
                setIcon(img);
                setIconChanged(true)
                setUnsavedChanges(true)
            };
        }
    }

    function updateBanner(event) {
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.split('/')[0] === 'image'
        ) {
            let img = event.target.files[0];
            let fr = new FileReader();
            fr.readAsDataURL(img);
            fr.onload = () => {
                img = fr.result;
                setBanner(img);
                setBannerChanged(true)
                setUnsavedChanges(true)
            };
        }
    }

    const [updatePlatform] = useMutation(UPDATE_PLATFORM, {
        onCompleted() {
            // history.push('/');
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    // Send updated platform information to the database
    function handleUpdatePlatform() {
        let new_icon, new_banner
        iconChanged ? ( new_icon = icon ) : ( new_icon = "NoChange" )
        bannerChanged ? ( new_banner = banner ) : ( new_banner = "NoChange" )
    
        updatePlatform({
            variables: {
                platformInput: {
                    platformId: platformId,
                    name: name.trim(),
                    iconImage: new_icon,
                    bannerImage: new_banner
                },
            },
        })

        if (iconChanged)
            setPrevIcon(new_icon)

        if (bannerChanged)
            setPrevBanner(new_banner)
        
        setUnsavedChanges(false)
    }

    // Cancel icon/banner/name update
    function cancelChanges() {
        setIcon(prevIcon)
        setBanner(prevBanner)
        setUnsavedChanges(false)
    }

    // Loading Screen
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
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    // Checks if user owns (TODO: Fix this, right now it just allows editing when it determines a user is logged in. Make this specific to platform owner)
    if (user !== null && user !== "NoUser"){
        is_owner = true
    }

    // Set variables 
    const quiz_data = quizzes.data.getQuizzes
    const platform_data = platform.data.getPlatform

    if (icon === null){
        setIcon(platform_data.iconImage)
        setPrevIcon(platform_data.iconImage)
    }
    if (banner === null){
        setBanner(platform_data.bannerImage)
        setPrevBanner(platform_data.bannerImage)
    }

    name = platform_data.name

    return (
        <Box>
            {/* <Box padding="3%">
                Platform Title <Input w="20%" defaultValue={name} onChange={(e) => updateName(e.target.value)} bgColor="white" /> <br /><br />

                <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenIconInput} onChange={(event) => updateIcon(event)}/>
                <Button _focus={{ outline: 'none' }} fontSize='100%' border='1px solid' borderColor="gray.300" onClick={() => hiddenIconInput.current.click()}>
                    Upload Icon
                </Button> <br /><br />

                <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenImageInput} onChange={(event) => updateBanner(event)}/>
                <Button _focus={{ outline: 'none' }} fontSize='100%' border='1px solid' borderColor="gray.300" onClick={() => hiddenImageInput.current.click()}>
                    Upload Banner
                </Button> <br /><br />
                <Button onClick={() => handleUpdatePlatform()} bgColor="gray.800" textColor="white"> Save Changes </Button>
            </Box> */}

            <Grid templateColumns="1fr 20fr 1fr">
                <Box/>
                <Box>
                     {/* HEADER BUTTONS */}
                     <Grid w="100%" h="6vh" minH="50px" templateColumns="1fr 1fr 1fr 1fr"> 
                        <Button height="100%" fontSize="115%" bgColor="white" textColor={ page === 'platform' ? "blue" : "black" } _focus={{boxShadow:"none"}}> {platform_data.name }</Button>
                        <Button height="100%" fontSize="115%" bgColor="white" _focus={{boxShadow:"none"}}> Quizzes </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" _focus={{boxShadow:"none"}}> Leaderboard </Button>
                        <Button height="100%" fontSize="115%" bgColor="white" _focus={{boxShadow:"none"}}> Badges </Button>
                    </Grid>

                    {/* BANNER */}
                    <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenImageInput} onChange={(event) => updateBanner(event)}/> 
                        {
                            is_owner ? 
                                <Tooltip label="Edit Platform Banner" placement="bottom" fontSize="100%" bgColor="gray.800">
                                    <Box
                                        h="27vh"
                                        minH="200px"
                                        pos="relative"
                                        bgColor="gray.300"
                                        bgImage={"url('" + banner +  "')"} 
                                        bgSize="cover" 
                                        bgPosition="center"
                                        borderRadius="10"
                                        onClick={() => hiddenImageInput.current.click()}
                                        _hover={{cursor:"pointer", filter:"brightness(65%)", transition:"0.15s linear"}}
                                        transition="0.15s linear"
                                    /> 
                                </Tooltip>
                                : 
                                <Box
                                    h="27vh"
                                    minH="200px"
                                    pos="relative"
                                    bgColor="gray.300"
                                    bgImage={"url('" + banner +  "')"} 
                                    bgSize="cover" 
                                    bgPosition="center"
                                    borderRadius="10"
                                />
                        }

                    {/* PLATFORM ICON / NAME / FOLLOWERS */}
                    <VStack pos="absolute" top="18%" w="23%" spacing="-1">
                        <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenIconInput} onChange={(event) => updateIcon(event)}/> 
                        {
                            is_owner ? 
                            <Tooltip label="Edit Platform Icon" placement="top" fontSize="100%" bgColor="gray.800">
                                <Box className='squareimage_container' w="47%" minW="75px" minH="75px">
                                    <Image 
                                        className="squareimage" 
                                        src={icon} 
                                        objectFit="cover" 
                                        border="3px solid white" 
                                        borderRadius="50%" 
                                        onClick={() => hiddenIconInput.current.click()}
                                        _hover={{cursor:"pointer", filter:"brightness(65%)", transition:"0.15s linear"}}
                                        transition="0.15s linear" 
                                    />
                                </Box>
                            </Tooltip>
                            :
                            <Box className='squareimage_container' w="47%" minW="75px" minH="75px">
                                <Image 
                                    className="squareimage" 
                                    src={icon} 
                                    objectFit="cover" 
                                    border="3px solid white" 
                                    borderRadius="50%" 
                                />
                            </Box>
                        }
                        <Text fontSize="160%" fontWeight="medium" textAlign="center"> {platform_data.name} </Text>
                        <Text fontSize="110%"> {platform_data.followers.length} Followers </Text>
                    </VStack>

                    {/* FOLLOW BUTTON */}
                    {
                        following ?
                            <Button 
                                w="7%" 
                                minW="80px"
                                h="50px" 
                                mt="1%" 
                                bgColor="red.600" 
                                fontSize="120%" 
                                color="white" 
                                float="right"
                                onClick={() => setFollowing(false)}
                                _hover={{opacity:"85%"}} 
                                _active={{opacity:"75%"}} 
                                _focus={{boxShadow:"none"}}
                            > 
                                Unfollow 
                            </Button>
                            :
                            <Button 
                                w="7%" 
                                minW="80px"
                                h="50px" 
                                mt="1%" 
                                bgColor="gray.800" 
                                fontSize="120%" 
                                color="white" 
                                float="right"
                                onClick={() => setFollowing(true)}
                                _hover={{opacity:"85%"}} 
                                _active={{opacity:"75%"}} 
                                _focus={{boxShadow:"none"}}
                            > 
                                Follow 
                            </Button>
                    }

                    {/* QUIZZES */}
                    <Box mt="9%" borderTop="0.2vh solid" borderColor="gray.300">
                        {quiz_sections.map((section, key) => {
                            return (
                                <Box w="100%" borderRadius="10" overflowX="auto" key={key}>
                                    <Text pl="1.5%" pt="1%" fontSize="130%" fontWeight="medium"> {section} </Text>
                                    {/* FEATURED QUIZZES */}
                                    <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                        {quiz_data.map((quiz, key) => {
                                            return <QuizCard 
                                                quiz={quiz} 
                                                width="7.5%"
                                                title_fontsize="92%" 
                                                include_author={false}
                                                char_limit={35}  
                                                key={key}
                                                />
                                        })}
                                    </Flex>
                                    <Box bgColor="gray.300" h="0.12vh" />
                                </Box>
                        )})}
                    </Box>
                </Box>
            </Grid>

            {/* FOOTER */}
            {
                unsavedChanges ? 
                <Box w="100%" h="7vh" pos="fixed" bottom="0" bgColor="gray.200" borderTop="1px solid" borderColor="gray.300">
                    <Center>
                        <HStack position="absolute" top="50%" transform="translateY(-50%)">
                            <Button 
                                minW="100px"
                                pl="35px" 
                                pr="35px" 
                                pt="25px"
                                pb="25px"
                                fontSize="125%"
                                fontWeight="normal" 
                                bgColor="red.600" 
                                textColor="white"
                                _hover={{bgColor:"red.500"}}
                                _active={{bgColor:"red.400"}}
                                _focus={{border:"none"}}
                                onClick={() => cancelChanges()}
                            > 
                                Cancel
                            </Button>

                            <Button 
                                minW="100px"
                                pl="35px" 
                                pr="35px" 
                                pt="25px"
                                pb="25px"
                                fontSize="125%"
                                fontWeight="normal" 
                                bgColor="purple.600" 
                                textColor="white"
                                _hover={{bgColor:"purple.500"}}
                                _active={{bgColor:"purple.400"}}
                                _focus={{border:"none"}}
                                onClick={() => handleUpdatePlatform()}
                            > 
                                Save Changes 
                            </Button>
                        </HStack>
                    </Center>
                </Box> : 
                null
            }
        </Box>
    )
}