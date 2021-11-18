import { Box, Text, Grid, VStack, Button, Image, Center, Spinner, Flex, Input, Tooltip, HStack, Textarea, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import { useMutation, useQuery } from '@apollo/client';
import { GET_QUIZZES, GET_PLATFORM } from "../cache/queries";
import { UPDATE_PLATFORM, ADD_QUIZ_TO_PLATFORM, DELETE_PLATFORM, FOLLOW_PLATFORM, UNFOLLOW_PLATFORM } from '../cache/mutations';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import QuizCard from "../components/QuizCard";
import { useState, createRef, useContext, useRef } from 'react';
import '../styles/styles.css'
import AddQuizCard from "../components/AddQuizCard";
import SelectQuizCard from "../components/SelectQuizCard"

export default function PlatformPage({}) {
    let history = useHistory();
    const cancelRef = useRef()

    const { user } = useContext(AuthContext);
    let { platformId } = useParams();
    
    const [page, setPage] = useState('Platform')
    const [following, setFollowing] = useState(false)

    const quiz_sections = ["All Quizzes", "Most Played Quizzes", "Geography"]

    // Fetch quiz data from the backend
    const quizzes = useQuery(GET_QUIZZES, { fetchPolicy: 'cache-and-network' })
    const platform = useQuery(GET_PLATFORM, { variables: { platformId: platformId}, onCompleted() {
        for(let i = 0; i < platform.data.getPlatform.followers.length; i++){
            if(platform.data.getPlatform.followers[i]._id == user._id){
                setFollowing(true)
            }
        }         
    } })


    const loading = quizzes.loading || platform.loading
    const error = quizzes.error || platform.error

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
    const [isAddingQuiz, setIsAddingQuiz] = useState(false)
    const [chosenQuiz, setChosenQuiz] = useState(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
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

    // Finish selecting quiz and send added quiz to database
    function handleAddQuizToPlatform() {
        setIsAddingQuiz(false)

        if(chosenQuiz !== null){
            addQuizToPlatform({
                variables: {
                    platformId: platform_data._id,
                    quizId: chosenQuiz._id
                },
            })
        }
        setChosenQuiz(null)
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
        return (
            <Center>
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    // Set variables 
    const all_quizzes = quizzes.data.getQuizzes // Temporary, remove when quizzes are grabbed from an individual user
    const quiz_data = platform.data.getPlatform.quizzes
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

    let header_sections = ["Quizzes", "Followers", "About"]

    // Cancel icon/banner/name update
    function cancelChanges() {
        setIcon(platform_data.iconImage)
        setBanner(platform_data.bannerImage)
        setUnsavedChanges(false)
    }

    function renderPage() {
        if (page === 'Platform') 
            return renderPlatform()
        // if (page === 'Quizzes') 
        //     return renderPlatforms()
        // if (page === 'Followers') 
        //     return renderQuizzes()
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
                                    w="7%" 
                                    minW="80px"
                                    h="50px" 
                                    mt="1%" 
                                    bgColor="red.600" 
                                    fontSize="120%" 
                                    color="white" 
                                    float="right"
                                    display={is_owner ? 'none':''}
                                    onClick={setUnfollowPlatform}
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
                                        <Input value={name} onChange={(event) => setName(event.target.value)} borderColor="gray.400"/>
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

                            <Text fontSize="110%"> {platform.data.getPlatform.followers.length} Followers </Text>
                        </VStack>
                    </Box>
               
               

                {/* QUIZZES */}
                <Box mt="9%" borderTop="0.2vh solid" borderColor="gray.300">
                    {quiz_sections.map((section, key) => {
                        return (
                            <Box w="100%" borderRadius="10" overflowX="auto" key={key}>
                                <Text pl="1.5%" pt="1%" fontSize="130%" fontWeight="medium"> {section} </Text>
                                <Flex ml="1%" spacing="4%" display="flex" flexWrap="wrap" >
                                    {/* Card for adding a quiz, if platform owner is viewing */}
                                    {is_owner ? 
                                        <AddQuizCard 
                                            width="7.5%"
                                            title_fontsize="125%" 
                                            type='1'
                                            callback={setIsAddingQuiz}
                                        />
                                        :
                                        null
                                    }
                                    
                                    {/* QUIZ CARDS */}
                                    {quiz_data.slice(0).reverse().map((quiz, key) => {
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
                        <Text fontSize="120%"> {platform_data.followers.length} Followers </Text>
                        
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
                                    <Textarea h="15vh" value={description} onChange={(event) => setDescription(event.target.value)} borderColor="gray.400"/>
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

    return (
        <Box>
            {/* Darken screen and allow user to select quiz to add to the platform */}
            {
                isAddingQuiz ? 
                    <Box position="fixed" w="100%" h="100vh" zIndex="1" bgColor="rgba(0, 0, 0, 0.9)" transition="0.2s linear"> 
                       {/* QUIZ CARDS */}
                            <Flex mt="0.5%" ml="1%" spacing="4%" display="flex" flexWrap="wrap">
                                {all_quizzes.map((quiz, key) => {
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
                        
                        {/* Cancel Selecting a quiz */}
                        <HStack w="100%" spacing="1%" pos="fixed" bottom="3%" right="-83%">
                            <Button bgColor="gray.500" textColor="white" fontSize="120%" pt="1.3%" pb="1.3%" pl="1.5%" pr="1.5%" _hover={{bgColor:"gray.600"}}  _focus={{border:"none"}}
                                onClick={() => {
                                    setIsAddingQuiz(false)
                                    setChosenQuiz(null)
                                }}>
                                Cancel
                            </Button>

                            {/* Finish selecting a quiz */}
                            <Button textColor="white" fontSize="120%" pt="1.3%" pb="1.3%" pl="1.5%" pr="1.5%"
                                bgColor={chosenQuiz !== null ? "blue.400" : "gray.400"} 
                                _hover={{bgColor: chosenQuiz !== null ? "blue.300" : "gray.400"}}
                                _active={{bgColor: chosenQuiz !== null ? "blue.200" : "gray.400"}}
                                _focus={{border:"none"}}
                                onClick={() => chosenQuiz !== null ? handleAddQuizToPlatform() : null}>
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

                        <Text className="disable-select" fontSize="125%" textColor={page === "Platform" ? "blue" : "gray.1000" } textAlign="center" _hover={{ cursor:"pointer", textColor: page === "Platform" ? "blue" : "gray.500", transition:"0.15s linear" }} transition="0.1s linear" onClick={() => setPage('Platform')} >
                            {platform_data.name}
                        </Text>

                        {header_sections.map((section, key) => {
                            return (
                                <Text key={key} className="disable-select" fontSize="125%" textColor={page === section ? "blue" : "gray.1000" } textAlign="center" _hover={{ cursor:"pointer", textColor: page === section ? "blue" : "gray.500", transition:"0.15s linear" }} transition="0.1s linear" onClick={() => setPage(section)} >
                                    {section}
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
        </Box>
    )
}