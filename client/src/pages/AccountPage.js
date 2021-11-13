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
    Select
} from '@chakra-ui/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_QUIZZES, GET_USER } from '../cache/queries';
import { Link, Redirect, useParams } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import { AuthContext } from '../context/auth';
import { useState, useContext, createRef, useEffect } from 'react';
import React from 'react';
import '../styles/styles.css';

let profileImg = 'Same Image';
let bannerImg = 'Same Image';
const hiddenPFPInput = createRef(null);
const hiddenBannerInput = createRef(null);
let username = null;

export default function AccountPage(props) {
    const { user, refreshUserData } = useContext(AuthContext);
    let { userId } = useParams();

    let quiz_sections = ['Featured Quizzes', 'Featured Platforms'];

    const [page, setPage] = useState('user');
    const [isEditing, setIsEditing] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const [userTitle, setUserTitle] = React.useState('');
    const [pfp_src, setPFP] = useState(''); //String path
    const [banner_src, setBanner] = useState(''); //String path
    //Here we go again
    const [backgroundNum, setBackground] = useState(""); //Int bg
    const background = ["white","red","blue","green"];

    function toggleEditPage() {
        setIsEditing(!isEditing);
    }

    function updateBio(value) {
        setBio(value);
    }

    function updateUserTitle(value) {
        setUserTitle(value);
    }

    //Not attached to backend

    function changeBackground(event) {
        event.preventDefault();
        console.log(event.target[0].value)
        setBackground(event.target[0].value)
        //console.log(backgroundNum)
        //Does change but a little after
        
    }
    function listCreator(numberOfRows, background ) {
        //Takes number of rows to make a variable number of rows of categories
        //Takes an images array and text array to fill the rows with
        let list = []
        for(let i=0;i<numberOfRows;i++) {
            list.push(<option value={background[i]}>{background[i]}</option>)
        }
        return list;
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
            };
        }
    }
    

    function cancelEditing() {
        toggleEditPage(false);
        setPFP(userData.iconImage);
        setBio(userData.bio);
        if (userData.bannerImage) {
            setBanner(userData.bannerImage);
        } else {
            setBanner(
                'https://www.acemetrix.com/wp-content/themes/acemetrix/images/default/default-black-banner.png'
            );
        }
    }

    const {
        loading,
        error,
        data: { getUser: userData } = {},
    } = useQuery(GET_USER, {
        skip: !user,
        fetchPolicy: 'cache-and-network',
        variables: { _id: userId },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
        onCompleted({ getUser: userData }) {
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
        },
    });

    const [updateUser] = useMutation(UPDATE_USER, {
        refetchQueries: [GET_USER],
        context: {
            headers: {
                profileimagetype: profileImg,
                bannerimagetype: bannerImg,
            },
        },
        onCompleted() {
            toggleEditPage(false);
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
                },
            },
        });
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
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                    Sorry, something went wrong{' '}
                </Text>
            </Center>
        );
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
            //move the bgColor={backgroundNum} to wherever would cover the whole screen
            <Box bgColor={backgroundNum} minW='500px'>
                {/* BANNER */}
                <Box
                    h='28vh'
                    minH='200px'
                    pos='relative'
                    bgImage={
                        "linear-gradient(to bottom, rgba(245, 246, 252, 0.30), rgba(255, 255, 255, 0.90)), url('" +
                        banner_src +
                        "')"
                    }
                    bgSize='cover'
                    bgPosition='center'
                    borderRadius='10'
                >
                    {/* PROFILE PICTURE AND NAME */}
                    <Box
                        top='50%'
                        left='2%'
                        transform='translateY(-50%)'
                        position='relative'
                    >
                        <Box
                            className='squareimage_container'
                            w='12%'
                            minW='100px'
                        >
                            <Image
                                className='squareimage'
                                src={pfp_src}
                                alt='Profile Picture'
                                objectFit='cover'
                                borderRadius='50%'
                            ></Image>
                        </Box>

                        <Text
                            pos='absolute'
                            bottom='30%'
                            left='14%'
                            fontSize='300%'
                            as='b'
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
                    </Box>

                    {/*Quick Stuff for changing PFP and Banner*/}
                    {isEditing ? (
                        <div>
                            <Button
                                _focus={{ outline: 'none' }}
                                borderColor='black'
                                border='solid'
                                borderWidth='2px'
                                pos='absolute'
                                bottom='4%'
                                left='1%'
                                onClick={() => hiddenPFPInput.current.click()}
                            >
                                <Text
                                    fontSize={['10px', '10px', '10px', '20px']}
                                >
                                    Upload Profile Picture
                                </Text>
                            </Button>
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={hiddenPFPInput}
                                onChange={(event) => updatePFP(event)}
                            />

                            <Button
                                _focus={{ outline: 'none' }}
                                borderColor='black'
                                border='solid'
                                borderWidth='2px'
                                pos='absolute'
                                bottom='4%'
                                right='1%'
                                onClick={() =>
                                    hiddenBannerInput.current.click()
                                }
                            >
                                <Text
                                    fontSize={['10px', '10px', '10px', '20px']}
                                >
                                    Upload Banner
                                </Text>
                            </Button>
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={hiddenBannerInput}
                                onChange={(event) => updateBanner(event)}
                            />
                        </div>
                    ) : (
                        <h1></h1>
                    )}
                </Box>
                {/* FEATURED QUIZZES/PLATFORMS AND BIOGRAPHY */}
                <Grid pt='1%' templateColumns='4fr 1fr'>
                    {/* FEATURED QUIZZES/PLATFORMS */}
                    <Box w='98.5%' borderRadius='10'>
                        <VStack spacing='1.5vh'>
                            {quiz_sections.map((name, index) => {
                                return (
                                    <Box
                                        key={index}
                                        w='100%'
                                        bgColor='gray.200'
                                        borderRadius='10'
                                        overflowX='auto'
                                    >
                                        <Text
                                            pl='1.5%'
                                            pt='1%'
                                            fontSize='130%'
                                            fontWeight='medium'
                                        >
                                            {name}
                                        </Text>

                                        {/* QUIZZES */}
                                        <Flex
                                            ml='1%'
                                            spacing='4%'
                                            display='flex'
                                            flexWrap='wrap'
                                        >
                                            {userData.quizzesMade.map(
                                                (quiz, key) => {
                                                    return (
                                                        <QuizCard
                                                            quiz={quiz}
                                                            width='11%'
                                                            title_fontsize='90%'
                                                            include_author={
                                                                false
                                                            }
                                                            char_limit={35}
                                                            key={key}
                                                        />
                                                    );
                                                }
                                            )}
                                        </Flex>
                                    </Box>
                                );
                            })}
                        </VStack>
                    </Box>

                    {/* BIOGRAPHY */}
                    <Box
                        minWidth='100px'
                        bgColor='gray.200'
                        borderRadius='10'
                        overflow='hidden'
                    >
                        <Text
                            pl='4%'
                            pt='2%'
                            fontSize='130%'
                            fontWeight='medium'
                        >
                            {' '}
                            Biography{' '}
                        </Text>
                        {isEditing ? (
                            <Textarea
                                backgroundColor='white'
                                value={bio}
                                onChange={(event) =>
                                    updateBio(event.target.value)
                                }
                            />
                        ) : (
                            <Text pl='4%' pr='4%' pt='3%' fontSize='100%'>
                                {' '}
                                {bio}{' '}
                            </Text>
                        )}
                    </Box>
                </Grid>

                {user._id === userId ? (
                    isEditing ? (
                        <VStack position='absolute' left='20px'>
                            <Button onClick={() => cancelEditing()}>
                                Cancel Updates
                            </Button>
                            <Button onClick={() => handleUpdateUser()}>
                                Save Updates
                            </Button>
                            <form onSubmit={changeBackground}>
                                <FormControl id="background">
                                    <FormLabel>Background</FormLabel>
                                    <Select placeholder="Default" name="go">
                                        { listCreator(background.length, background ) }
                                        
                                    </Select>          
                                </FormControl>
                                <Button type="submit" value="Submit">Confirm</Button>
                            </form>
                            
                            
                        </VStack>
                    ) : (
                        <Box position='absolute' left='20px'>
                            <Button onClick={() => toggleEditPage(true)}>
                                Update Page
                            </Button>
                        </Box>
                    )
                ) : null}
            </Box>
        );
    }

    // Render Platforms
    function renderPlatforms() {
        return (
            <Box bgColor='gray.200' borderRadius='10'>
                <Text pl='1.5%' pt='1%' fontSize='1.2vw' fontWeight='bold'>
                    All Platforms
                </Text>
                <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
                    {userData.quizzesMade.map((quiz, key) => {
                        return (
                            <QuizCard
                                quiz={quiz}
                                width='10%'
                                title_fontsize='0.8vw'
                                include_author={false}
                                char_limit={35}
                                key={key}
                            />
                        );
                    })}
                </Flex>
            </Box>
        );
    }

    // Render Quizzes
    function renderQuizzes() {
        return (
            <Box bgColor='gray.200' borderRadius='10'>
                <Text pl='1.5%' pt='1%' fontSize='1.2vw' fontWeight='bold'>
                    All Quizzes
                </Text>
                <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
                    {userData.quizzesMade.map((quiz, key) => {
                        return (
                            <QuizCard
                                quiz={quiz}
                                width='10%'
                                title_fontsize='0.8vw'
                                include_author={false}
                                char_limit={35}
                                key={key}
                            />
                        );
                    })}
                </Flex>
            </Box>
        );
    }

    // Render Badges
    function renderBadges() {
        return (
            <Box bgColor='gray.200' borderRadius='10'>
                <Text pl='1.5%' pt='1%' fontSize='1.2vw' fontWeight='bold'>
                    All Badges
                </Text>
                <Flex ml='1%' spacing='4%' display='flex' flexWrap='wrap'>
                    {userData.quizzesMade.map((quiz, key) => {
                        return (
                            <QuizCard
                                quiz={quiz}
                                width='10%'
                                title_fontsize='0.8vw'
                                include_author={false}
                                char_limit={35}
                                key={key}
                            />
                        );
                    })}
                </Flex>
            </Box>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <Box data-testid='main-component'>
            <Grid templateColumns='1fr 6fr 1fr'>
                <Box w='100%'></Box>

                {/* MAIN CONTENT */}
                <Box w='100%'>
                    {/* HEADER BUTTONS */}
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
                            textColor={page === 'user' ? 'blue' : 'black'}
                            onClick={() => setPage('user')}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            {username}{' '}
                        </Button>
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'platforms' ? 'blue' : 'black'}
                            onClick={() => setPage('platforms')}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Platforms{' '}
                        </Button>
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'quizzes' ? 'blue' : 'black'}
                            onClick={() => setPage('quizzes')}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Quizzes{' '}
                        </Button>
                        <Button
                            height='100%'
                            fontSize='115%'
                            bgColor='white'
                            textColor={page === 'badges' ? 'blue' : 'black'}
                            onClick={() => setPage('badges')}
                            _focus={{ boxShadow: 'none' }}
                        >
                            {' '}
                            Badges{' '}
                        </Button>
                    </Grid>
                    {renderPage()}
                </Box>
            </Grid>
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
