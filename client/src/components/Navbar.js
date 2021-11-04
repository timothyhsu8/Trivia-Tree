import { Box, Grid, Input, Text, Select, Button, Icon, HStack, Image, Spacer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'
import {BsShopWindow} from "react-icons/bs"
import { config } from '../util/constants';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';
import '../styles/styles.css'

export default function Navbar() {
    const { user } = useContext(AuthContext);

    let history = useHistory();
    let logged_in = false
    let search_text = ""
    let categories = ["All Quizzes", "Educational", "Entertainment", "Movies", "Sports", "TV", "Other"]
    let username = "Guest"
    let pfp_src = "https://yt3.ggpht.com/ytc/AKedOLTcxhIAhfigoiA59ZB6aB8z4mruPJnAoBQNd6b0YA=s900-c-k-c0x00ffffff-no-rj"
    let menu_bg_hover = "blue.500"
    let menu_text_hover = "white"

    // Checks if user is logged in
    if (user !== null && user !== "NoUser"){
        logged_in = true
        username = user.googleDisplayName
        // pfp_src = user.iconImage
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
                search: search_text,
            },
        });
    }

    function goToAccountPage() {
        if (logged_in){
            history.push({
                pathname: '/accountpage',
                state: {
                    // location state
                    search: search_text,
                },
            });
        }

        else {
            history.push({
                pathname: '/loginpage',
                state: {
                    // location state
                    search: search_text,
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
                <Box>
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
                        fontSize='30'
                    >
                        Trivia Tree
                    </Text>
                </Box>

                {/* SEARCH */}
                <Grid
                    h='50px'
                    pos='relative'
                    top='3%'
                    templateColumns='3fr 12fr 1fr'
                >
                    {/* SEARCH CATEGORIES */}
                    <Select h="45px" borderRadius="5px 0px 0px 5px" bgColor="white" _focus={{boxShadow:"none"}}> 
                        {categories.map((category, index) => {
                            return <option key={index}> {category} </option>;
                        })}
                    </Select>

                    {/* SEARCH BAR */}
                    <Input h="45px" onKeyPress={handleKeyPress} 
                        onChange={(e) => { search_text = e.target.value }} 
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
                <HStack>
                    <Box w='5%' />
                    {/* CATEGORIES */}
                    <Link to='/categorypage'>
                        <Text fontSize='18px' color='white' fontWeight='medium'>
                            {' '}
                            Categories{' '}
                        </Text>
                    </Link>
                    <Spacer />

                    <Link to="/shoppingpage"> 
                        <Icon as={BsShopWindow} color="white"></Icon>
                    </Link>
                    
                    <Spacer />


                    {/* USER NAME */}
                    <Text className="disable-select" onClick={() => goToAccountPage()} fontSize="18px" color="white" fontWeight="medium" _hover={{cursor:"pointer"}}> {username} </Text> 

                    {/* PROFILE PICTURE */}
                    <Box className='squareimage_container' w="8%"> 
                        <Image className="squareimage" onClick={() => goToAccountPage()} src={pfp_src} alt="Profile Picture" objectFit="cover" border="2px solid white" borderRadius="50%" _hover={{cursor:"pointer"}}></Image>
                    </Box>

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
                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Create Platform  </MenuItem>
                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Quiz Manager     </MenuItem>
                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Platform Manager </MenuItem>
                            <MenuItem fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Settings         </MenuItem>
                            
                            {/* Logout Button */}
                            {logged_in === true ? (
                                <a href={`${config.API_URL}/auth/logout`}>
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
