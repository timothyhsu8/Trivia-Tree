import { Box, Grid, Text, Image, Center, Button, HStack, Icon, ButtonGroup, Avatar, Spinner,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useColorModeValue} from '@chakra-ui/react';
import ShopItemCard from '../components/ShoppingPage/ShopItemCard'
import treeshop from '../images/treeshop.png'
import coin from '../images/coin.png'
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import React, { useState, useContext, useEffect, useRef } from 'react';
import '../styles/ShoppingPage.css';

import { useQuery, useMutation } from '@apollo/client';
import { GET_SHOP_ITEMS } from '../cache/queries';
import { PURCHASE_ITEM } from '../cache/mutations'
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { BsBookmarkStarFill, BsImageFill, BsPersonCircle, BsStars } from 'react-icons/bs';

export default function ShoppingPage() {
    let history = useHistory();

    const cancelRef = useRef()
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState('bannerEffects');
    const [pageNum, setPageNum] = useState(0);
    const [showPurchaseScreen, setShowPurchaseScreen] = useState(false)
    const [itemToPurchase, setItemToPurchase] = useState(null)
    const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(false)

    const [dialogue, setDialogue] = useState(
        {
            header: "",
            body: "",
            reloadOnClose: false
        }
    )
    const [showDialogue, setShowDialogue] = useState(false) // Used for displaying various alert messages

    // Maps out information needed for the header sections at the top
    const headerSections = [
        {
            pageName: "Banner Effects",
            pageId: 'bannerEffects',
            icon: BsStars,
        },
        {
            pageName: "Icon Effects",
            pageId: 'iconEffects',
            icon: BsPersonCircle,
        },
        {
            pageName: "Backgrounds",
            pageId: 'backgrounds',
            icon: BsImageFill,
        },
        {
            pageName: "Weekly Specials",
            pageId: 'weeklySpecials',
            icon: BsBookmarkStarFill,
        }
    ]

    const [purchaseItem] = useMutation(PURCHASE_ITEM, {
        onCompleted() {
            setDialogue({
                header: "Purchase Successful",
                body: "Item purchased successfully.",
                reloadOnClose: true
            })
            setShowDialogue(true)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })
    
    // Reloads the page after a succesful purchase
    function reloadPage() {
        history.go(0)
    }

    // Only runs once when the page is first loaded
    useEffect(() => {
        // Restore previous state (If user is coming from the preview page)
        if (location.state !== undefined && itemToPurchase === null) { 
            setShowPurchaseScreen(true)
            setItemToPurchase(location.state.item)
            setPage(location.state.page)
            setPageNum(location.state.pageNum)
        }
    }, [])


    const shopItems = useQuery(GET_SHOP_ITEMS, { fetchPolicy: 'cache-and-network' })
    const loading = shopItems.loading
    const error = shopItems.error

    //Dark mode styling
    const shopCategoryButtonBG=useColorModeValue('blue.500', 'blue.200')
    const shopCategoryButtonBG2=useColorModeValue('gray.700', 'gray.300')

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

    // Get item arrays for each section
    const bannerEffects = shopItems.data.getShopItems[0]
    const iconEffects = shopItems.data.getShopItems[1]
    const backgrounds = shopItems.data.getShopItems[2]
    const weeklySpecials = shopItems.data.getShopItems[3]

    // Get total pages for each item array
    const numBannerPages = Math.ceil(bannerEffects.length/4)
    const numIconPages = Math.ceil(iconEffects.length/4)
    const numBackgroundPages = Math.ceil(backgrounds.length/4)
    const numSpecialPages = Math.ceil(weeklySpecials.length/4)

    // Makes sure user is logged in
    if (user === null || user === "NoUser")
        return (
            <Box />
        )

    return (
        <Box>
            <Button pos="absolute" variant="outline" leftIcon={<ArrowBackIcon />} colorScheme="blue" ml={10} mt={6} onClick={() => history.goBack()}> Back </Button>

            {/*Shop Banner*/}
            <Center>
                <Image pt={5} src={treeshop} alt={"Tree Shop Banner"} />
            </Center>
            
            {
                // Render Purchase Screen
                showPurchaseScreen && itemToPurchase !== null ? 
                <Box>
                    <Grid templateColumns="5fr 4fr">
                        <Box>
                            <Box w="100%" minW={500} mt="12%" pos="relative" display="flex" justifyContent="center">
                                <Image pos="absolute" w="70%" h="25vh" src={itemToPurchase.item} fit={itemToPurchase.type === "background" ? "cover" : "" } borderTopRadius={itemToPurchase.type === "background" ? "5" : "0"} />
                                <Image w="70%" h="25vh" fit="cover" borderRadius={5} src={itemToPurchase.template} />
                            </Box>
                            <Center>
                                <Button variant="outline" colorScheme="blue" mt={5} size="lg"  _focus={{border:"blue.400"}} onClick={() => previewItem()}> Preview Item </Button>
                            </Center>
                        </Box>

                        {/* Name, Price, Purchase Buttons */}
                        <Box>
                            <Box mt="12%">
                                <Text fontSize="300%" fontWeight="thin"> {itemToPurchase.name} </Text>
                                <Text fontSize="200%" fontWeight="thin"> Banner Effect </Text>

                                <HStack mt="2%">
                                    <Avatar size="md" src={coin}/>
                                    <Text fontSize="150%" fontWeight="thin"> {itemToPurchase.price} </Text>
                                </HStack>

                                <ButtonGroup mt="6%" spacing={10}>
                                    <Button size="lg" colorScheme="gray" bgColor="gray.200" 
                                        _hover={{bgColor: "gray.300"}}
                                        _active={{bgColor: "gray.400"}}
                                        _focus={{border:"none"}}
                                        onClick={() => setShowPurchaseScreen(!showPurchaseScreen)}
                                    > 
                                        Back To Shop 
                                    </Button>
                                    <Button size="lg" colorScheme="blue" 
                                        _focus={{border:"none"}} 
                                        onClick={() => setShowPurchaseConfirmation(true)}
                                    > 
                                        Purchase 
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        </Box>
                    </Grid>
                </Box>
                :
                // Render Shop Items
                <Box>
                    {/* Navigate between categories (Header Buttons) */}
                    <Grid w='100%' h='6vh' minH='50px' templateColumns='repeat(4, 1fr)'>
                        {headerSections.map((headerSection, key) => {
                            return (
                                <Box className="disable-select" key={key} display="flex" flexDir="column" justifyContent="center">
                                    <Text
                                        w='100%'
                                        fontSize='130%'
                                        fontWeight="thin"
                                        textColor={page === headerSection.pageId ? shopCategoryButtonBG : shopCategoryButtonBG2}
                                        textAlign="center"
                                        transition=".1s linear"
                                        whiteSpace="nowrap"
                                        _focus={{ boxShadow:'none' }}
                                        _hover={{ cursor:'pointer', opacity:"70%", transition:".15s linear" }}
                                        onClick={() => {
                                            setPage(headerSection.pageId)
                                            goToPage(0)
                                        }}
                                    >
                                        <Icon as={headerSection.icon} pos="relative" top={-0.5}  mr={2} />
                                        {headerSection.pageName}
                                    </Text>
                                    {/* <Box h="4px" mt="3%" bgColor={page === headerSection.pageId  ? "blue.500" : "gray.400" }  transition="0.15s linear"/> */}
                                </Box>
                            )
                        } )}
                    </Grid>

                    <Center>
                        <Box w="90%" h="0.75px" bgColor="gray.300" />    
                    </Center>

                    {/* Main Body */}
                    <Box>
                        <Grid templateColumns="1fr 15fr 1fr">
                            {/* Left Arrow */}
                            {
                                pageNum === 0 ? <Box /> :
                                    <Box onClick={() => setPageNum(pageNum - 1)} transition=".15s linear" _hover={{cursor:"pointer", bgColor:"gray.100", transition:".15s linear"}}
                                        display="flex" flexDir="column" justifyContent="center"> 
                                        <Center>
                                            <Icon as={ChevronLeftIcon} boxSize={16}/>
                                        </Center>
                                    </Box>
                            }
                            
                            {/* Shop Items */}
                            {renderPage()}

                            {/* Right Arrow */}
                            {
                                pageNum === totalPageCount() - 1 ? <Box /> :
                                    <Box onClick={() => setPageNum(pageNum + 1) }  transition=".15s linear" _hover={{cursor:"pointer", bgColor:"gray.100", transition:".15s linear"}}
                                        display="flex" flexDir="column" justifyContent="center"> 
                                        <Center>
                                            <Icon as={ChevronRightIcon} boxSize={16} />
                                        </Center>
                                    </Box>
                            }
                        </Grid>

                        {/* Page Buttons */}
                        <Center>
                            <HStack mt={5}>
                                {pageButtons(pageNum, totalPageCount())}
                            </HStack>
                        </Center>
                    </Box>
                </Box>
            }

            {renderPurchaseConfirmation()}
            {renderDialogue()}
        </Box>
    )


    function totalPageCount(){
        if (page === 'bannerEffects') return numBannerPages;
        if (page === 'iconEffects') return numIconPages;
        if (page === 'backgrounds') return numBackgroundPages;
        if (page === 'weeklySpecials') return numSpecialPages;
    }


    // Renders the page buttons at the bottom of the screen
    function pageButtons(current, total){
        let list = []
        for (let i = 0; i < total; i++) {
            if (current === i) {
                list.push(
                <Button 
                    bgColor="gray.500"
                    _hover={{bgColor:"gray.600"}} 
                    _active={{bgColor:"gray.700"}} 
                    _focus={{border:"none"}}
                    borderRadius="50%"
                    onClick={() => goToPage(i)}
                    color="white"
                >
                    {i+1}
                </Button>
                )}
            else{
                list.push(
                    <Button 
                        bgColor="gray.300"
                        _hover={{bgColor:"gray.400"}} 
                        _active={{bgColor:"gray.500"}} 
                        _focus={{border:"none"}}
                        borderRadius="50%"
                        onClick={() => { goToPage(i)}}
                    >
                    {i+1}
                    </Button>
                )
            }
        }
        return list            
    }

    // Displays the shop items based on which category they're currently viewing (Banner effects, Icon effects, Backgrounds, Weekly Specials)
    function itemStocker(pageIndex, itemArr) {
        // Denote the items that should be shown in the shop (4 at a time)
        let startIndex = pageIndex * 4
        let endIndex = startIndex + 4
        
        let numItemsShowing = 0
        return (
            <Box>
                <Grid ml="4%" mr="4%" templateColumns="1fr 1fr" alignItems="center" justifyContent="center">
                    {itemArr.slice(startIndex, endIndex).map((item, key) => {
                        numItemsShowing++

                        return (
                            <Center>
                                <ShopItemCard item={item} key={key} isOwned={itemIsOwned(item)} callback={itemClicked} />
                            </Center>
                        )
                    })}
                    
                    {addPadding(numItemsShowing)}   
                </Grid>
            </Box>
        )
    }
    
    // Adds padding to the bottom of the items (Otherwise, page number would get pushed upwards which we don't want)
    function addPadding(numItemsShowing) {
        if (numItemsShowing < 3) {
            let padArr = [0, 0]
            return padArr.map(() => 
                <Box> 
                    <Box h="20vh" />
                    <Box h={59} /> 
                </Box>
            )
        }
    }
    
    // Searches user array to check if they already own a shop item (Makes shop item unpurchasable)
    function itemIsOwned(item) {
        if (item.type === "bannerEffect") {
            for (const ownedItem of user.ownedBannerEffects) 
                if (ownedItem === item._id)
                    return true
        }
        
        else if (item.type === "iconEffect"){
            for (const ownedItem of user.ownedIconEffects) 
                if (ownedItem === item._id)
                    return true
        }

        else if (item.type === "background") {
            for (const ownedItem of user.ownedBackgrounds)
                if (ownedItem === item._id)
                    return true
        }

        return false
    }

    // Jumps to a page (Page numbers at the bottom)
    function goToPage(pageNum) {
        setPageNum(pageNum)
    }

    // Renders the appropriate items for the selected category
    function renderPage() {
        if (page === 'bannerEffects') return itemStocker(pageNum, bannerEffects)
        if (page === 'iconEffects') return itemStocker(pageNum, iconEffects) 
        if (page === 'backgrounds') return itemStocker(pageNum, backgrounds)
        if (page === 'weeklySpecials') return itemStocker(pageNum, weeklySpecials) 
    }

    // Shows purchase screen
    function itemClicked(item) {
        setItemToPurchase(item)
        setShowPurchaseScreen(true)
    }

    // Takes user to their account page to preview the item
    function previewItem() {
        history.push({
            pathname: '/previewpage/' + user._id + '/' + itemToPurchase.type + '=' + 0,
            state: {
                item: itemToPurchase,
                prevSection: page,
                prevPageNum: pageNum
            } 
        })
    }

    // Handles the actual purchasing of an item once the purchase is confirmed
    function handlePurchase() {
        // If user doesn't have funds, don't let them purchase
        if (user.currency < itemToPurchase.price) {
            setDialogue({
                header: "Purchase Unsuccessful",
                body: "Sorry, you cannot afford this item.",
                reloadOnClose: false
            })

            setShowDialogue(true)
            setShowPurchaseConfirmation(false)
            return
        }
        
        // Purchase Item
        purchaseItem({
            variables: {
                userId: user._id,
                itemId: itemToPurchase._id
            },
        })
        setShowPurchaseConfirmation(false)
    }

    // Shows dialog for "Are you sure you want to purchase this item?"
    function renderPurchaseConfirmation() {
        return (
            <Center>
                <AlertDialog
                    isOpen={showPurchaseConfirmation}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setShowPurchaseConfirmation(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent top="30%">
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Purchase this item?
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <Button 
                                    ref={cancelRef} 
                                    onClick={() => setShowPurchaseConfirmation(false)}
                                    _focus={{border:"none"}}
                                >
                                    Cancel
                                </Button>
                                <Button colorScheme="yellow" onClick={() => handlePurchase()} ml={3} _focus={{border:"none"}}>
                                    Purchase
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Center>
        )
    }

    // Show dialogue for 'Item Unffordable' and 'Purchase Successful'
    function renderDialogue() {
        return (
            <Center>
                <AlertDialog
                    isOpen={showDialogue}
                    leastDestructiveRef={cancelRef}
                    onClose={() => {
                        setShowDialogue(false)
                        reloadPage()
                    }}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent top="30%">
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                {dialogue.header}
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                {dialogue.body}
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button 
                                    ref={cancelRef} 
                                    onClick={() => {
                                        setShowDialogue(false)
                                        reloadPage()
                                    }}
                                    _focus={{border:"none"}}
                                >
                                    Close
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Center>
        )
    }
}