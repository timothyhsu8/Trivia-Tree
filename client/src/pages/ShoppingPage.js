import { Box, Grid, Text, Image, Center, Button, GridItem, Img, Flex, VStack, HStack } from '@chakra-ui/react';
import treeicon from '../images/triviatree_icon.png'
import ShopItemCard from '../components/ShopItemCard.js'
import coin from '../images/coin.png'
import guest from '../images/guest.png'
import heart from '../images/heart.jpeg'
import treeshop from '../images/treeshop.png'
import lights1 from '../images/lights1.png'
import fire1 from '../images/fire1.png'
import flowers1 from '../images/flowers1.png'
import neon1 from '../images/neon1.png'
import circleGray from '../images/circleGray.png'
import circleWhite from '../images/circleWhite.png'
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import React, { useState, useEffect, useContext} from 'react';
import '../styles/ShoppingPage.css';

import { useQuery } from '@apollo/client';
import {  GET_USER } from '../cache/queries';

export default function ShoppingPage() {
    const rArrow="data:image/png;base64,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"
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState('bannerEffects');
    const [pageNum, setPageNum] = useState(0);
    const [firstPage, setFirstPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const iconPath= "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/coding-vs-programming-2.jpg"
                    
    let username = null;
    const bannerArr = [guest, heart, treeshop, treeshop, 
        guest, heart, heart, heart,
        guest, heart, treeshop, treeshop
    ]
    const borderArr = [
        lights1,fire1,flowers1,neon1,fire1,lights1,flowers1,neon1,lights1,flowers1,fire1,neon1
    ]
    const iconArr = [guest, iconPath, guest, iconPath,guest, guest, guest
    ]
    const bgArr = [guest, iconPath, guest, iconPath,
        guest, guest, guest, guest,
        iconPath
    ]
    const weekArr = [guest, iconPath, guest, iconPath, guest, iconPath
    ]

    const costArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120
    ]
    const Imgheight = "12vw"
    const w1 = "30vw"
    const w2 = "32vw"
    const w3 = "34vw"
    const w4 = "36vw"
    var totalPageBanner=Math.ceil(bannerArr.length/4)
    var totalPageIcon=Math.ceil(iconArr.length/4)
    var totalPageBackground=Math.ceil(bgArr.length/4)
    var totalPageWeekly=Math.ceil(weekArr.length/4)

    let coins = user == null ? null : user.currency;
    const {
        loading,
        error,
        data: { getUser: userData } = {},
    } = useQuery(GET_USER, {
        skip: !user,
        fetchPolicy: 'cache-and-network',
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
        onCompleted({ getUser: userData }) {
            username = userData.displayName;
        },
    });
    
    function totalPageCount(){
        if (page === 'bannerEffects') return totalPageBanner;
        if (page === 'iconEffects') return totalPageIcon;
        if (page === 'backgrounds') return totalPageBackground;
        if (page === 'weeklySpecials') return totalPageWeekly;
    }
    function renderPage() {
        if (page === 'bannerEffects') return renderBannerEffects();
        if (page === 'iconEffects') return renderIconEffects();
        if (page === 'backgrounds') return renderBackgrounds();
        if (page === 'weeklySpecials') return renderWeeklySpecials();
    }

    function pageButtons(current, total){
        let list = []
        for(let i=0;i<total;i++) {
            if(current==i){
                list.push(<Button 
                    backgroundSize="40px 40px"
                    backgroundImage={circleWhite}
                    ml="5px"
                    mr="5px"
                    _hover={{bgColor:"gray.700"}} 
                    _active={{bgColor:"gray.600"}} 
                    _focus={{border:"none"}}
                    bgRepeat="no-repeat"
                    onClick={
                        () => {
                            console.log("ayy")
                            choosePage(i,totalPageCount())
                        }
                    }
                >
                    {i+1}
                </Button>
                )}
            else{
                list.push(<Button 
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
                                            console.log("ayy")
                                            choosePage(i,totalPageCount())
                                        }
                                    }
                                >
                                    {i+1}
                                </Button>)
            }
        }
        return list            
    }
    function itemStocker(offset,imgArr) {
        var meow = offset*4
        let list = []
        let one = 1
        let two = 1
        let three = 1
        if(imgArr.length-(meow)<4){
            three=0
        }
        if(imgArr.length-(meow)<3){
            two=0
        }
        if(imgArr.length-(meow)<2){
            one=0
        }
        list.push(
            <Box ml="2vw">
                <Center>
                    <VStack >
                    <ShopItemCard 
                            imgArr={imgArr} 
                            offset={0+meow}
                            costArr={costArr}
                            borderArr={borderArr}
                            type={page}
                            >
                            </ShopItemCard>

                    </VStack>
                    
                    <Box w={["0px","20px","30px","20px"]} ></Box>
                    {one ? <div>
                    <VStack >
                    <ShopItemCard 
                            imgArr={imgArr} 
                            offset={1+meow}
                            costArr={costArr}
                            borderArr={borderArr}
                            type={page}
                            >
                            </ShopItemCard>
                    </VStack>
                    </div>
                    :(null)}
                
                </Center>
                <Box h="40px"></Box>
                <Center>
                {two ? <div>
                    <VStack >
                        <ShopItemCard 
                            imgArr={imgArr} 
                            offset={2+meow}
                            costArr={costArr}
                            borderArr={borderArr}
                            type={page}
                            >
                            </ShopItemCard>
                        
                    </VStack>
                    </div>:null}
                    <Box w={["0px","20px","30px","20px"]} ></Box>
                    {three ? <div>
                    <VStack >
                        <Box>
                            <ShopItemCard 
                            imgArr={imgArr} 
                            offset={3+meow}
                            costArr={costArr}
                            borderArr={borderArr}
                            type={page}
                            >
                            </ShopItemCard>
                            
                        </Box>
                    </VStack>
                    </div>:null}
                    
                </Center>
                </Box>
        )
        return list

        
    }
    
    
    function nextPage(totalPage) {
        console.log(totalPage)
        setPageNum(pageNum+1)
        setFirstPage(0)  
        if(totalPage-2==pageNum){
            setLastPage(1)
        }
        else{
            console.log(pageNum)
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
        console.log(temp)
        console.log(totalPage)
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



    function renderBannerEffects() {
        return (
            <Box>
            { itemStocker(pageNum, bannerArr) }
            </Box>
        )}
    function renderIconEffects() {
        return (
            <Box>
                { itemStocker(pageNum, iconArr) }
            </Box>
        )}
    function renderBackgrounds() {
        return (
            <Box>
                { itemStocker(pageNum, bgArr) }
            </Box>
        )}
    function renderWeeklySpecials() {
        return (
            <Box>
                { itemStocker(pageNum, weekArr) }
            </Box>
        )}


    return (
        <Box>
            <Grid h="845px" templateRows="repeat(10, 1fr)" px="20px" py="20px" bgColor="white" paddingTop="10px">

                {/*Shop Banner*/}
                <GridItem rowSpan={1} border="1px">
                    <Center><img src={treeshop} alt={"Tree Shop Banner"}/></Center>
                </GridItem>

                {/*Navigate Between Categories*/}
                <GridItem rowSpan={1} border="1px">
                    <Grid
                        w='100%'
                        h='6vh'
                        minH='50px'
                        templateColumns='1fr 1fr 1fr 1fr'
                    >
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'bannerEffects' ? 'blue' : 'black'}
                            onClick={() => {
                                setPage('bannerEffects')
                                choosePage(0,totalPageBanner)
                            }}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Banner Effects{' '}
                        </Button>
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'iconEffects' ? 'blue' : 'black'}
                            onClick={() => {
                                setPage('iconEffects')
                                choosePage(0,totalPageIcon)
                            }}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Icon Effects{' '}
                        </Button>
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'backgrounds' ? 'blue' : 'black'}
                            onClick={() => {
                                setPage('backgrounds')
                                choosePage(0,totalPageBackground)
                            }}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Backgrounds{' '}
                        </Button>
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'weeklySpecials' ? 'blue' : 'black'}
                            onClick={() => {
                                setPage('weeklySpecials')
                                choosePage(0,totalPageWeekly)
                            }}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Weekly Specials{' '}
                        </Button>
                    </Grid>
                    
                </GridItem>

                {/*Main Body*/}
                <GridItem rowSpan={6} border="1px">
                    <HStack>
                        <Box w={["0px","1px","15px","20px"]}></Box>
                        {firstPage ? (
                            null
                         ) :(
                            <Image className="flip" onClick={prevPage} h="60px" w={["4vw","3.75vw","3.5vw","3vw"]} src={rArrow}></Image>
                         )
                        }
                        <Box w={["0px","1px","15px","20px"]}></Box>
                        {renderPage()}
                        <Box w={["0px","1px","15px","20px"]}></Box>
                        {lastPage ? (
                            null
                         ) :(
                            <Image onClick={() => {nextPage(totalPageCount())}} h="60px" w={["4vw","3.75vw","3.5vw","3vw"]} src={rArrow}></Image>
                         )
                        }
                    </HStack>

                    <Box h="30px"></Box>
                    <Center>
                        <HStack>
                            <Center>
                            {pageButtons(pageNum,totalPageCount())}
                            </Center>
                            
                        </HStack>
                    </Center>
                </GridItem>

                {/*Page Number*/}
                <GridItem rowSpan={1} border="1px">
                    
                </GridItem>
            </Grid>
        </Box>
    )
}