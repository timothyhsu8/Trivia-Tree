import { Box, Grid, Text, Image, Center, Button, HStack, Icon } from '@chakra-ui/react';
import ShopItemCard from '../components/ShopItemCard.js'
import guest from '../images/guest.png'
import heart from '../images/heart.jpeg'
import treeshop from '../images/treeshop.png'
import lights1 from '../images/lights1.png'
import fire1 from '../images/fire1.png'
import flowers1 from '../images/flowers1.png'
import neon1 from '../images/neon1.png'
import circleGray from '../images/circleGray.png'
import circleWhite from '../images/circleWhite.png'
import bgRoad from '../images/backgrounds/road.jpg'
import bgGlittering from '../images/backgrounds/glittering.jpg'
import bgStars from '../images/backgrounds/stars.jpg'
import bgPlants from '../images/backgrounds/plants.jpg'
import bgAbstract from '../images/backgrounds/abstract.jpg'
import { AuthContext } from '../context/auth';
import React, { useState, useContext} from 'react';
import '../styles/ShoppingPage.css';

import { useQuery } from '@apollo/client';
import {  GET_USER } from '../cache/queries';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export default function ShoppingPage() {
    const rArrow="data:image/png;base64,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"
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState('bannerEffects');
    const [pageNum, setPageNum] = useState(0);
    const [firstPage, setFirstPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const iconPath = "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/coding-vs-programming-2.jpg"
                    
    let username = null;

    const bannerEffects = {
        type: "bannerEffects",
        templates: [guest, heart, treeshop, treeshop, guest, heart, heart, heart, guest, heart, treeshop],
        items: [lights1, fire1, flowers1, neon1, fire1, lights1, flowers1, neon1, lights1, flowers1, fire1]
    }

    const iconEffects = {
        type: "iconEffects",
        templates: [guest, iconPath, guest, iconPath, guest, guest, guest],
        items: [neon1, fire1, lights1, flowers1, lights1, fire1, flowers1]
    }

    const backgrounds = {
        type: "backgrounds",
        templates: null,
        items: [bgRoad, bgAbstract, bgGlittering, bgStars, bgPlants]
    }

    const weeklySpecials = {
        type: "weeklySpecials",
        templates: [guest, iconPath, guest, iconPath, guest, iconPath],
        items: [fire1, neon1, flowers1, neon1, fire1, neon1]
    }

    const costs = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]

    var numBannerPages = Math.ceil(bannerEffects.items.length/4)
    var numIconPages = Math.ceil(iconEffects.items.length/4)
    var numBackgroundPages = Math.ceil(backgrounds.items.length/4)
    var numSpecialPages = Math.ceil(weeklySpecials.items.length/4)

    let coins = (user === null ? null : user.currency)
    // const {
    //     loading,
    //     error,
    //     data: { getUser: userData } = {},
    // } = useQuery(GET_USER, {
    //     skip: !user,
    //     fetchPolicy: 'cache-and-network',
    //     onError(err) {
    //         console.log(JSON.stringify(err, null, 2));
    //     },
    //     onCompleted({ getUser: userData }) {
    //         username = userData.displayName;
    //     },
    // });
    
    function totalPageCount(){
        if (page === 'bannerEffects') return numBannerPages;
        if (page === 'iconEffects') return numIconPages;
        if (page === 'backgrounds') return numBackgroundPages;
        if (page === 'weeklySpecials') return numSpecialPages;
    }

    // Renders the appropriate items for the selected category
    function renderPage() {
        if (page === 'bannerEffects') return itemStocker(pageNum, bannerEffects)
        if (page === 'iconEffects') return itemStocker(pageNum, iconEffects) 
        if (page === 'backgrounds') return itemStocker(pageNum, backgrounds)
        if (page === 'weeklySpecials') return itemStocker(pageNum, weeklySpecials) 
    }

    function pageButtons(current, total){
        let list = []
        for (let i = 0; i < total; i++) {
            if (current === i) {
                list.push(<Button 
                    backgroundSize="40px 40px"
                    backgroundImage={circleWhite}
                    ml="5px"
                    mr="5px"
                    _hover={{bgColor:"gray.700"}} 
                    _active={{bgColor:"gray.600"}} 
                    _focus={{border:"none"}}
                    bgRepeat="no-repeat"
                    onClick={() => choosePage(i, totalPageCount())}
                >
                    {i+1}
                </Button>
                )}
            else{
                list.push(
                    <Button 
                        backgroundSize="40px 40px"
                        ml="5px"
                        mr="5px"
                        backgroundImage={circleGray}
                        _hover={{bgColor:"gray.700"}} 
                        _active={{bgColor:"gray.600"}} 
                        _focus={{border:"none"}}
                        bgRepeat="no-repeat"
                        onClick={
                            () => {
                                choosePage(i,totalPageCount())
                            }
                        }
                    >
                    {i+1}
                    </Button>
                )
            }
        }
        return list            
    }

    // Displays the shop items based on which category they're currently viewing (Banner effects, Icon effects, Backgrounds, Weekly Specials)
    function itemStocker(pageIndex, itemType) {
        // Denote the items that should be shown in the shop (4 at a time)
        let startIndex = pageIndex * 4
        let endIndex = startIndex + 4
        
        let numItemsShowing = 0
        return (
            <Box>
                <Grid ml="4%" mr="4%" templateColumns="1fr 1fr" alignItems="center" justifyContent="center">
                    {itemType.items.slice(startIndex, endIndex).map((item, key) => {
                        numItemsShowing++

                        return (
                            <Center>
                                <ShopItemCard itemType={itemType.type} item={item} key={key}/>
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
    
    function nextPage(totalPage) {
        setPageNum(pageNum+1)
        setFirstPage(0)  
        if(totalPage-2==pageNum){
            setLastPage(1)
        }
        else{
            setLastPage(0)
        }
    }

    function prevPage() {
        setPageNum(pageNum-1)
        setLastPage(0)
        if(pageNum==1){
            setFirstPage(1) //first page
        }  
        else{
            setFirstPage(0)  
        }
    }

    function choosePage(temp,totalPage) {
        setPageNum(temp)

        if(temp==0){
            setFirstPage(1) //first page
        }  
        else{
            setFirstPage(0)  
        }
        if(temp==totalPage-1){
            setLastPage(1)
        }
        else{
            setLastPage(0)
        }
    }

    
    // Maps out information needed for the header sections at the top
    const headerSections = [
        {
            pageName: "Banner Effects",
            pageId: 'bannerEffects',
            choosePage: () => { return choosePage(0, numBannerPages) }
        },
        {
            pageName: "Icon Effects",
            pageId: 'iconEffects',
            choosePage: () => { return choosePage(0, numIconPages) }
        },
        {
            pageName: "Backgrounds",
            pageId: 'backgrounds',
            choosePage: () => { return choosePage(0, numBackgroundPages) }
        },
        {
            pageName: "Weekly Specials",
            pageId: 'weeklySpecials',
            choosePage: () => { return choosePage(0, numSpecialPages) }
        }
    ]

    return (
        <Box>
            {/*Shop Banner*/}
            <Center>
                <Image pt={5} src={treeshop} alt={"Tree Shop Banner"} />
            </Center>

            {/* Navigate between categories (Header Buttons) */}
            <Grid w='100%' h='6vh' minH='50px' templateColumns='repeat(4, 1fr)'>
                {headerSections.map((headerSection, key) => {
                    return (
                        <Button
                            key={key}
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === headerSection.pageId ? 'blue' : 'black'}
                            onClick={() => {
                                setPage(headerSection.pageId)
                                choosePage(0, numBannerPages)
                            }}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {headerSection.pageName}
                        </Button>
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
                        firstPage ? 
                            <Box />
                            :
                            <Box onClick={prevPage} transition=".15s linear" _hover={{cursor:"pointer", bgColor:"gray.100", transition:".15s linear"}}
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
                        lastPage ? 
                            <Box />
                            :
                            <Box onClick={() => {nextPage(totalPageCount())}}  transition=".15s linear" _hover={{cursor:"pointer", bgColor:"gray.100", transition:".15s linear"}}
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
    )
}