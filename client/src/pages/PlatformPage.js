import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex, Input, Tooltip, HStack, Textarea, Icon, Select, Tag, TagLeftIcon, TagLabel,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
    Menu, MenuButton, IconButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react"
import { useMutation, useQuery } from '@apollo/client';
import { GET_PLATFORM } from "../cache/queries";
import { UPDATE_PLATFORM, ADD_QUIZ_TO_PLATFORM, DELETE_PLATFORM, FOLLOW_PLATFORM, UNFOLLOW_PLATFORM, ADD_QUIZ_TO_PLAYLIST, EDIT_PLAYLIST,
    ADD_PLAYLIST_TO_PLATFORM, REMOVE_PLAYLIST_FROM_PLATFORM } from '../cache/mutations';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import QuizCard from "../components/QuizCard";
import { useState, createRef, useContext, useRef } from 'react';
import '../styles/styles.css'
import SelectQuizCard from "../components/SelectQuizCard"
import UserCard from "../components/UserCard"
import { BsArrowUp, BsArrowDown, BsFillFileEarmarkTextFill, BsFillHouseDoorFill, BsFillInfoCircleFill, BsFillPersonFill, BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { MdForum, MdLogin } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { AddIcon, EditIcon } from '@chakra-ui/icons'
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
    const platform = useQuery(GET_PLATFORM, { variables: { platformId: platformId}, onCompleted(data) {
        for(let i = 0; i < data.getPlatform.followers.length; i++){
            if(user !== null && data.getPlatform.followers[i]._id === user._id){
                setFollowing(true)
            }
        }         
    } })


    const loading = platform.loading
    const error = platform.error

    // State Variables for editing name/icon/banner/description
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
    const hiddenIconInput = createRef(null);
    const hiddenImageInput = createRef(null);

    // State variables for editing quizzes/playlists/deleting platform
    const [chosenQuiz, setChosenQuiz] = useState(null)
    const [chosenPlaylist, setChosenPlaylist] = useState(null)
    const [chosenPlaylistName, setChosenPlaylistName] = useState('')
    const [editedPlaylistName, setEditedPlaylistName] = useState('')
    const [creatingPlaylist, setCreatingPlaylist] = useState(
        {
            creating: false,
            type: null,
            playlistId: null
        }
    )
    const [deleteConfirmation, setDeleteConfirmation] = useState(
        {
            deleting: false,
            type: null,
            playlistId: null
        })
    const [isAddingQuiz, setIsAddingQuiz] = useState(
        {
            adding: false,
            type: null
        })


    // Sends the updated platform information to the database
    const [updatePlatform] = useMutation(UPDATE_PLATFORM, {
        onCompleted() {
            platform.refetch()
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    // Sends the selected quiz to the database and adds it to the platform
    const [addQuizToPlatform] = useMutation(ADD_QUIZ_TO_PLATFORM, {
        onCompleted() {
            platform.refetch()
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })

    const [addQuizToPlaylist] = useMutation(ADD_QUIZ_TO_PLAYLIST, {
        onCompleted() {
            platform.refetch()
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


    const [addPlaylistToPlatform] = useMutation(ADD_PLAYLIST_TO_PLATFORM, {
        onCompleted() {
            platform.refetch()
        },
        onError(err) {
            console.log(err);
        },
    });

    const [removePlaylistFromPlatform] = useMutation(REMOVE_PLAYLIST_FROM_PLATFORM, {
        onCompleted() {
            platform.refetch()
        },
        onError(err) {
            console.log(err);
        },
    });

    // Sends the updated platform information to the database
    const [editPlaylist] = useMutation(EDIT_PLAYLIST, {
        onCompleted() {
            platform.refetch()
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });


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
    function handleDelete() {
        if (deleteConfirmation.type === "platform") {
            deletePlatform({
                variables: {
                    platformId: platformId,
                },
            })
        }
        
        else if (deleteConfirmation.type === "playlist") {
            removePlaylistFromPlatform({
                variables: {
                    platformId: platform_data._id,
                    playlistId: deleteConfirmation.playlistId
                }
            })
        }

        setDeleteConfirmation({
            deleting: false,
            type: null,
            playlistId: null
        })
    }

    // Checks if user is logged in or not
    let logged_in = false
    if (user !== null && user !== "NoUser") {
        logged_in = true
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


    const platform_data = platform.data.getPlatform

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
            name: "Forum",
            icon: MdForum
        },
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


    function renderPage() {
        if (page === 'Platform') 
            return renderPlatform()
        if (page === 'Quizzes') 
            return renderQuizzes()
        if (page === 'Followers') 
            return renderFollowers()
        if (page === 'About') 
            return renderAbout()
        if (page === 'Forum')
            return renderForum()
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
                                    display={is_owner || !logged_in ? 'none':''}
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
                            onClick={() => setCreatingPlaylist( 
                                {
                                    creating: true,
                                    type: "new",
                                    playlistId: null
                                }
                            )}
                            >
                            <TagLeftIcon as={AddIcon} />
                            <TagLabel> Create New Playlist </TagLabel>
                        </Tag>
                    </Box>
                    :
                    null
                }

                <Box h="0.4px" bgColor="gray.300" />
                
                {/* QUIZ SECTIONS */}
                <Box>
                    {platform_data.playlists.map((playlist, key) => {
                        return (
                            <Box w="100%" borderRadius="10" overflowX="auto" key={key}>
                                {/* <Icon as={BsThreeDotsVertical} mt={3} float="right" boxSize={6} _hover={{cursor:"pointer"}} /> */}
                                {renderPlaylistDropdown(playlist)}

                                <HStack pt="0.5%">
                                    <Text pl="1.5%" fontSize="125%" fontWeight="medium"> {playlist.name} </Text>
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
                                            onDelete={platform.refetch}
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
               <Center>
                    {
                        is_owner ?
                        <Button 
                            mt="5%" 
                            bgColor="red.600" 
                            textColor="white" 
                            _hover={{bgColor:"red.500"}} 
                            _active={{bgColor:"red.400"}}
                            _focus={{border:"none"}} 
                            onClick={() => setDeleteConfirmation({
                                deleting: true,
                                type: "platform",
                                playlistId: null
                            })}
                            >
                            Delete Platform
                        </Button>
                        : ""
                    }
                </Center>
            </Box>
        )
    }

    function renderFollowers() {
        return (
            <Box borderRadius='10'>
                <Text pl='1.5%'  fontSize='120%' fontWeight='medium'>
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
                {/* ADD QUIZ TO PLATFORM BUTTON */}
                <Box borderBottom="1px solid" borderColor="gray.300">
                    <HStack padding={2}>
                        <Text> Sort By: </Text>
                        <Select w="fit-content" size="md" variant="outline">
                            <option value="none"> Newest </option>
                            <option value="popular"> Most Popular </option>
                            <option value="sort_abc">Alphabetical [A-Z]</option>
                        </Select>
                        {is_owner ? 
                            <Tag className="disable-select" float="right" mr={2} variant="subtle" colorScheme="orange"
                                _hover={{cursor:"pointer", opacity:"85%"}}
                                onClick={() => setIsAddingQuiz({ adding: true, type: "platform"  })}
                            >
                                <TagLeftIcon as={AddIcon} />
                                <TagLabel> Add Quiz </TagLabel>
                            </Tag>
                            :
                            null
                        }
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
                                is_owner={is_owner}
                                platform_id={platform_data._id}
                                onDelete={platform.refetch}
                            />
                        );
                    })}
                </Flex>
            </Box>
        )
    }

    function renderForum() {
        return (
            <Grid templateColumns="1fr 20fr 1fr">
                <Box/>
                    { !(user !== 'NoUser' && (following || is_owner) ) ? 
                    <Center marginTop="2%" justifySelf="center" w="480px" h="80px" borderRadius="10">
                        { user == 'NoUser' ? 
                        <Button leftIcon={<MdLogin/>} w="440px" size="lg" colorScheme='blue' color="white" onClick={() => history.push('/loginpage')}                                    
                         _hover={{opacity:"85%"}} 
                        _active={{opacity:"75%"}} 
                        _focus={{boxShadow:"none"}}> 
                            Login To View Forum Page
                        </Button>
                        :
                        <Button leftIcon={<FaLock/>} w="440px" size="lg" bgColor="gray.800" color="white" display={is_owner || !logged_in ? 'none':''} onClick={setFollowPlatform}                                     
                                    _hover={{opacity:"85%"}} 
                                    _active={{opacity:"75%"}} 
                                    _focus={{boxShadow:"none"}}> 
                            Follow To Gain Access to Forum
                        </Button>
                        }
                    </Center>
                    : 
                    <Box marginTop="1%" w="100%" h="100%">
                        <Text marginBottom="20px" borderBottom="1px" borderColor="gray.300" fontSize="22px">Posts</Text>
                        <Flex direction="row">
                            <Avatar/>
                            <Input variant='filled' placeholder='Add a public post...' marginLeft="20px" marginBottom="20px"
                                _hover={{pointer:"cursor", bgColor:"gray.200"}}
                                _focus={{bgColor:"white", border:"1px", borderColor:"blue.400"}}/>
                            <Button w="140px" colorScheme='blue' size="md" marginLeft="20px">
                                Post
                            </Button>
                        </Flex>
                    </Box>
                }
            </Grid>

    )}

    // Darken screen and let user choose playlist name
    function renderCreatePlaylist() {
        let name = ''
        if (creatingPlaylist.type === "new")
            name = chosenPlaylistName
        if (creatingPlaylist.type === "rename")
            name = editedPlaylistName

        let setName = ''
        if (creatingPlaylist.type === "new")
            setName = setChosenPlaylistName
        if (creatingPlaylist.type === "rename")
            setName = setEditedPlaylistName

        let buttonText = ''
        if (creatingPlaylist.type === "new")
            buttonText = "Create Playlist"
        if (creatingPlaylist.type === "rename")
            buttonText = "Rename Playlist"
        
        let onClickFunction = null
        if (creatingPlaylist.type === "new")
            onClickFunction = () => { return name.trim() !== "" ? handleCreatePlaylist() : null }
        if (creatingPlaylist.type === "rename")
            onClickFunction = () => { return name.trim() !== "" ? handleEditPlaylist(creatingPlaylist.playlistId, false, false, editedPlaylistName) : null }

        return (
            <AlertDialog
                isOpen={creatingPlaylist.creating}
                leastDestructiveRef={cancelRef}
                onClose={() => setCreatingPlaylist(
                    {
                        creating: false,
                        type: null,
                        playlistId: null
                    })}
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
                                value={name} 
                                onChange={(e) => 
                                    setName(e.target.value)
                                }/>
                            <Text float="right" fontSize="85%" color={ name.length === maxPlaylistName ? "red.500" : "gray.800" }>  
                                {name.length}/{maxPlaylistName} 
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button 
                            ref={cancelRef} 
                            onClick={() => {
                                setCreatingPlaylist({
                                    creating: false,
                                    type: null,
                                    playlistId: null
                                })
                                setName("")
                            }} 
                            _focus={{border:"none"}}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="blue"  
                            ml={3} 
                            bgColor={name.trim() !== "" ? "" : "gray.400"}
                            _hover={{bgColor: name.trim() !== "" ? "blue.600" : "gray.400"}}
                            _active={{bgColor: name.trim() !== "" ? "blue.700" : "gray.400"}}
                            _focus={{border:"none"}}
                            onClick={() => onClickFunction()}
                        >
                            {buttonText}
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        )
    }

    // Dropdown menu for playlists
    function renderPlaylistDropdown(playlist) {
        if (!is_owner)
            return

        return (
            <Menu>
                <MenuButton
                    float="right"
                    as={IconButton}
                    aria-label="Options"
                    icon={<BsThreeDotsVertical />}
                    _focus={{border:"none"}}
                    variant=""
                />
                <MenuList boxShadow="md">
                    <MenuItem icon={<BsArrowUp />} onClick={() => handleEditPlaylist(playlist._id, true, false, null)}>
                        Move Playlist Up
                    </MenuItem>
                    <MenuItem icon={<BsArrowDown />} onClick={() => handleEditPlaylist(playlist._id, false, true, null)}>
                        Move Playlist Down
                    </MenuItem>
                    <MenuItem icon={<EditIcon />} 
                        onClick={() => {
                            setEditedPlaylistName(playlist.name)
                            setCreatingPlaylist({
                                creating: true,
                                type: "rename",
                                playlistId: playlist._id
                            })
                        }}>
                        Rename Playlist
                    </MenuItem>
                    <MenuItem icon={<BsTrash />} 
                        onClick={() => setDeleteConfirmation({
                            deleting: true,
                            type: "playlist",
                            playlistId: playlist._id
                        })}>
                        Delete Playlist
                    </MenuItem>
                </MenuList>
            </Menu>
        )
    }

    function renderDeleteConfirmation() {
        return (
            is_owner ? 
                <Center>
                    <AlertDialog
                        isOpen={deleteConfirmation.deleting}
                        leastDestructiveRef={cancelRef}
                        onClose={() => setDeleteConfirmation({
                            deleting: false,
                            type: null,
                            playlistId: null
                        })}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent top="30%">
                                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Delete {deleteConfirmation.type === "platform" ? "Platform" : "Playlist"}
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure you want to delete this {deleteConfirmation.type === "platform" ? "platform" : "playlist"}? This action cannot be undone.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                <Button 
                                    ref={cancelRef} 
                                    onClick={() => setDeleteConfirmation({
                                        deleting: false,
                                        type: null,
                                        playlistId: null
                                    })} 
                                    _focus={{border:"none"}}
                                >
                                    Cancel
                                </Button>
                                <Button colorScheme="red" onClick={() => handleDelete()} ml={3} _focus={{border:"none"}}>
                                    Delete
                                </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Center>
            :
            null
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
                    <Grid w="100%" h="6vh" minH="50px" templateColumns="1fr 1fr 1fr 1fr 1fr" justifyContent="center" alignItems="center"> 

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
            {renderDeleteConfirmation()}
            {renderCreatePlaylist()}
        </Box>
    )
    
    
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


    // Cancel icon/banner/name update
    function cancelChanges() {
        setIcon(platform_data.iconImage)
        setBanner(platform_data.bannerImage)
        setUnsavedChanges(false)
    }


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


    // Handles the actual creation of a new playlist
    function handleCreatePlaylist() {
        // If a quiz with the chosen name already exists, display an error
        for (let i = 0; i < platform_data.playlists.length; i++)
            if (platform_data.playlists[i].name === chosenPlaylistName){
                alert.show('Playlist with this name already exists')
                setChosenPlaylistName("")
                setCreatingPlaylist({
                    creating: false,
                    type: null,
                    playlistId: null
                })
                return
            }

        // Playlist added successfully
        addPlaylistToPlatform({
            variables: {
                platformId: platform_data._id,
                playlistName: chosenPlaylistName
            }
        })

        setChosenPlaylistName("")
        setCreatingPlaylist({
            creating: false,
            type: null,
            playlistId: null
        })
    }

    function handleEditPlaylist(playlistId, moveUp, moveDown, newName) {
        editPlaylist({
            variables: {
                playlistInput: {
                    platformId: platformId,
                    playlistId: playlistId,
                    name: newName,
                    moveUp: moveUp,
                    moveDown: moveDown
                },
            },
        })
        setCreatingPlaylist({
            creating: false,
            type: null,
            playlistId: null
        })
    }
}