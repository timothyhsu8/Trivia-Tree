import {
    Box,
    Text,
    Grid,
    VStack,
    Button,
    Image,
    Center,
    Spinner,
    Flex,
    Textarea,
    FormControl,
    FormLabel,
    Select,
    HStack,
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Stack,
    useColorModeValue,
    Icon,
    Avatar,
    Tag,
    TagLeftIcon,
    TagLabel,
    IconButton,
    Spacer
} from '@chakra-ui/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_USER } from '../cache/queries';
import {
    ADD_FEATURED_QUIZ,
    DELETE_FEATURED_QUIZ,
    ADD_FEATURED_PLATFORM,
    DELETE_FEATURED_PLATFORM,
} from '../cache/mutations';
import {
    Link,
    Redirect,
    useParams,
    useLocation,
    useHistory,
} from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import { AuthContext } from '../context/auth';
import { useState, useContext, createRef, useEffect } from 'react';
import React from 'react';
import '../styles/styles.css';
import PlatformCard from '../components/PlatformCard';
import AddQuizCard from '../components/AddQuizCard';
import SelectQuizCard from '../components/SelectQuizCard';
import SelectPlatformCard from '../components/SelectPlatformCard';
import { BsBookmarkStarFill, BsFillFileEarmarkTextFill, BsFillHouseDoorFill, BsJustify, BsJustifyLeft, BsPersonCircle } from 'react-icons/bs';
import { ChevronDownIcon, AddIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useAlert } from 'react-alert';
import gold_badge from '../images/gold_badge.png'
import silver_badge from '../images/silver_badge.png'
import bronze_badge from '../images/silver_badge.png'
import CreateQuizCard from '../components/CreateQuizCard';

let profileImg = null;
let bannerImg = null;
let hiddenPFPInput = null;
let hiddenBannerInput = null;
let username = null;

