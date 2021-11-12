import { Box, Grid, Input, Text, Select, Button, Icon, HStack, Image, Spacer, Menu, MenuButton, MenuList, MenuItem, Flex } from "@chakra-ui/react"
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'
import { BsShopWindow } from "react-icons/bs"
import { config } from '../util/constants';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useContext, useState } from 'react';
import coin from '../images/coin.png';
import { useMutation, gql } from '@apollo/client';
import guestImage from '../images/guest.png';
import '../styles/styles.css'

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const [searchType, setSearchType] = useState('All')
    const [searchText, setSearchText] = useState("")

    let history = useHistory();
    let logged_in = false
    let categories = ["All", "Quizzes", "Platforms"]
    let username = "Guest"
    let pfp_src = {guestImage}
    let menu_bg_hover = "blue.500"
    let menu_text_hover = "white"
    let currency = 0;

    const [createPlatform] = useMutation(CREATE_PLATFORM, {
        update() {
            history.push('/');
        },
        onError(err) {
            console.log(err);
        },
    });

    function handleCreatePlatform() {
        createPlatform({
            variables: {
                platformInput: {
                    name: "Untitled Platform",
                    iconImage: "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/coding-vs-programming-2.jpg",
                    bannerImage: "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/what-is-coding.png",
                    background: "white",
                    tags: ["Programming"]
                },
            },
        });
    }

    // Checks if user is logged in
    if (user !== null && user !== "NoUser"){
        logged_in = true
        username = user.googleDisplayName
        currency = user.currency
        pfp_src = user.iconImage
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

    // Conditional rendering of logout button in the dropdown menu
    function renderLogout() {
        if (logged_in === false)
            return

        return <MenuItem fontSize="18px" fontWeight="medium"> Logout </MenuItem>
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
                    pos='relative'
                    left='2%'
                    color='white'
                    fontSize='200%'
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
                            return <option key={index} on> {category} </option>;
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
                    <Box className='squareimage_container' w="8%"> 
                        <Image className="squareimage" onClick={() => goToAccountPage()} src={pfp_src} fallbackSrc={guestImage} objectFit="cover" border="2px solid white" borderRadius="50%" _hover={{cursor:"pointer"}}></Image>
                    </Box>

                    <Flex direction="row">
                        <Image src={coin} h="20px" w="20px" position="relative" top="3px"></Image>
                        <Text fontSize="16px" position="relative" color="white" left="6px" top="1px">{currency}</Text>
                    </Flex>

                    <Box w='1%' />

                    {/* DROPDOWN MENU */}
                    <Menu>
                        <MenuButton
                            as={HamburgerIcon}
                            boxSize='6'
                            color='white'
                            _hover={{ cursor: 'pointer' }}
                        >
                            {' '}
                            dasfs
                        </MenuButton>
                        <MenuList>
                            <Link to='/createQuiz'><MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Create Quiz      </MenuItem></Link>
                            <MenuItem onClick={() => handleCreatePlatform()} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Create Platform  </MenuItem>
                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Quiz Manager     </MenuItem>
                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Platform Manager </MenuItem>
                            <Link to='/settingspage'><MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Settings         </MenuItem></Link>
                            
                            {/* Logout Button */}
                            {logged_in === true ? (
                                
                                <a href={`${config.API_URL}/auth/logout`}>
                                    <Link to='/rewardspage'><MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> My Rewards</MenuItem></Link>
                                    <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Logout </MenuItem>
                                </a>
                                
                            ) : (
                                null
                            )}
                        </MenuList>
                    </Menu>
                    <Box w='1%' />
                </HStack>
            </Grid>
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