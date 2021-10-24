import { Box, Grid, Input, Text, Select, Button, Icon, HStack, Image, Spacer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';

export default function Navbar() {

    let categories = ["All Quizzes", "Other"]

    let user = "User1849021"
    let pfp_src = "https://yt3.ggpht.com/ytc/AKedOLTcxhIAhfigoiA59ZB6aB8z4mruPJnAoBQNd6b0YA=s900-c-k-c0x00ffffff-no-rj"

    return(
        <Box w="100%" h="55px" bgColor="red.900">
            <Grid templateColumns="2fr 3fr 2fr" pos="relative" top="9%">
                {/* ICON */}
                <Text pos="relative" left="2%" color="white" fontSize="30"> 
                    <Link to='/'> Trivia Tree </Link> 
                </Text>

                {/* SEARCH BAR */}
                <Grid h="50px" templateColumns="3fr 12fr 1fr"> 
                    <Select h="45px" borderRadius="5px 0px 0px 5px" bgColor="white"> 
                        {categories.map((category) => {
                            return <option>{category}</option>
                        })}
                    </Select>
                    <Input h="45px" fontSize="17px" borderRadius="0px" placeholder="Search for a quiz..." bgColor="white"/>
                    <Button h="45px" borderRadius="0px 5px 5px 0px" bgColor="yellow.500">
                        <Icon as={SearchIcon} boxSize="6" />
                    </Button>
                </Grid>
                
                {/* RIGHT SIDE */}
                <HStack>
                    <Spacer />

                    {/* CATEGORIES */}
                    <Link to="/">
                        <Text fontSize="18px" color="white" fontWeight="medium"> Categories </Text>
                    </Link>
                    
                    <Box w="5%"/>

                    {/* DROPDOWN MENU */}
                    <Menu>  
                        <MenuButton as={HamburgerIcon} boxSize="6" color="white" _hover={{cursor:"pointer"}}> dasfs</MenuButton>
                        <MenuList>
                            <MenuItem fontSize="18px" fontWeight="medium"> Create Quiz </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Create Platform </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Quiz Manager </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Platform Manager </MenuItem>
                            <MenuItem fontSize="18px" fontWeight="medium"> Settings </MenuItem>
                        </MenuList>
                    </Menu>

                    <Box w="3%"/>
                    
                    {/* USER NAME */}
                    <Link to='/accountpage'> 
                        <Text fontSize="18px" color="white" fontWeight="medium"> {user} </Text> 
                    </Link>
                    
                    {/* PROFILE PICTURE */}
                    <Link to='/accountpage'> 
                        <Image w="45px" src={pfp_src} borderRadius="150" border="2px solid white" /> 
                    </Link>
                </HStack>
            </Grid>
        </Box>
    )
}