export default function AccountPage(props) {
    const { user, refreshUserData } = useContext(AuthContext);
    const alert = useAlert();
    const location = useLocation();

    let { userId } = useParams();
    let isOwner = false;
    let history = useHistory();

    const [firstQueryDone, setFirstQueryDone] = React.useState(false);
    const [page, setPage] = useState('user');
    const [isEditing, setIsEditing] = React.useState(false);
    const [editBio, setEditBio] = React.useState(false);
    const [unsavedChanges, setUnsavedChanges] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const [userTitle, setUserTitle] = React.useState('');
    const [pfp_src, setPFP] = useState(''); //String path
    const [banner_src, setBanner] = useState(''); //String path
    const [bannerEffectPreview, setBannerEffectPreview] = useState(
        {
            name: "No Banner Effect",
            item: null,
            _id: "uninitialized"
        }
    )

    const [iconEffect, setIconEffect] = useState(
        {
            name: "No Icon Effect",
            item: null,
            _id: "uninitialized"
        }
    )

    const [background, setBackground] = useState(
        {
            name: "No Background",
            item: null,
            _id: "uninitialized"
        }
    )

    const [viewQuizType, setViewQuizType] = useState("Created Quizzes")
    const [viewPlatformType, setViewPlatformType] = useState("Created Platforms")

    const [isAddingFeaturedQuiz, setIsAddingFeaturedQuiz] =
        React.useState(false);
    const [isAddingFeaturedPlatform, setIsAddingFeaturedPlatform] =
        React.useState(false);
    const [chosenFeaturedQuiz, setChosenFeaturedQuiz] = useState(null);
    const [chosenFeaturedPlatform, setChosenFeaturedPlatform] = useState(null);

    const [AddFeaturedQuiz] = useMutation(ADD_FEATURED_QUIZ, {
        fetchPolicy: 'network-only',
        onCompleted() {
            refetch();
        },
    });

    const [AddFeaturedPlatform] = useMutation(ADD_FEATURED_PLATFORM, {
        fetchPolicy: 'network-only',
        onCompleted() {
            refetch();
        },
    });

    const [DeleteFeaturedQuiz] = useMutation(DELETE_FEATURED_QUIZ, {
        fetchPolicy: 'network-only',
        onCompleted() {
            refetch();
        },
    });

    const [DeleteFeaturedPlatform] = useMutation(DELETE_FEATURED_PLATFORM, {
        fetchPolicy: 'network-only',
        onCompleted() {
            refetch();
        },
    });

    useEffect(() => {
        setBannerEffectPreview({
            name: "No Banner Effect",
            item: null,
            _id: "uninitialized"
        })

        setIconEffect({
            name: "No Icon Effect",
            item: null,
            _id: "uninitialized"
        })

        setBackground({
            name: "No Background",
            item: null,
            _id: "uninitialized"
        })

        setFirstQueryDone(false);
    }, [userId]);

    if (user !== null) {
        if (user._id === userId) {
            isOwner = true;
        }
    }

    function toggleEditPage() {
        setIsEditing(!isEditing);
    }

    function updateBio(value) {
        setBio(value);
        setUnsavedChanges(true);
    }

    function updateUserTitle(value) {
        setUserTitle(value);
    }


    function updatePFP(event) {
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
                setPFP(tempImg);
                setUnsavedChanges(true);
            };
        }
    }

    function updateBanner(event) {
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
                bannerImg = 'New Image';
                setBanner(tempImg);
                setUnsavedChanges(true);
            };
        }
    }

    function updateBannerEffect(item) {
        setBannerEffectPreview(item)

        // If user doesn't already have a banner effect applied
        if (userData.bannerEffect === null || userData.bannerEffect === undefined) {
            if (item.item !== null)
                setUnsavedChanges(true)
            else 
                setUnsavedChanges(false)
                
            return
        }
        
        // If user already had a banner effect applied
        if (userData.bannerEffect._id === item._id){
            setUnsavedChanges(false)
            return
        }

        setUnsavedChanges(true)
    }

    function updateIconEffect(item) {
        setIconEffect(item)

        // If user doesn't already have a banner effect applied
        if (userData.iconEffect === null || userData.iconEffect === undefined) {
            if (item.item !== null)
                setUnsavedChanges(true)
            else 
                setUnsavedChanges(false)
                
            return
        }
        
        // If user already had a banner effect applied
        if (userData.iconEffect._id === item._id){
            setUnsavedChanges(false)
            return
        }

        setUnsavedChanges(true)
    }

    function updateBackground(item) {
        setBackground(item)

        // If user doesn't already have a banner effect applied
        if (userData.background === null || userData.background === undefined) {
            if (item.item !== null)
                setUnsavedChanges(true)
            else 
                setUnsavedChanges(false)
                
            return
        }
        
        // If user already had a banner effect applied
        if (userData.background._id === item._id){
            setUnsavedChanges(false)
            return
        }

        setUnsavedChanges(true)
    }

    function cancelEditing() {
        profileImg = 'Same Image';
        bannerImg = 'Same Image';
        // toggleEditPage(false);
        setPFP(userData.iconImage);
        setBio(userData.bio);
        if (userData.bannerImage) {
            setBanner(userData.bannerImage);
        } else {
            setBanner(
                'https://www.acemetrix.com/wp-content/themes/acemetrix/images/default/default-black-banner.png'
            );
        }
        setEditBio(false);
        setUnsavedChanges(false);

        // Reset Banner Effect
        if (userData.bannerEffect !== null && userData.bannerEffect !== undefined)
            setBannerEffectPreview(userData.bannerEffect)

        else 
            setBannerEffectPreview({
                name: "No Banner Effect",
                item: null,
                _id: "none"
            })

        // Reset Icon Effect
        if (userData.iconEffect !== null && userData.iconEffect !== undefined)
            setIconEffect(userData.iconEffect)

        else 
            setIconEffect({
                name: "No Icon Effect",
                item: null,
                _id: "none"
            })

        // Reset Background
        if (userData.background !== null && userData.background !== undefined)
            setBackground(userData.background)

        else 
            setBackground({
                name: "No Background",
                item: null,
                _id: "none"
            })
    }

    const {
        loading,
        error,
        data: { getUser: userData } = {},
        refetch,
    } = useQuery(GET_USER, {
        skip: !user,
        fetchPolicy: 'cache-and-network',
        variables: { _id: userId },
        onCompleted({ getUser: userData }) {
            if (userData) {
                profileImg = 'Same Image';
                bannerImg = 'Same Image';
                hiddenPFPInput = createRef(null);
                hiddenBannerInput = createRef(null);
                username = userData.displayName;
                setPFP(userData.iconImage);
                setBio(userData.bio);
                if (userData.bannerImage) {
                    setBanner(userData.bannerImage);
                } else {
                    setBanner(
                        'https://www.acemetrix.com/wp-content/themes/acemetrix/images/default/default-black-banner.png'
                    );
                }
                setFirstQueryDone(true);
            }
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    });

    // If the user is previewing an item
    let preview = false;
    let itemData = '';
    if (location.state !== undefined && location.state.item !== undefined) {
        preview = true;
        itemData = location.state.item;
    }

    const [updateUser] = useMutation(UPDATE_USER, {
        refetchQueries: [GET_USER],
        context: {
            headers: {
                profileimagetype: profileImg,
                bannerimagetype: bannerImg,
            },
        },
        onCompleted() {
            profileImg = 'Same Image';
            bannerImg = 'Same Image';
            // toggleEditPage(false);
            setEditBio(false);
            setUnsavedChanges(false);
            //Used so that the icon on the navbar is also changed
            refreshUserData();
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    function handleUpdateUser() {
        updateUser({
            variables: {
                userInput: {
                    userId: userId,
                    iconImage: pfp_src,
                    bannerImage: banner_src,
                    bio: bio,
                    bannerEffectId: bannerEffectPreview.item !== null ? bannerEffectPreview._id : null,
                    iconEffectId: iconEffect.item !== null ? iconEffect._id : null,
                    backgroundId: background.item !== null ? background._id : null
                },
            },
        });
    }


    //Dark mode styling
    const bannerEditBG=useColorModeValue('gray.800', 'gray.200')
    const platformsButtonBG=useColorModeValue('white', 'gray.700')
    const accountButtonsBG=useColorModeValue('white', 'rgba(0, 0, 0, 0)')
    const mainBG=useColorModeValue('rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.9)')
    const accountButtonsText=useColorModeValue('blue.500', 'light blue')
    const accountButtonsText2=useColorModeValue('gray.700', 'white')
    const whiteBlackBG=useColorModeValue('white', 'gray.700')
    const basicTextColor=useColorModeValue('white', 'black')
    const cancelButtonBG=useColorModeValue('gray.500', 'gray.500')
    const selectButtonBG=useColorModeValue('blue.500', 'blue.500')

    // Loading Screen - Wait for userData and user
    if ((loading || !user) && !firstQueryDone) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    // If the data is null we know that the user does not exist
    if (!userData) {
        return (
            <Center>
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                    This user does not exist{' '}
                </Text>
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

    // Initializes banner effect as the one they own
    if (bannerEffectPreview._id === "uninitialized") {
        if (userData.bannerEffect === null || userData.bannerEffect === undefined) {
            setBannerEffectPreview({
                name: "No Banner Effect",
                item: null,
                _id: "none"
            })
        }

        else {
            setBannerEffectPreview(userData.bannerEffect)
        }
    }

    // Initializes icon effect as the one they own
    if (iconEffect._id === "uninitialized") {
        if (userData.iconEffect === null || userData.iconEffect === undefined) {
            setIconEffect({
                name: "No Icon Effect",
                item: null,
                _id: "none"
            })
        }

        else {
            setIconEffect(userData.iconEffect)
        }
    }

    // Initializes background as the one they own
    if (background._id === "uninitialized") {
        if (userData.background === null || userData.background === undefined) {
            setBackground({
                name: "No Background",
                item: null,
                _id: "none"
            })
        }

        else {
            setBackground(userData.background)
        }
    }

    // Maps out information needed for the header sections at the top
    const headerSections = [
        {
            pageName: userData.displayName,
            pageId: 'user',
            icon: BsPersonCircle
        },
        {
            pageName: "Platforms",
            pageId: 'platforms',
            icon: BsFillHouseDoorFill
        },
        {
            pageName: "Quizzes",
            pageId: 'quizzes',
            icon: BsFillFileEarmarkTextFill
        },
        {
            pageName: "Badges",
            pageId: 'badges',
            icon: BsBookmarkStarFill,
        }
    ]

    const badges = ["gold", "gold", "gold", "silver", "silver", "bronze"]

    async function handleAddFeaturedQuiz() {
        setIsAddingFeaturedQuiz(false);

        if (chosenFeaturedQuiz !== null) {
            for (let i = 0; i < userData.featuredQuizzes.length; i++) {
                if (userData.featuredQuizzes[i]._id == chosenFeaturedQuiz._id) {
                    alert.show('Already Featured');
                    return; //later provide error message that you cannot add already featured quiz!!
                }
            }

            const { data } = await AddFeaturedQuiz({
                variables: {
                    userId: userData._id,
                    newFeaturedQuizId: chosenFeaturedQuiz._id,
                },
            });

            console.log(data);
        }

        setChosenFeaturedQuiz(null);
    }

    async function handleAddFeaturedPlatform() {
        setIsAddingFeaturedPlatform(false);

        if (chosenFeaturedPlatform !== null) {
            for (let i = 0; i < userData.featuredPlatforms.length; i++) {
                if (
                    userData.featuredPlatforms[i]._id ==
                    chosenFeaturedPlatform._id
                ) {
                    alert.show('Already Featured');
                    return; //later provide error message that you cannot add already featured quiz!!
                }
            }

            const { data } = await AddFeaturedPlatform({
                variables: {
                    userId: userData._id,
                    newFeaturedPlatformId: chosenFeaturedPlatform._id,
                },
            });
        }

        setChosenFeaturedPlatform(null);
    }

    async function handleDeleteFeaturedQuiz(quizToDelete) {
        console.log(quizToDelete.title);
        let quizToDeleteId = quizToDelete._id;
        const { data } = await DeleteFeaturedQuiz({
            variables: {
                userId: userData._id,
                deleteFeaturedQuizId: quizToDeleteId,
            },
        });
    }

    async function handleDeleteFeaturedPlatform(platformToDelete) {
        let platformToDeleteId = platformToDelete._id;
        const { data } = await DeleteFeaturedPlatform({
            variables: {
                userId: userData._id,
                deleteFeaturedPlatformId: platformToDeleteId,
            },
        });
    }

    function renderPage() {
        if (page === 'user') return renderUser();
        if (page === 'platforms') return renderPlatforms();
        if (page === 'quizzes') return renderQuizzes();
        if (page === 'badges') return renderBadges();
    }

    // Render User
    function renderUser() {
        return (
            <Box minW='500px' pos='relative'>
                <Box pos="relative" w="100%" h="fit-content">

                    {/* PROFILE PICTURE AND NAME */}
                    <HStack
                        pos="absolute"
                        width='11%'
                        left={12}
                        spacing={0}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex="2"
                    >

                        {/* Icon Effect */}
                        {renderIconEffect()}

                        {/* Profile Picture */}
                        {isOwner && !preview ? (
                            <Popover placement="right-start">
                                <PopoverTrigger>
                                    <Box w="100%">
                                        <Tooltip
                                            label='Edit Platform Icon'
                                            placement='top'
                                            fontSize='100%'
                                            bgColor={bannerEditBG}
                                        >
                                            <Box
                                                className='squareimage_container'
                                                w='100%'
                                                minW='60px'
                                                minH='60px'
                                            >
                                                <Image
                                                    className='squareimage'
                                                    src={pfp_src}
                                                    objectFit='cover'
                                                    borderRadius='50%'
                                                    _hover={{
                                                        cursor: 'pointer',
                                                        filter: 'brightness(65%)',
                                                        transition: '0.15s linear',
                                                    }}
                                                    transition='0.15s linear'
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </PopoverTrigger>
                                <Box>
                                    <PopoverContent>
                                        <PopoverCloseButton />
                                        <PopoverHeader fontWeight="medium"> Edit Icon </PopoverHeader>
                                        <PopoverBody>
                                            <Stack>
                                                <HStack>
                                                    <Text> Icon Image: </Text>
                                                    <input
                                                        type='file'
                                                        style={{ display: 'none' }}
                                                        ref={hiddenPFPInput}
                                                        onChange={(event) => updatePFP(event)}
                                                    />
                                                    <Button 
                                                        variant="outline" 
                                                        colorScheme="blue"
                                                        _focus={{}}
                                                        onClick={() => hiddenPFPInput.current.click()}
                                                    > 
                                                        Upload Image 
                                                    </Button>
                                                </HStack>
                                                <HStack>
                                                    <Text> Icon Effect: </Text>
                                                    <Menu>
                                                        <MenuButton w={180} as={Button} rightIcon={<ChevronDownIcon />} border="1px solid" borderColor="gray.300" _focus={{}}>
                                                            { iconEffect.name }
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuItem onClick={() => updateIconEffect({name: "No Icon Effect", item: null, _id: "none"})}> No Icon Effect </MenuItem>
                                                            {
                                                                userData.ownedIconEffects.map((item, key) => {
                                                                    return (
                                                                        <MenuItem key={key} onClick={() => updateIconEffect(item)}> {item.name} </MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </MenuList>
                                                    </Menu>
                                                </HStack>
                                            </Stack>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Box>
                            </Popover>
                        ) : (
                            <Box
                                className='squareimage_container'
                                w='100%'
                                minW='60px'
                                minH='60px'
                            >
                                <Image
                                    className='squareimage'
                                    src={pfp_src}
                                    objectFit='cover'
                                    borderRadius='50%'
                                />
                            </Box>
                        )}

                        {/* Username */}
                        <Text
                            pos='absolute'
                            bottom='30%'
                            left='110%'
                            fontSize='2.2vw'
                            as='b'
                            color='black'
                            w='100%'
                            pointerEvents="none"
                            whiteSpace="nowrap"
                        >
                            {username}
                        </Text>
                        <Text
                            pos='absolute'
                            bottom='8%'
                            left='14.2%'
                            fontSize='190%'
                            fontWeight='thin'
                        >
                            {' '}
                            {userTitle}{' '}
                        </Text>
                    </HStack>

                    {/* BANNER EFFECT */}
                    { renderBannerEffect() }

                    {/* BANNER */}
                    {isOwner && !preview ? (
                            <Popover>
                                <PopoverTrigger>
                                    <Box>
                                        <Tooltip
                                            label='Edit Banner'
                                            placement='bottom'
                                            fontSize='100%'
                                            bgColor={bannerEditBG}
                                        >
                                        <Box
                                            h='28vh'
                                            minH='150px'
                                            pos='relative'
                                            bgImage={
                                                "linear-gradient(to bottom, rgba(245, 246, 252, 0.30), rgba(255, 255, 255, 0.90)), url('" +
                                                (preview && itemData.type === 'background'
                                                    ? itemData.item
                                                    : banner_src) +
                                                "')"
                                            }
                                            bgSize='cover'
                                            bgPosition='center'
                                            borderRadius='5px'
                                            _hover={{
                                                cursor: 'pointer',
                                                filter: 'brightness(65%)',
                                                transition: '0.15s linear',
                                            }}
                                            transition='0.15s linear'
                                        />
                                        </Tooltip>
                                    </Box>
                                </PopoverTrigger>
                                <PopoverContent >
                                    <PopoverCloseButton />
                                    <PopoverHeader fontWeight="medium"> Edit Banner </PopoverHeader>
                                    <PopoverBody>
                                        <Stack>
                                            <HStack>
                                                <Text> Banner Image: </Text>
                                                <input
                                                    type='file'
                                                    accept='image/*'
                                                    style={{ display: 'none' }}
                                                    ref={hiddenBannerInput}
                                                    onChange={(event) => updateBanner(event)}
                                                />
                                                <Button 
                                                    variant="outline" 
                                                    colorScheme="blue"
                                                    _focus={{}}
                                                    onClick={() => hiddenBannerInput.current.click()}
                                                > 
                                                    Upload Image 
                                                </Button>
                                            </HStack>
                                            <HStack>
                                                <Text> Banner Effect: </Text>
                                                <Menu>
                                                    <MenuButton w={180} as={Button} rightIcon={<ChevronDownIcon />} border="1px solid" borderColor="gray.300" _focus={{}}>
                                                        { bannerEffectPreview.name }
                                                    </MenuButton>
                                                    <MenuList>
                                                        <MenuItem onClick={() => updateBannerEffect({name: "No Banner Effect", item: null, _id: "none"})}> No Banner Effect </MenuItem>
                                                        {
                                                            userData.ownedBannerEffects.map((item, key) => {
                                                                return (
                                                                    <MenuItem key={key} onClick={() => updateBannerEffect(item)}> {item.name} </MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </MenuList>
                                                </Menu>
                                            </HStack>
                                        </Stack>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                    ) : (
                        <Box
                            h='28vh'
                            minH='150px'
                            pos='relative'
                            bgImage={
                                "linear-gradient(to bottom, rgba(245, 246, 252, 0.30), rgba(255, 255, 255, 0.90)), url('" +
                                (preview && itemData.type === 'background'
                                    ? itemData.item
                                    : banner_src) +
                                "')"
                            }
                            bgSize='cover'
                            bgPosition='center'
                            borderRadius='5px'
                        ></Box>
                    )}
                </Box>
                {/* FEATURED QUIZZES/PLATFORMS AND BIOGRAPHY */}
                <Grid templateColumns='0.78fr 0.22fr' marginTop={2} mb={100}>
                    {/* FEATURED QUIZZES/PLATFORMS */}
                    <Box w='99.2%' borderRadius='5'>
                        <VStack>
                            <Box
                                w='100%'
                                boxShadow="0 0 3px #ccc"
                                bgColor={platformsButtonBG}
                                borderRadius='5'
                                overflowX='auto'
                                minH='10.5vw'
                                padding={1}
                            >
                                <HStack ml={4} pt={2}>
                                    <Text
                                        fontSize='110%'
                                        fontWeight='medium'
                                    >
                                        Featured Quizzes
                                    </Text>
                                    {isOwner && !preview ? (
                                        <Tag className="disable-select" variant="subtle" colorScheme="orange"
                                            _hover={{cursor:"pointer", opacity:"85%"}}
                                            onClick={() => setIsAddingFeaturedQuiz(true)}
                                            >
                                            <TagLeftIcon as={AddIcon} />
                                            <TagLabel pos="relative" top='1px'> Add Quiz </TagLabel>
                                        </Tag>
                                    ) : (
                                        ''
                                    )}
                                </HStack>

                                {/* QUIZZES */}
                                <Flex
                                    ml={2}
                                    mt={2}
                                    spacing='4%'
                                    display='flex'
                                    flexWrap='wrap'
                                >
                                    {userData.featuredQuizzes.map(
                                        (quiz, key) => {
                                            return (
                                                <QuizCard
                                                    quiz={quiz}
                                                    width='10%'
                                                    title_fontsize='90%'
                                                    include_author={false}
                                                    char_limit={35}
                                                    key={key}
                                                    is_owner={
                                                        isOwner && !preview
                                                    }
                                                    isFeaturedQuiz={true}
                                                    handleDeleteFeaturedQuiz={
                                                        handleDeleteFeaturedQuiz
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </Flex>
                            </Box>
                            <Box
                                w='100%'
                                boxShadow="0 0 3px #ccc;"
                                bgColor={platformsButtonBG}
                                borderRadius='5'
                                overflowX='auto'
                                minH='12vw'
                                padding={1}
                            >
                                <HStack ml={4} pt={2}>
                                    <Text
                                        fontSize='110%'
                                        fontWeight='medium'
                                    >
                                        Featured Platforms
                                    </Text>
                                    {isOwner && !preview ? (
                                        <Tag className="disable-select" variant="subtle" colorScheme="orange"
                                            _hover={{cursor:"pointer", opacity:"85%"}}
                                            onClick={() => setIsAddingFeaturedPlatform(true)}
                                            >
                                            <TagLeftIcon as={AddIcon} />
                                            <TagLabel pos="relative" top='1px'> Add Platform </TagLabel>
                                        </Tag>
                                    ) : (
                                        ''
                                    )}
                                </HStack>
                                {/* Platforms */}
                                <Flex
                                    ml='1%'
                                    mt='.5%'
                                    spacing='4%'
                                    display='flex'
                                    flexWrap='wrap'
                                >
                                    {userData.featuredPlatforms.map(
                                        (platform, key) => {
                                            return (
                                                <PlatformCard
                                                    platform={platform}
                                                    width='25%'
                                                    // minWidth='200px'
                                                    img_height='60px'
                                                    char_limit={44}
                                                    key={key}
                                                    isOwner={
                                                        isOwner && !preview
                                                    }
                                                    handleDeleteFeaturedPlatform={
                                                        handleDeleteFeaturedPlatform
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </Flex>
                            </Box>
                        </VStack>
                    </Box>

                    {/* BIOGRAPHY */}
                    {isOwner && !preview ? (
                        <Tooltip
                            label='Edit Profile Bio'
                            placement='top'
                            fontSize='100%'
                            bgColor={bannerEditBG}
                        >
                            <Box
                                boxShadow="0 0 3px #ccc;"
                                padding={1}
                                minWidth='100px'
                                bgColor={platformsButtonBG}
                                borderRadius='5'
                                overflow='hidden'
                                _hover={{cursor:"pointer"}}
                                onClick={() => {
                                    setEditBio(true);
                                    setUnsavedChanges(true);
                                }}
                            >
                                <Text
                                    pl={3}
                                    pt={2}
                                    fontSize='110%'
                                    fontWeight='medium'
                                >
                                    Biography
                                </Text>
                                {editBio ? (
                                    <Center>
                                        <Textarea
                                            w='95%'
                                            backgroundColor={whiteBlackBG}
                                            value={bio}
                                            onChange={(event) =>
                                                updateBio(event.target.value)
                                            }
                                        />
                                    </Center>
                                ) : (
                                    <Text
                                        pl={3}
                                        pt={1}
                                        pr={3}
                                    >
                                        {' '}
                                        {bio}{' '}
                                    </Text>
                                )}
                            </Box>
                        </Tooltip>
                    ) : (
                        <Box
                            minWidth='100px'
                            boxShadow="0 0 3px #ccc;"
                            bgColor={platformsButtonBG}
                            borderRadius='5'
                            overflow='hidden'
                        >
                            <Text
                                pl={3}
                                pt={2}
                                fontSize='120%'
                                fontWeight='medium'
                            >
                                {' '}
                                Biography{' '}
                            </Text>{' '}
                            <Text 
                                pl={3}
                                pt={1}
                                pr={3}
                            >
                                {' '}
                                {bio}{' '}
                            </Text>
                        </Box>
                    )}
                </Grid>
            </Box>
        );
    }

    
    // Render Platforms
    function renderPlatforms() {
        let platforms = userData.platformsMade

        if (viewPlatformType === "Followed Platforms")
            platforms = userData.following

        return (
            <Box>
                <Box bgColor={platformsButtonBG} paddingBottom={5} border="1px" borderColor="gray.200" borderRadius='5'>
                    <Flex ml={4} mt={3}>
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            <Text fontSize='120%' fontWeight='medium'>
                                {userData.displayName}'s { viewPlatformType === "Followed Platforms" ? "Followed" : "" } Platforms
                            </Text>
                        </Box>
                        <Spacer />
                        <Menu>
                            <MenuButton
                                textColor="gray.600"
                                variant="none"
                                mr={2}
                                as={Button}
                                leftIcon={<BsJustifyLeft />}
                                _focus={{border:"none"}}
                            >
                                { viewPlatformType }
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => setViewPlatformType("Created Platforms") }> Created Platforms </MenuItem>
                                <MenuItem onClick={() => setViewPlatformType("Followed Platforms") }> Followed Platforms </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    <Flex
                        ml={2}
                        display='flex'
                        flexWrap='wrap'
                    >
                        {platforms.slice(0).reverse().map((platform, key) => {
                            return (
                                <PlatformCard
                                    platform={platform}
                                    width='18%'
                                    minWidth='200px'
                                    img_height='60px'
                                    char_limit={44}
                                    key={key}
                                />
                            );
                        })}
                    </Flex>
                </Box>
            </Box>
        );
    }

    // Render Quizzes
    function renderQuizzes() {
        let quizzes = userData.quizzesMade

        if (viewQuizType === "Favorited Quizzes")
            quizzes = userData.favoritedQuizzes

        return (
            <Box>
                <Box bgColor={platformsButtonBG} paddingBottom={5} borderRadius='5' border="1px" borderColor="gray.200">
                    <Flex ml={4} mt={3}>
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            <Text fontSize='120%' fontWeight='medium' whiteSpace="nowrap">
                                {userData.displayName}'s { viewQuizType === "Favorited Quizzes" ? "Favorited" : ""} Quizzes
                            </Text>
                        </Box>
                        <Spacer />
                        <Menu>
                            <MenuButton
                                textColor="gray.600"
                                variant="none"
                                mr={2}
                                as={Button}
                                leftIcon={<BsJustifyLeft />}
                                _focus={{border:"none"}}
                            >
                                { viewQuizType }
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => setViewQuizType("Created Quizzes") }> Created Quizzes </MenuItem>
                                <MenuItem onClick={() => setViewQuizType("Favorited Quizzes") }> Favorited Quizzes </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
                        {quizzes.slice(0).reverse().map((quiz, key) => {
                            return (
                                <QuizCard
                                    quiz={quiz}
                                    width='8.0%'
                                    title_fontsize='95%'
                                    include_author={false}
                                    char_limit={35}
                                    key={key}
                                />
                            );
                        })}
                    </Flex>
                </Box>
            </Box>
        );
    }

    // Renders the banner effect
    function renderBannerEffect() {
        let item_src = null

        // If user is previewing an item from the shop, use the previewed banner effect
        if (preview && itemData.type === "bannerEffect")
            item_src = itemData.item

        // If user is previewing an item from their account, use the previewed banner effect
        else
            item_src = bannerEffectPreview.item
        
        if (item_src !== null){
            return (
                <Image
                    src={item_src}
                    w="100%"
                    h='28vh'
                    minH='150px'
                    pos='absolute'
                    zIndex="1"
                    pointerEvents="none"
                />
            )
        }
    }

    // Renders the icon effect
    function renderIconEffect() {
        let item_src = null

        // If user is previewing an item from the shop, use the previewed banner effect
        if (preview && itemData.type === "iconEffect")
            item_src = itemData.item

        // If user is previewing an item from their account, use the previewed banner effect
        else
            item_src = iconEffect.item
        
        if (item_src !== null) {
            return (
                <Box
                    pos='absolute'
                    className='squareimage_container'
                    w='100%'
                    minW='75px'
                    pointerEvents="none"
                    zIndex='2'
                >
                    <Image
                        className='squareimage'
                        src={item_src}
                        objectFit='cover'
                        borderRadius='50%'
                    />
                </Box>
            )
        }
    }

    function renderBackground() {
        let item_src = null

        // If user is previewing an item from the shop, use the previewed banner effect
        if (preview && itemData.type === "background")
            return itemData.item
        
        // If user is previewing an item from their account, use the previewed banner effect
        else
            return background.item
    }

    // Render Badges
    function renderBadges() {
        return (
            <Box w="100%">
                <Center>
                    <Box w="50%" padding={5} borderRadius={5} minH="70vh" bgColor={platformsButtonBG} border="1px" borderColor="gray.300">
                        <Center>
                            <VStack mt={30}>
                                <Avatar src={userData.iconImage} size="2xl" />
                                <Text fontWeight="medium" fontSize="175%"> {userData.displayName} </Text>
                                {/* Platform Misc. Information (# Followers, # Quizzes, etc.) */}
                                <HStack>
                                    <Text fontSize="105%"> 
                                        <Icon as={BsFillFileEarmarkTextFill} mr={1} /> 
                                        { userData.quizzesMade.length } { userData.quizzesMade.length !== 1 ? "Quizzes" : "Quiz" }
                                    </Text>
                                    <Text>•</Text>
                                    <Text fontSize="105%"> 
                                        <Icon as={BsFillFileEarmarkTextFill} mr={1} /> 
                                        { userData.platformsMade.length } { userData.platformsMade.length !== 1 ? "Platforms" : "Platforms" }
                                    </Text>
                                </HStack>
                                <Text fontSize="100%" textAlign="center"> {userData.bio} </Text>
                            </VStack>
                        </Center>
                    </Box>
                </Center>
            </Box>
            // <Box>
            //     <Text pl='1.5%' pt='1%' fontSize='120%' fontWeight='medium'>
            //         Badges
            //     </Text>
            //     <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
            //         {badges.map((badge, key) => {
            //             return (
            //                 <Box key={key}>
            //                     { renderBadgeIcon(badge) }
            //                 </Box>
            //             );
            //         })}
            //     </Flex>
            // </Box>
        );
    }

    function renderBadgeIcon(badge) {
        let badge_src = null

        if (badge === "gold")
            badge_src = gold_badge

        if (badge === "silver")
            badge_src = silver_badge

        if (badge === "bronze")
            badge_src = bronze_badge

        return (
            <VStack>
                <Image w={120} h={120} src={badge_src} border="1px" borderColor="gray.100" boxShadow="md" bgColor="white" borderRadius={5} mt={5} ml={5} mr={5} />
                <Text fontSize="105%" fontWeight="medium"> Quiz Master </Text>
            </VStack>
        )
    }

    function renderBackgroundPopover() {
        if (!isOwner || preview)
            return

        return (
            <Popover placement="bottom-start">
                <PopoverTrigger>
                    <Button leftIcon={<EditIcon />} borderRadius="40" bgColor="white" textColor="blue.600" pos="relative" boxShadow="base" _focus={{outline:"none"}} >Edit Background</Button>
                </PopoverTrigger>
                <Box>
                    <PopoverContent>
                        <PopoverCloseButton />
                        <PopoverHeader fontWeight="medium"> Edit Background </PopoverHeader>
                        <PopoverBody>
                            <Stack>
                                {/* <HStack>
                                    <Text> Background Image: </Text>
                                    <input
                                        type='file'
                                        style={{ display: 'none' }}
                                        ref={hiddenPFPInput}
                                        onChange={(event) => updatePFP(event)}
                                    />
                                    <Button 
                                        variant="outline" 
                                        colorScheme="blue"
                                        _focus={{}}
                                        onClick={() => hiddenPFPInput.current.click()}
                                    > 
                                        Upload Image 
                                    </Button>
                                </HStack> */}
                                <HStack>
                                    <Text> Background: </Text>
                                    <Menu>
                                        <MenuButton w={180} as={Button} rightIcon={<ChevronDownIcon />} border="1px solid" borderColor="gray.300" _focus={{}}>
                                            { background.name }
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={() => updateBackground({name: "No Background", item: null, _id: "none"})}> No Background </MenuItem>
                                            {
                                                userData.ownedBackgrounds.map((item, key) => {
                                                    return (
                                                        <MenuItem key={key} onClick={() => updateBackground(item)}> {item.name} </MenuItem>
                                                    )
                                                })
                                            }
                                        </MenuList>
                                    </Menu>
                                </HStack>
                            </Stack>
                        </PopoverBody>
                    </PopoverContent>
                </Box>
            </Popover>
        )
    }

    return (
        <Box data-testid='main-component' minH="100vh" bgRepeat="repeat" bgImage={"url('" + renderBackground() + "')"} bgPos="center" bgSize="cover">
            {isAddingFeaturedQuiz ? (
                <Box
                    position='fixed'
                    w='100%'
                    h='100vh'
                    zIndex='3'
                    bgColor={mainBG}
                    transition='0.2s linear'
                >
                    {/* QUIZ CARDS */}
                    <Flex
                        mt='0.5%'
                        ml='1%'
                        spacing='4%'
                        display='flex'
                        flexWrap='wrap'
                    >
                        <CreateQuizCard
                            width='7.5%'
                            title_fontsize='92%'
                            type='1'
                            callback={() => history.push('/createQuiz')}
                        />
                        {userData.quizzesMade.map((quiz, key) => {
                            return (
                                <SelectQuizCard
                                    key={key}
                                    quiz={quiz}
                                    width='7.5%'
                                    title_fontsize='92%'
                                    include_author={false}
                                    char_limit={35}
                                    font_color={basicTextColor}
                                    show_stats={false}
                                    chosenQuiz={chosenFeaturedQuiz}
                                    setChosenQuiz={setChosenFeaturedQuiz}
                                />
                            );
                        })}
                    </Flex>

                    {/* Cancel Selecting a quiz */}
                    <HStack
                        w='100%'
                        spacing='1%'
                        pos='fixed'
                        bottom='3%'
                        right='-83%'
                    >
                        <Button
                            bgColor={cancelButtonBG}
                            textColor='white'
                            fontSize='120%'
                            pt='1.3%'
                            pb='1.3%'
                            pl='1.5%'
                            pr='1.5%'
                            onClick={() => {
                                setIsAddingFeaturedQuiz(false);
                                setChosenFeaturedQuiz(null);
                            }}
                        >
                            Cancel
                        </Button>

                        {/* Finish selecting a quiz */}
                        <Button
                            bgColor='blue.500'
                            textColor='white'
                            fontSize='120%'
                            pt='1.3%'
                            pb='1.3%'
                            pl='1.5%'
                            pr='1.5%'
                            onClick={() => {
                                handleAddFeaturedQuiz();
                            }}
                        >
                            Finish
                        </Button>
                    </HStack>
                </Box>
            ) : null}
            {isAddingFeaturedPlatform ? (
                <Box
                    position='fixed'
                    w='100%'
                    h='100vh'
                    zIndex='3'
                    bgColor='rgba(0, 0, 0, 0.9)'
                    transition='0.2s linear'
                >
                    {/* QUIZ CARDS */}
                    <Flex
                        mt='0.5%'
                        ml='1%'
                        spacing='4%'
                        display='flex'
                        flexWrap='wrap'
                    >
                        {userData.platformsMade.map((platform, key) => {
                            return (
                                <SelectPlatformCard
                                    key={key}
                                    platform={platform}
                                    width='15%'
                                    minWidth='200px'
                                    img_height='60px'
                                    char_limit={44}
                                    key={key}
                                    setChosenPlatform={
                                        setChosenFeaturedPlatform
                                    }
                                    chosenPlatform={chosenFeaturedPlatform}
                                />
                            );
                        })}
                    </Flex>

                    {/* Cancel Selecting a quiz */}
                    <HStack
                        w='100%'
                        spacing='1%'
                        pos='fixed'
                        bottom='3%'
                        right='-83%'
                    >
                        <Button
                            bgColor={cancelButtonBG}
                            textColor='white'
                            fontSize='120%'
                            pt='1.3%'
                            pb='1.3%'
                            pl='1.5%'
                            pr='1.5%'
                            onClick={() => {
                                setIsAddingFeaturedPlatform(false);
                                setChosenFeaturedPlatform(null);
                            }}
                        >
                            Cancel
                        </Button>

                        {/* Finish selecting a quiz */}
                        <Button
                            bgColor={selectButtonBG}
                            textColor='white'
                            fontSize='120%'
                            pt='1.3%'
                            pb='1.3%'
                            pl='1.5%'
                            pr='1.5%'
                            onClick={() => {
                                handleAddFeaturedPlatform();
                            }}
                        >
                            Finish
                        </Button>
                    </HStack>
                </Box>
            ) : null}

            {/* HEADER BUTTONS */}
            <Grid
                bgColor="white"
                w='100%'
                h='6vh'
                minH='50px'
                templateColumns='1fr 1fr 1fr 1fr'
                boxShadow="md"
            >
                {
                    headerSections.map((section, key) => {
                        return (
                            <Box className="disable-select" pos="relative" key={key} display="flex" flexDir="column" justifyContent="center">
                                <Text
                                    key={key}
                                    w='100%'
                                    fontSize='125%'
                                    textColor={ page === section.pageId ? accountButtonsText : accountButtonsText2 }
                                    textAlign="center"
                                    transition=".1s linear"
                                    whiteSpace="nowrap"
                                    _focus={{ boxShadow:'none' }}
                                    _hover={{ cursor:'pointer', opacity:"70%", transition:".15s linear" }}
                                    onClick={() => setPage(section.pageId)}
                                >
                                    <Icon as={section.icon} pos="relative" top={-0.5}  mr={2} />
                                    { section.pageName }
                                </Text>
                                <Center>
                                    <Box pos="absolute" bottom="0px" w="70%" h="4px" bgColor={page === section.pageId ? "blue.500" : "" }  transition="0.15s linear"/>
                                </Center>
                            </Box>
                        )
                    })
                }
            </Grid>
            
            {/* Main Grid */}
            <Grid templateColumns='1fr 7fr 1fr' mt={5}>
                <Box w="100%">
                    <Center>
                        {preview ? (
                            <Button
                                textColor="blue.600"
                                _focus={{ border: 'none' }}
                                leftIcon={<ArrowBackIcon />} 
                                borderRadius="40"
                                boxShadow="base"
                                onClick={() =>
                                    history.push({
                                        pathname: '/shoppingpage',
                                        state: {
                                            item: itemData,
                                            page: location.state.prevSection,
                                            pageNum: location.state.prevPageNum,
                                        },
                                    })
                                }
                            >
                                Back to Shop
                            </Button>
                        ) : null}
                    </Center>
                </Box>

                {/* MAIN CONTENT */}
                <Box w='100%'>
                    {renderPage()}
                </Box>
                
                
                <Box>
                    <Center>
                        { renderBackgroundPopover() }
    
                    </Center>
                </Box>
            </Grid>

            {/* FOOTER */}
            {unsavedChanges ? (
                <Box
                    w='100%'
                    h='7vh'
                    pos='fixed'
                    bottom='0'
                    bgColor={platformsButtonBG}
                    borderTop='1px solid'
                    borderColor='gray.300'
                >
                    <Center>
                        <HStack
                            position='absolute'
                            top='50%'
                            transform='translateY(-50%)'
                        >
                            <Button
                                minW='100px'
                                pl='35px'
                                pr='35px'
                                pt='25px'
                                pb='25px'
                                fontSize='125%'
                                fontWeight='normal'
                                bgColor='red.600'
                                textColor='white'
                                _hover={{ bgColor: 'red.500' }}
                                _active={{ bgColor: 'red.400' }}
                                _focus={{ border: 'none' }}
                                onClick={() => cancelEditing()}
                            >
                                Cancel
                            </Button>

                            <Button
                                minW='100px'
                                pl='35px'
                                pr='35px'
                                pt='25px'
                                pb='25px'
                                fontSize='125%'
                                fontWeight='normal'
                                bgColor='purple.600'
                                textColor='white'
                                _hover={{ bgColor: 'purple.500' }}
                                _active={{ bgColor: 'purple.400' }}
                                _focus={{ border: 'none' }}
                                onClick={() => handleUpdateUser()}
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </Center>
                </Box>
            ) : null}
            {/* {renderPage()} */}
        </Box>
    );
}

const UPDATE_USER = gql`
    mutation ($userInput: UserInput!) {
        updateUser(userInput: $userInput) {
            _id
            displayName
            iconImage
            bio
            title
            bannerImage
            quizzesMade {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                user {
                    displayName
                }
            }
            platformsMade {
                _id
                iconImage
                name
                user {
                    displayName
                }
            }
            featuredQuizzes {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                user {
                    displayName
                }
            }
            featuredPlatforms {
                _id
                iconImage
                name
                user {
                    displayName
                }
            }
        }
    }
`;
