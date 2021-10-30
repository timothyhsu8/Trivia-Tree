import { Box, Grid, Input, Text, Select, Button, Icon, HStack, Image, Spacer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Link, useHistory } from 'react-router-dom';
import '../styles/styles.css'

export default function Navbar() {

    let history = useHistory();
    let search_text = ""
    let categories = ["All Quizzes", "Educational", "Entertainment", "Movies", "Sports", "TV", "Other"]
    let user = "User1849021"
    let pfp_src = "https://yt3.ggpht.com/ytc/AKedOLTcxhIAhfigoiA59ZB6aB8z4mruPJnAoBQNd6b0YA=s900-c-k-c0x00ffffff-no-rj"

    // Allows search to work when 'Enter' key is pressed
    const handleKeyPress = e => {
        if(e.charCode === 13)
            search()
    }

    // Takes user to the search results page
    function search() {
        history.push({
            pathname: '/searchresultspage',
            state: {  // location state
              search: search_text, 
            },
        }); 
    }

    return(
        <Box w="100%" h="55px" bgColor="red.900">
            <Grid templateColumns="2fr 3fr 2fr" pos="relative" top="6%">
                {/* RETURN TO HOMEPAGE */}
                <Box>
                    <Text 
                        className="disable-select"
                        onClick={() => history.push('/')}
                        display="inline-block"
                        _hover={{cursor:"pointer", opacity:"80%", transition:"opacity 0.2s linear"}} 
                        transition="opacity 0.2s linear"
                        pos="relative" 
                        left="2%" 
                        color="white" 
                        fontSize="30"> 
                        Trivia Tree 
                    </Text>
                </Box>

                {/* SEARCH */}
                <Grid h="50px" pos="relative" top="3%" templateColumns="3fr 12fr 1fr"> 
                    {/* SEARCH CATEGORIES */}
                    <Select h="45px" borderRadius="5px 0px 0px 5px" bgColor="white"> 
                        {categories.map((category, index) => {
                            return <option key={index}> {category} </option>
                        })}
                    </Select>
                    
                    {/* SEARCH BAR */}
                    <Input h="45px" onKeyPress={handleKeyPress} 
                        onChange={(e) => { search_text = e.target.value }} 
                        fontSize="17px" 
                        borderRadius="0px" 
                        placeholder="Search for a quiz..." 
                        bgColor="white"
                    />
                    
                    {/* SEARCH BUTTON */}
                    <Button 
                        h="45px"
                        _hover={{bgColor:"yellow.400"}}
                        borderRadius="0px 5px 5px 0px" 
                        bgColor="yellow.500" 
                        onClick={search}
                    >
                        <Icon as={SearchIcon} boxSize="6" />
                    </Button>
                </Grid>
                
                {/* RIGHT SIDE */}
                <HStack>
                    <Box w="5%"/>
                    {/* CATEGORIES */}
                    <Link to="/categorypage">
                        <Text fontSize="18px" color="white" fontWeight="medium"> Categories </Text>
                    </Link>
                    <Spacer />                    
                    <Box w="5%"/>
                    
                    {/* USER NAME */}
                    <Link to='/accountpage'> 
                        <Text fontSize="18px" color="white" fontWeight="medium"> {user} </Text> 
                    </Link>
                    
                    {/* PROFILE PICTURE */}
                    <Box className='squareimage_container' w="8%"> 
                        <Link to='/accountpage'> 
                            <Image className="squareimage" src={pfp_src} alt="Profile Picture" objectFit="cover" border="2px solid white" borderRadius="50%"></Image>
                        </Link>
                    </Box>
             
                    <Box w="1%"/>

                     {/* DROPDOWN MENU */}
                     <Menu>  
                        <MenuButton as={HamburgerIcon} boxSize="6" color="white" _hover={{cursor:"pointer"}}> dasfs</MenuButton>
                        <MenuList>
                            <Link to='/createQuiz'><MenuItem fontSize="18px" fontWeight="medium"> Create Quiz      </MenuItem></Link>
                            <MenuItem fontSize="18px" fontWeight="medium"> Create Platform  </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Quiz Manager     </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Platform Manager </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Settings         </MenuItem>
                        </MenuList>
                    </Menu>
                    <Box w="1%"/>
                </HStack>
            </Grid>
        </Box>
    )
}