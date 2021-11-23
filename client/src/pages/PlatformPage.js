import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex, Input, Tooltip, HStack, Textarea, Icon, Select, Tag, TagLeftIcon, TagLabel,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import { useMutation, useQuery } from '@apollo/client';
import { GET_PLATFORM } from "../cache/queries";
import { UPDATE_PLATFORM, ADD_QUIZ_TO_PLATFORM, DELETE_PLATFORM, FOLLOW_PLATFORM, UNFOLLOW_PLATFORM, ADD_QUIZ_TO_PLAYLIST } from '../cache/mutations';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import QuizCard from "../components/QuizCard";
import { useState, createRef, useContext, useRef } from 'react';
import '../styles/styles.css'
import AddQuizCard from "../components/AddQuizCard";
import SelectQuizCard from "../components/SelectQuizCard"
import UserCard from "../components/UserCard"
import { BsFillFileEarmarkTextFill, BsFillHouseDoorFill, BsFillInfoCircleFill, BsFillPersonFill } from "react-icons/bs";
import { AddIcon } from '@chakra-ui/icons'
import { useAlert } from 'react-alert';

export default function PlatformPage({}) {
    const { user } = useContext(AuthContext);
    const cancelRef = useRef()
    const alert = useAlert();
    const [page, setPage] = useState('Platform')
    const [following, setFollowing] = useState(false)
    const maxPlatformName = 35
    const maxPlaylistName = 50
    const maxDescription = 250

    let history = useHistory();
    let { platformId } = useParams();

    // Fetch quiz data from the backend
    const platform = useQuery(GET_PLATFORM, { variables: { platformId: platformId}, onCompleted() {
        for(let i = 0; i < platform.data.getPlatform.followers.length; i++){
            if(user !== null && platform.data.getPlatform.followers[i]._id === user._id){
                setFollowing(true)
            }
        }         
    } })


    const loading = platform.loading
    const error = platform.error

    // State Variables
    let is_owner = false
    const [name, setName] = useState(null)
    const [editName, setEditName] = useState(false)
    const [iconChanged, setIconChanged] = useState(false)
    const [icon, setIcon] = useState(null);
    const [bannerChanged, setBannerChanged] = useState(false)
    const [banner, setBanner] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [editDescription, setEditDescription] = useState(false)
    const [description, setDescription] = useState(null)
    const [isAddingQuiz, setIsAddingQuiz] = useState(
        {
            adding: false,
            type: null
        }
    )
    const [chosenQuiz, setChosenQuiz] = useState(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [creatingPlaylist, setCreatingPlaylist] = useState(false)
    const [chosenPlaylist, setChosenPlaylist] = useState(null)
    const [chosenPlaylistName, setChosenPlaylistName] = useState('')
    const hiddenIconInput = createRef(null);
    const hiddenImageInput = createRef(null);
    

    // Updates the icon without saving it to the database
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

    // Updates the banner without saving it to the database
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

    // Sends the updated platform information to the database
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
                    bannerImage: new_banner,
                    description: description
                },
            },
        })

        setUnsavedChanges(false)
    }

    // Sends the selected quiz to the database and adds it to the platform
    const [addQuizToPlatform] = useMutation(ADD_QUIZ_TO_PLATFORM, {
        onCompleted() {
            history.go(0)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })

    const [addQuizToPlaylist] = useMutation(ADD_QUIZ_TO_PLAYLIST, {
        onCompleted() {
            history.go(0)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })

    const [followPlatform] = useMutation(FOLLOW_PLATFORM, {
        onCompleted() {
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })

    const [unfollowPlatform] = useMutation(UNFOLLOW_PLATFORM, {
        onCompleted() {
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })

    // Finish selecting quiz and send added quiz to database, closes add quiz menu
    function handleAddQuizToPlatform(destination) {
        if (chosenQuiz !== null){
            // Adding quiz to the platform as a whole
            if (destination === "platform") {
                for (let i = 0; i < platform_data.quizzes.length; i++)
                    if (platform_data.quizzes[i]._id === chosenQuiz._id) {
                        alert.show('Quiz already exists on this platform')
                        setIsAddingQuiz( { adding: false, type: null })
                        setChosenQuiz(null)
                        setChosenPlaylist(null)
                        return
                    }
                    
                addQuizToPlatform({
                    variables: {
                        platformId: platform_data._id,
                        quizId: chosenQuiz._id
                    },
                })
            }

            // Adding quiz to an individual playlist
            if (destination === "playlist") {
                for (let i = 0; i < chosenPlaylist.quizzes.length; i++)
                    if (chosenPlaylist.quizzes[i]._id === chosenQuiz._id) {
                        alert.show('Quiz already exists in this playlist')
                        setIsAddingQuiz( { adding: false, type: null })
                        setChosenQuiz(null)
                        setChosenPlaylist(null)
                        return
                    }

                addQuizToPlaylist({
                    variables: {
                        platformId: platform_data._id,
                        playlistId: chosenPlaylist._id,
                        quizId: chosenQuiz._id
                    },
                })
            }
        }
        setIsAddingQuiz( { adding: false, type: null })
        setChosenQuiz(null)
        setChosenPlaylist(null)
    }

    // Deletes platform
    const [deletePlatform] = useMutation(DELETE_PLATFORM, {
        onCompleted() {
            history.push('/');
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    // Button event to delete a platform
    function handleDeletePlatform() {
        setDeleteConfirmation(false)
        deletePlatform({
            variables: {
                platformId: platformId,
            },
        })
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
        console.log(error)
        
        return (
            <Center>
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    // Set variables 
    const quiz_data = platform.data.getPlatform.quizzes
    const platform_data = platform.data.getPlatform
    console.log(platform_data)

    if (icon === null) {
        setIcon(platform_data.iconImage)
    }
    if (banner === null) {
        setBanner(platform_data.bannerImage)
    }

    if (name === null) {
        setName(platform_data.name)
    }

    if (description === null) {
        setDescription(platform_data.description)
    }

    // Checks if user owns
    if (user !== null && user !== "NoUser" && user._id === platform_data.user._id){
        is_owner = true
    }

    let header_sections = [
        {
            name: "Quizzes",
            icon: BsFillFileEarmarkTextFill
        },
        {
            name: "Followers",
            icon: BsFillPersonFill
        }, 
        {
            name: "About",
            icon: BsFillInfoCircleFill
        }, ]

    // Cancel icon/banner/name update
    function cancelChanges() {
        setIcon(platform_data.iconImage)
        setBanner(platform_data.bannerImage)
        setUnsavedChanges(false)
    }

    function renderPage() {
        if (page === 'Platform') 
            return renderPlatform()
        if (page === 'Quizzes') 
            return renderQuizzes()
        if (page === 'Followers') 
            return renderFollowers()
        if (page === 'About') 
            return renderAbout()
    }

    async function setFollowPlatform(){
        await followPlatform({
            variables: {
                platformId: platform_data._id,
                userId: user._id
            },
        })
        setFollowing(true);
        platform.refetch()
    }

    async function setUnfollowPlatform(){
        await unfollowPlatform({
            variables: {
                platformId: platform_data._id,
                userId: user._id
            },
        })
        setFollowing(false);
        platform.refetch()
    }

    function renderPlatform() {
        return (
            <Box>
                {/* BANNER */}
                <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenImageInput} onChange={(event) => updateBanner(event)}/> 
                    <Box h="30vh">
                        {
                            is_owner ? 
                                <Tooltip label="Edit Platform Banner" placement="bottom" fontSize="100%" bgColor="gray.800">
                                    <Box
                                        h="27vh"
                                        minH="150px"
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
                                    minH="150px"
                                    pos="relative"
                                    bgColor="gray.300"
                                    bgImage={"url('" + banner +  "')"} 
                                    bgSize="cover" 
                                    bgPosition="center"
                                    borderRadius="10"
                                />
                        }
                        {/* FOLLOW BUTTON */}
                        {
                            following ?
                                <Button 
                                    size="lg"
                                    colorScheme="red"
                                    mt={4}
                                    float="right"
                                    display={is_owner ? 'none' : ''}
                                    onClick={setUnfollowPlatform}
                                    _focus={{boxShadow:"none"}}
                                > 
                                    Unfollow 
                                </Button>
                                :
                                <Button 
                                    size="lg"
                                    bgColor="gray.800" 
                                    color="white"
                                    mt={4} 
                                    float="right"
                                    display={is_owner ? 'none':''}
                                    onClick={setFollowPlatform}
                                    _hover={{opacity:"85%"}} 
                                    _active={{opacity:"75%"}} 
                                    _focus={{boxShadow:"none"}}
                                > 
                                    Follow 
                                </Button>
                        }
                         {/* PLATFORM ICON / NAME / FOLLOWERS */}
                        <VStack pos="relative" top="-120" w="23%" spacing="-1">
                            <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenIconInput} onChange={(event) => updateIcon(event)}/> 
                            {
                                // If user is owner, they can edit the platform icon
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
                                // If user is not owner, they cannot edit the platform icon
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
                            
                            {/* Platform Name */}
                            {
                                is_owner ? 
                                <Tooltip label="Edit Platform Name" placement="bottom" fontSize="100%" bgColor="gray.800">
                                    <Text 
                                        fontSize="160%" 
                                        fontWeight="medium"
                                        transition=".1s linear"
                                        borderRadius="10px" 
                                        padding="10px"
                                        whiteSpace="nowrap"
                                        _hover={{bgColor:"gray.200", transition:".15s linear", cursor:"pointer"}} 
                                        onClick={() => { setEditName(true) }}
                                    >
                                        {platform_data.name} 
                                    </Text>
                                </Tooltip>
                                :
                                <Text 
                                    fontSize="160%" 
                                    fontWeight="medium"
                                    transition=".1s linear"
                                    borderRadius="10px" 
                                    padding="10px" 
                                    overflow="hidden"
                                >
                                    {platform_data.name} 
                                </Text>
                            }
                            {/* Edit Platform Name */}
                            {
                                editName ?
                                    <Box w="100%">
                                        {/* Save platform name edit */}
                                        <Input value={name} maxLength={maxPlatformName} onChange={(event) => setName(event.target.value)} borderColor="gray.400"/>
                                        <Box h={30}>
                                            <Text float="right" fontSize="90%" color={ name.length === maxPlatformName ? "red.500" : "gray.800" }> { name.length }/{ maxPlatformName } </Text>
                                        </Box>
                                        <Button 
                                            mt="1%" 
                                            ml="1.5%" 
                                            float="right" 
                                            bgColor="gray.800" 
                                            textColor="white" 
                                            _hover={{bgColor:"gray.700"}} 
                                            _active={{bgColor:"gray.600"}} 
                                            _focus={{border:"none"}}
                                            onClick={
                                                () => {
                                                    handleUpdatePlatform()
                                                    setEditName(false)
                                                }
                                            }
                                        >
                                            Save
                                        </Button>

                                        {/* Cancel platform name edit */}
                                        <Button 
                                            mt="1%" 
                                            float="right" 
                                            bgColor="red.600" 
                                            textColor="white" 
                                            _hover={{bgColor:"red.500"}} 
                                            _active={{bgColor:"red.400"}}
                                            _focus={{border:"none"}} 
                                            onClick={
                                                () => {
                                                    setName(platform_data.name)
                                                    setEditName(false)
                                                }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                        :
                                    null
                            }

                            <Text fontSize="110%"> {platform.data.getPlatform.followers.length} {platform.data.getPlatform.followers.length == 1 ? "Follower":"Followers"} </Text>
                        </VStack>
                    </Box>
                        
                <Box mt="7%"/>

                {/* CREATE NEW PLAYLIST BUTTON */}
                {
                    is_owner ?
                    <Box h={5} mb={3}>
                        <Tag className="disable-select" float="right" mr={2} variant="subtle" colorScheme="cyan"
                            _hover={{cursor:"pointer", opacity:"85%"}}
                            onClick={() => setCreatingPlaylist(true)}
                            >
                            <TagLeftIcon as={AddIcon} />
                            <TagLabel> Create New Playlist </TagLabel>
                        </Tag>
                    </Box>
                    :
                    null
                }

                <Box h="0.4px" bgColor="gray.300" />
                

                {/* ADD QUIZ TO PLATFORM BUTTON */}
                {/* {is_owner ? 
                    <Button colorScheme="purple" onClick={() => setIsAddingQuiz({ adding: true, type: "platform"  })}> 
                        ADD QUIZ
                    </Button>
                    :
                    null
                } */}
                {/* QUIZ SECTIONS */}
                <Box>
                    {platform_data.playlists.map((playlist, key) => {
                        return (
                            <Box w="100%" borderRadius="10" overflowX="auto" key={key}>
                                <HStack>
                                    <Text pl="1.5%" pt="1%" fontSize="130%" fontWeight="medium"> {playlist.name} </Text>
                                    {/* Card for adding a quiz, if platform owner is viewing */}
                                    {is_owner ? 
                                        <Tag className="disable-select" variant="subtle" colorScheme="orange"
                                            _hover={{cursor:"pointer", opacity:"85%"}}
                                            onClick={() => {
                                                setIsAddingQuiz({ adding: true, type: "playlist" })
                                                setChosenPlaylist(playlist)
                                            }}> 
                                            <TagLeftIcon as={AddIcon} />
                                            <TagLabel> Add Quiz </TagLabel>
                                        </Tag>
                                        :
                                        null
                                    }
                                </HStack>
                                <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                    {/* QUIZ CARDS */}
                                    {playlist.quizzes.slice(0).reverse().map((quiz, key) => {
                                        return <QuizCard 
                                            quiz={quiz} 
                                            width="7.5%"
                                            title_fontsize="92%" 
                                            include_author={false}
                                            char_limit={35}  
                                            key={key}
                                            is_owner={is_owner}
                                            platform_id={platform_data._id}
                                        />
                                    })}
                                </Flex>
                                <Box bgColor="gray.300" h="0.12vh" />
                            </Box>
                    )})}
                    <Box h="15vh" />
                </Box>
            </Box>
        )
    }

    function renderAbout() {
        return (
            <Box>
                {/* PLATFORM ICON / NAME / FOLLOWERS */}
                <Center>
                    <VStack w="40%" minW="350px" spacing="2%" mt="3%" padding="3%" border="1px solid" borderColor="gray.400" borderRadius="20px"> 
                        <input type='file' accept='image/*' style={{ display: 'none' }} ref={hiddenIconInput} onChange={(event) => updateIcon(event)}/> 
                        {
                            // If user is owner, they can edit the platform icon
                            is_owner ? 
                            <Tooltip label="Edit Platform Icon" placement="top" fontSize="100%" bgColor="gray.800">
                                <Box className='squareimage_container' w="25%" minW="75px" minH="75px">
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
                            // If user is not owner, they cannot edit the platform icon
                            <Box className='squareimage_container' w="25%" minW="75px" minH="75px">
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
                        
                        {/* Platform Misc. Information (# Followers, # Quizzes, etc.) */}
                        <HStack spacing={4}>
                            <Text fontSize="120%"> 
                                <Icon as={BsFillPersonFill} mr={1} /> 
                                { platform_data.followers.length !== 1 ? platform_data.followers.length + " Followers" : "1 Follower"  } 
                            </Text>
                            <Text fontSize="120%"> 
                                <Icon as={BsFillFileEarmarkTextFill} mr={1} /> 
                                { platform_data.quizzes.length } { platform_data.quizzes.length !== 1 ? "Quizzes" : "Quiz" }
                            </Text>
                        </HStack>
                        
                        {/* Platform Description */}
                        {
                            is_owner ? 
                            <Tooltip label="Edit Platform Description" placement="bottom" fontSize="100%" bgColor="gray.800">
                                <Text 
                                    fontSize="110%" 
                                    transition=".1s linear"
                                    borderRadius="10px" 
                                    padding="10px"
                                    _hover={{bgColor:"gray.200", transition:".15s linear", cursor:"pointer"}} 
                                    onClick={
                                        () => { setEditDescription(true) }}
                                    >
                                    {description}
                                </Text>
                            </Tooltip>
                            :
                            <Text 
                                fontSize="110%" 
                                transition=".1s linear"
                                borderRadius="10px" 
                                padding="10px" 
                            >
                                {description}
                            </Text>
                        }

                        {/* Platform Description */}
                        {
                            editDescription ?
                                <Box w="100%">
                                    {/* Save platform description edit */}
                                    <Textarea h="15vh" value={description} onChange={(event) => setDescription(event.target.value)} borderColor="gray.400" maxLength={maxDescription}/>
                                    <Box h={30}>
                                        <Text float="right" fontSize="85%" color={description.length === maxDescription ? "red.500" : "gray.800"} > 
                                            {description.length}/{maxDescription} 
                                        </Text>
                                    </Box>
                                    <Button 
                                        mt="1%" 
                                        ml="1.5%" 
                                        float="right" 
                                        bgColor="gray.800" 
                                        textColor="white" 
                                        _hover={{bgColor:"gray.700"}} 
                                        _active={{bgColor:"gray.600"}} 
                                        _focus={{border:"none"}}
                                        onClick={
                                            () => {
                                                handleUpdatePlatform()
                                                setEditDescription(false)
                                            }
                                        }
                                    >
                                        Save
                                    </Button>

                                     {/* Cancel platform description edit */}
                                    <Button 
                                        mt="1%" 
                                        float="right" 
                                        bgColor="red.600" 
                                        textColor="white" 
                                        _hover={{bgColor:"red.500"}} 
                                        _active={{bgColor:"red.400"}}
                                        _focus={{border:"none"}} 
                                        onClick={
                                            () => {
                                                setDescription(platform_data.description)
                                                setEditDescription(false)
                                            }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                                    :
                                null
                        }
                    </VStack>
                </Center>
                {/* Delete Platform Button */}
                {
                    is_owner ? 
                        <Center>
                                <Button 
                                    mt="5%" 
                                    bgColor="red.600" 
                                    textColor="white" 
                                    _hover={{bgColor:"red.500"}} 
                                    _active={{bgColor:"red.400"}}
                                    _focus={{border:"none"}} 
                                    onClick={() => setDeleteConfirmation(true)}
                                    >
                                    Delete Platform
                                </Button>
                                
                                <AlertDialog
                                    isOpen={deleteConfirmation}
                                    leastDestructiveRef={cancelRef}
                                    onClose={() => setDeleteConfirmation(false)}
                                >
                                    <AlertDialogOverlay>
                                        <AlertDialogContent top="30%">
                                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                Delete Platform
                                            </AlertDialogHeader>

                                            <AlertDialogBody>
                                                Are you sure you want to delete this platform? This action cannot be undone
                                            </AlertDialogBody>

                                            <AlertDialogFooter>
                                            <Button ref={cancelRef} onClick={() => setDeleteConfirmation(false)} _focus={{border:"none"}}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme="red" onClick={() => handleDeletePlatform()} ml={3} _focus={{border:"none"}}>
                                                Delete
                                            </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialogOverlay>
                                </AlertDialog>
                        </Center>
                    :
                    null
                }
            </Box>
        )
    }

    function renderFollowers() {
        return (
            <Box bgColor='gray.200' borderRadius='10'>
                <Text pl='1.5%'  fontSize='1.2vw' fontWeight='bold'>
                    Followers ({platform.data.getPlatform.followers.length})
                </Text>
                <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
                    {platform.data.getPlatform.followers.map((user, key) => {
                        return (
                            <UserCard 
                            user={user} 
                            width="7.7%" 
                            title_fontsize="100%" 
                            author_fontsize="90%" 
                            include_author={true}
                            char_limit={30} 
                            key={key}
                        />
                        );
                    })}
                </Flex>
            </Box>
        );
    }

    function renderQuizzes() {
        return (
            <Box>
                <Box borderBottom="1px solid" borderColor="gray.300">
                    <HStack padding={2}>
                        <Text> Sort By: </Text>
                        <Select w="fit-content" size="md" variant="outline">
                            <option value="none"> Newest </option>
                            <option value="popular"> Most Popular </option>
                            <option value="sort_abc">Alphabetical [A-Z]</option>
                        </Select>
                    </HStack>
                </Box>
                <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
                    {platform_data.quizzes.map((quiz, key) => {
                        return (
                            <QuizCard
                                quiz={quiz}
                                width='7.5%'
                                title_fontsize='95%'
                                include_author={false}
                                char_limit={35}
                                key={key}
                            />
                        );
                    })}
                </Flex>
            </Box>
        )
    }

    return (
        <Box>
            {/* Darken screen and allow user to select quiz to add to the platform */}
            {
                isAddingQuiz.adding ? 
                    <Box position="fixed" w="100%" h="100vh" zIndex="1" bgColor="rgba(0, 0, 0, 0.9)" transition="0.2s linear"> 
                       {/* QUIZ CARDS */}
                            <Flex mt="0.5%" ml="1%" spacing="4%" display="flex" flexWrap="wrap">
                                {platform_data.user.quizzesMade.map((quiz, key) => {
                                    return <SelectQuizCard
                                        key={key}
                                        quiz={quiz} 
                                        width="7.5%"
                                        title_fontsize="92%" 
                                        include_author={false}
                                        char_limit={35}  
                                        font_color="white"
                                        show_stats={false}
                                        chosenQuiz={chosenQuiz}
                                        setChosenQuiz={setChosenQuiz}
                                        />
                                })}
                            </Flex>
                        
                        {/* Selecting a quiz to add to the platform */}
                        <HStack w="100%" spacing="1%" pos="fixed" bottom="3%" right="-83%">
                            {/* Cancel Selecting a quiz */}
                            <Button size="lg" bgColor="gray.500" textColor="white" pt="1.3%" pb="1.3%" pl="1.5%" pr="1.5%" _hover={{bgColor:"gray.600"}}  _focus={{border:"none"}}
                                onClick={() => {
                                    setIsAddingQuiz({ adding: false, type: null })
                                    setChosenQuiz(null)
                                    setChosenPlaylist(null)
                                }}>
                                Cancel
                            </Button>

                            {/* Finish selecting a quiz */}
                            <Button size="lg" textColor="white" pt="1.3%" pb="1.3%" pl="1.5%" pr="1.5%"
                                bgColor={chosenQuiz !== null ? "blue.400" : "gray.400"} 
                                _hover={{bgColor: chosenQuiz !== null ? "blue.300" : "gray.400"}}
                                _active={{bgColor: chosenQuiz !== null ? "blue.200" : "gray.400"}}
                                _focus={{border:"none"}}
                                onClick={() => chosenQuiz !== null ? handleAddQuizToPlatform(isAddingQuiz.type) : null}>
                                Finish
                            </Button>
                        </HStack>
                    </Box>
                    :
                    null
            }    


            {/* RENDER FULL PAGE */}
            <Grid templateColumns="1fr 20fr 1fr">
                <Box/>
                <Box>
                    {/* HEADER BUTTONS */}
                    <Grid w="100%" h="6vh" minH="50px" templateColumns="1fr 1fr 1fr 1fr" justifyContent="center" alignItems="center"> 

                        <Text 
                            className="disable-select" 
                            fontSize="125%" textColor={page === "Platform" ? "blue.500" : "gray.1000" } 
                            textAlign="center" 
                            _hover={{ cursor:"pointer", textColor: page === "Platform" ? "blue.500" : "gray.500", transition:"0.15s linear" }} 
                            transition="0.1s linear" 
                            onClick={() => setPage('Platform')} 
                            whiteSpace="nowrap"
                        >
                            <Icon as={BsFillHouseDoorFill} pos="relative" top={-0.5}  mr={2} />
                            {platform_data.name}
                        </Text>

                        {header_sections.map((section, key) => {
                            return (
                                <Text key={key} 
                                    className="disable-select" 
                                    fontSize="125%" 
                                    textColor={page === section.name ? "blue.500" : "gray.1000" } 
                                    textAlign="center" 
                                    _hover={{ cursor:"pointer", textColor: page === section.name ? "blue.500" : "gray.500", transition:"0.15s linear" }} 
                                    transition="0.1s linear" onClick={() => setPage(section.name)} 
                                    whiteSpace="nowrap"
                                    >
                                    <Icon as={section.icon} pos="relative" top={-0.5}  mr={2} />
                                    {  section.name !== "Followers" ? section.name : "Followers (" + platform_data.followers.length + ")"}
                                </Text>
                            )
                        })}
                       
                    </Grid>
                    {renderPage()}
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

            {renderCreatePlaylist()}
        </Box>
    )
    

    // Handles the actual creation of a new playlist
    function handleCreatePlaylist() {

    }

    
    // Darken screen and let user choose playlist name
    function renderCreatePlaylist() {
        return (
            <AlertDialog
                isOpen={creatingPlaylist}
                leastDestructiveRef={cancelRef}
                onClose={() => setCreatingPlaylist(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent top="30%">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Choose A Playlist Name
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Input 
                                maxLength={maxPlaylistName}
                                borderColor="gray.300" 
                                value={chosenPlaylistName} 
                                onChange={(e) => 
                                    setChosenPlaylistName(e.target.value)
                                }/>
                            <Text float="right" fontSize="85%" color={ chosenPlaylistName.length === maxPlaylistName ? "red.500" : "gray.800" }>  
                                {chosenPlaylistName.length}/{maxPlaylistName} 
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button 
                            ref={cancelRef} 
                            onClick={() => {
                                setCreatingPlaylist(false)
                                setChosenPlaylistName("")
                            }} 
                            _focus={{border:"none"}}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="blue"  
                            ml={3} 
                            bgColor={chosenPlaylistName.trim() !== "" ? "" : "gray.400"}
                            _hover={{bgColor: chosenPlaylistName.trim() !== "" ? "blue.600" : "gray.400"}}
                            _active={{bgColor: chosenPlaylistName.trim() !== "" ? "blue.700" : "gray.400"}}
                            _focus={{border:"none"}}
                            onClick={() => chosenPlaylistName.trim() !== "" ? handleCreatePlaylist() : null}
                        >
                            Create Playlist
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        )
    }
}