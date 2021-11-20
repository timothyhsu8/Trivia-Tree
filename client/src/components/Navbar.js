import { Box, Input, Grid, Text, Select, Button, Icon, HStack, Image, Spacer, Menu, MenuButton, MenuList, MenuItem, Flex, 
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'
import { BsShopWindow } from "react-icons/bs"
import { config } from '../util/constants';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useContext, useState, useRef } from 'react';
import coin from '../images/coin.png';
import { useMutation, gql } from '@apollo/client';
import guestImage from '../images/guest.png';
import '../styles/styles.css'

export default function Navbar() {
    const { user } = useContext(AuthContext);
    let userId = null;
    
    const cancelRef = useRef()
    const [searchType, setSearchType] = useState('All')
    const [searchText, setSearchText] = useState("")
    const [choosePlatformName, setChoosePlatformName] = useState(false)
    const [chosenPlatformName, setChosenPlatformName] = useState("Untitled Platform")
    const maxPlatformName = 35

    let history = useHistory();
    let logged_in = false
    let categories = ["All", "Quizzes", "Platforms", "Users"]
    let username = "Guest"
    let pfp_src = {guestImage}
    let menu_bg_hover = "blue.500"
    let menu_text_hover = "white"
    let currency = 0;

    const [createPlatform] = useMutation(CREATE_PLATFORM, {
        onCompleted(platform) {
            history.push('/platformpage/' + platform.createPlatform._id);
        },
        onError(err) {
            console.log(err);
        },
    });

    function handleCreatePlatform() {
        setChoosePlatformName(false)
        createPlatform({
            variables: {
                platformInput: {
                    name: chosenPlatformName,
                    iconImage: "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/coding-vs-programming-2.jpg",
                    bannerImage: "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/what-is-coding.png",
                    background: "white",
                    tags: []
                },
            },
        });
        setChosenPlatformName("Untitled Platform")
    }

    // Checks if user is logged in
    if (user !== null && user !== "NoUser"){
        logged_in = true
        username = user.displayName
        currency = user.currency
        pfp_src = user.iconImage
        userId = user._id
    }

    // Allows search to work when 'Enter' key is pressed
    const handleKeyPress = (e) => {
        if (e.charCode === 13) search();
    };

    // Takes user to the search results page
    function search() {
        history.push({
            pathname: '/searchresultspage',
            state: {
                // location state
                search: searchText,
                searchType: searchType
            },
        });
    }

    function goToAccountPage() {
        if (logged_in){
            history.push({
                pathname: '/accountpage/' + user._id,
                state: {
                    // location state
                    search: searchText,
                },
            });
        }

        else {
            history.push({
                pathname: '/loginpage',
                state: {
                    // location state
                    search: searchText,
                },
            });
        }
    }

    return(
        <Box w="100%" h="55px" position='sticky' top='0' zIndex='9999' bgColor="red.900">
            <Grid templateColumns="2fr 3fr 2fr" pos="relative" top="6%">
                {/* RETURN TO HOMEPAGE */}
                <Text
                    className='disable-select'
                    onClick={() => history.push('/')}
                    display='inline-block'
                    _hover={{
                        cursor: 'pointer',
                        opacity: '80%',
                        transition: 'opacity 0.2s linear',
                    }}
                    transition='opacity 0.2s linear'
                    ml='2%'
                    color='white'
                    fontSize='200%'
                    whiteSpace="nowrap"
                >
                    Trivia Tree
                </Text>
                
                {/* SEARCH */}
                <Grid
                    h='50px'
                    pos='relative'
                    top='3%'
                    templateColumns='3fr 12fr 1fr'
                >
                    {/* SEARCH CATEGORIES */}
                    <Select h="45px" value={searchType} onChange={(event) => setSearchType(event.target.value)} borderRadius="5px 0px 0px 5px" bgColor="white" _focus={{boxShadow:"none"}} overflow="hidden"> 
                        {categories.map((category, index) => {
                            return <option key={index}> {category} </option>;
                        })}
                    </Select>

                    {/* SEARCH BAR */}
                    <Input h="45px" onKeyPress={handleKeyPress} 
                        onChange={(e) => setSearchText(e.target.value)} 
                        fontSize="17px" 
                        borderRadius="0px" 
                        placeholder="Search for a quiz..." 
                        bgColor="white"
                        _focus={{boxShadow:"none"}}
                    />

                    {/* SEARCH BUTTON */}
                    <Button
                        h='45px'
                        _hover={{ bgColor: 'yellow.400' }}
                        borderRadius='0px 5px 5px 0px'
                        bgColor='yellow.500'
                        onClick={search}
                        _focus={{boxShadow:"none"}}
                    >
                        <Icon as={SearchIcon} boxSize='6' />
                    </Button>
                </Grid>

                {/* RIGHT SIDE */}
                <HStack overflow="hidden">
                    <Box w='5%' />
                    {/* CATEGORIES */}
                    <Link to='/categorypage'>
                        <Text className="disable-select" fontSize='105%' color='white' fontWeight='medium'>
                            Categories
                        </Text>
                    </Link>
                    <Spacer />

                    <Link to="/shoppingpage"> 
                        <Icon as={BsShopWindow} color="white"></Icon>
                    </Link>
                    
                    <Spacer />

                    {/* USER NAME */}
                    <Text className="disable-select" onClick={() => goToAccountPage()} fontSize="105%" color="white" fontWeight="medium" _hover={{cursor:"pointer"}}> {username} </Text> 

                    {/* PROFILE PICTURE */}
                    <Box className='squareimage_container' w="8%" minW="30px"> 
                        <Image className="squareimage" onClick={() => goToAccountPage()} src={pfp_src} fallbackSrc={guestImage} objectFit="cover" border="2px solid white" borderRadius="50%" _hover={{cursor:"pointer"}}></Image>
                    </Box>

                    <Flex direction="row">
                        <Image src={coin} h="20px" w="20px" position="relative" top="3px"></Image>
                        <Text fontSize="16px" position="relative" color="white" left="6px" top="1px">{currency}</Text>
                    </Flex>

                    <Box w='1%' />

                    {/* DROPDOWN MENU */}
                    <Menu>
                        <MenuButton as={HamburgerIcon} boxSize='6' color='white' _hover={{ cursor: 'pointer' }} />
                            <MenuList>
                                {/* Create Quiz / Create Platform / Quiz Manager / Platform Manager Buttons */}
                                {logged_in === true ? (
                                    <Box>
                                        <MenuItem onClick={() => history.push('/createQuiz')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Create Quiz   </MenuItem>
                                        <MenuItem onClick={() => setChoosePlatformName(true)} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Create Platform  </MenuItem>
                                        <MenuItem onClick={() => history.push('/quizmanager')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Quiz Manager     </MenuItem>
                                        <MenuItem onClick={() => history.push('/platformmanager/' + user._id)} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Platform Manager </MenuItem>
                                    </Box>) 
                                    : 
                                    null
                                }
                                
                                {/* Settings Page Button */}
                                <MenuItem onClick={() => history.push(user !== "NoUser" ? '/settingspage/' + userId :'/loginpage')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Settings </MenuItem>
                                
                                {/* Rewards Button / Logout Button */}
                                {logged_in === true ? 
                                    <Box>
                                        <MenuItem onClick={() => history.push('/rewardspage')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> My Rewards</MenuItem>
                                        <a href={`${config.API_URL}/auth/logout`}>
                                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Logout </MenuItem>
                                        </a>
                                    </Box>
                                    : 
                                    null
                                }
                            </MenuList>
                    </Menu>
                    <Box w='1%' />
                </HStack>
            </Grid>
            
            {/* Platform Name Input (For Creating Platforms) */}
            <AlertDialog
                isOpen={choosePlatformName}
                leastDestructiveRef={cancelRef}
                onClose={() => setChoosePlatformName(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent top="30%">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Choose A Platform Name
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Input 
                                maxLength={maxPlatformName}
                                borderColor="gray.300" 
                                value={chosenPlatformName} 
                                onChange={(e) => 
                                    setChosenPlatformName(e.target.value)
                                }/>
                            <Text float="right" fontSize="85%" color={ chosenPlatformName.length === maxPlatformName ? "red.500" : "gray.800" }>  
                                {chosenPlatformName.length}/{maxPlatformName} 
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button 
                            ref={cancelRef} 
                            onClick={() => {
                                setChoosePlatformName(false)
                                setChosenPlatformName("Untitled Platform")
                            }} 
                            _focus={{border:"none"}}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="blue"  
                            ml={3} 
                            bgColor={chosenPlatformName.trim() !== "" ? "" : "gray.400"}
                            _hover={{bgColor: chosenPlatformName.trim() !== "" ? "blue.600" : "gray.400"}}
                            _active={{bgColor: chosenPlatformName.trim() !== "" ? "blue.700" : "gray.400"}}
                            _focus={{border:"none"}}
                            onClick={() => chosenPlatformName.trim() !== "" ? handleCreatePlatform() : null}
                        >
                            Create Platform
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

const CREATE_PLATFORM = gql`
    mutation ($platformInput: PlatformInput!) {
        createPlatform(platformInput: $platformInput) {
            name
            _id
        }
    }
`;