import { Box, Flex, HStack, Text, Grid, Button, Center, Image, GridItem, Input, Icon, Avatar, Stack, Spinner } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import * as mutations from '../cache/mutations';
import { useState, useContext } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';
import { ViewIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { BsHeart, BsTrophy, BsPerson, BsHeartFill, BsShuffle, BsQuestionLg, BsListOl, BsFillPlayCircleFill, BsAlarm, BsFillFilterSquareFill, BsCheck2Square, BsChatSquareDotsFill } from 'react-icons/bs';
import { IoRibbonSharp } from 'react-icons/io5';
import * as queries from '../cache/queries';
import { AuthContext } from '../context/auth';
import LeaderboardCard from '../components/LeaderboardEntryCard';
import userImage from '../images/guest.png';
import CommentCard from '../components/CommentCard';

export default function PreQuizPage({}) {
    const { user, refreshUserData } = useContext(AuthContext);
    let history = useHistory();
    let logged_in = false;
    let leaderboard = null;
    let comments = null;
    let { quizId } = useParams();

    // Checks if user is logged in
    if (user !== null && user !== 'NoUser') {
        logged_in = true;
    }

    const [FavoriteQuiz, { loading: favoriteLoading }] = useMutation(mutations.FAVORITE_QUIZ, {
        onCompleted() {
            refreshUserData();
            refetch();
        },
    });
    const [UnfavoriteQuiz, { loading: unfavoriteLoading }] = useMutation(mutations.UNFAVORITE_QUIZ, {
        onCompleted() {
            refreshUserData();
            refetch();
        },
    });
    const [isFavorited, setIsFavorited] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isInitQueryDone, setInitQueryDone] = useState(false);

    const [showInfo, setShowInfo] = useState(true);
    const onClickInfo = () => {
        setShowInfo(true);
        setShowLeaderboard(false);
        setShowComments(false);
    };
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const onClickLeaderboard = () => {
        setShowInfo(false);
        setShowLeaderboard(true);
        setShowComments(false);
    };
    const [showComments, setShowComments] = useState(false);
    const onClickComments = () => {
        setShowInfo(false);
        setShowLeaderboard(false);
        setShowComments(true);
    };

    const [AddComment] = useMutation(mutations.ADD_COMMENT);
    const [DeleteComment] = useMutation(mutations.DELETE_COMMENT);
    const [loadingComment, setLoadingComment] = useState(false);
    const [comment, setComment] = useState('');
    const handleCommentChange = (event) => setComment(event.target.value);

    let quiz = null;
    let iconSize = '50px';
    let iconTextSize = '30px';

    const { data, loading, error, refetch } = useQuery(queries.GET_QUIZ, {
        variables: {
            quizId: quizId,
        },
        fetchPolicy: 'cache-and-network',
        onCompleted({ getQuiz: quizData }) {
            if (logged_in && !isInitQueryDone) {
                for (let i = 0; i < user.favoritedQuizzes.length; i++) {
                    if (user.favoritedQuizzes[i] == quizData._id) {
                        console.log('HERE');
                        console.log(user.favoritedQuizzes[i]);
                        setIsFavorited(true);
                        break;
                    }
                }
            }
            if (!isInitQueryDone) {
                setInitQueryDone(true);
            }
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    const {
        data: data1,
        loading: loading1,
        error: error1,
    } = useQuery(queries.GET_LEADERBOARD, {
        variables: {
            quiz_id: quizId,
        },
        fetchPolicy: 'network-only',
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    if ((loading || loading1) && !isInitQueryDone) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    if (error) {
        if (error.message === 'Error: Quiz not found') {
            return (
                <Center>
                    <Text fontSize='3vw' fontWeight='thin'>
                        {' '}
                        This quiz does not exist{' '}
                    </Text>
                </Center>
            );
        } else {
            return (
                <Center>
                    <Text fontSize='3vw' fontWeight='thin'>
                        {' '}
                        Sorry, something went wrong{' '}
                    </Text>
                </Center>
            );
        }
    }

    if (error1) {
        return (
            <Center>
                <Text fontSize='3vw' fontWeight='thin'>
                    {' '}
                    Sorry, something went wrong{' '}
                </Text>
            </Center>
        );
    }

    if (data) {
        quiz = data.getQuiz;
        comments = data.getQuiz.comments;
        comments = reverseArr(comments);
    } else {
        return <div></div>;
    }

    if (data1) {
        leaderboard = data1.getLeaderboard;
    } else {
        return <div></div>;
    }

    if (user && quiz && user._id === quiz.user._id && !isOwner) {
        setIsOwner(true);
    }
    let quizTitle = quiz.title;
    let quizAuthor = quiz.user.displayName;
    let quizDescription = quiz.description;
    let numQuestions = quiz.numQuestions;
    let numAttempts = quiz.numAttempts;
    let numFavorites = quiz.numFavorites;
    let quizTimer = quiz.quizTimer == null ? 'No Timer' : quiz.quizTimer;
    let icon_src = quiz.icon == null ? quizImage : quiz.icon;

    const favoriteQuiz = async () => {
        if (logged_in) {
            setIsFavorited(true);
            const { data } = await FavoriteQuiz({
                variables: {
                    quizId: quizId,
                    userId: user._id,
                },
            });
            console.log(data);
        }
    };

    const unfavoriteQuiz = async () => {
        if (logged_in) {
            setIsFavorited(false);
            const { data } = await UnfavoriteQuiz({
                variables: {
                    quizId: quizId,
                    userId: user._id,
                },
            });
            console.log(data);
        }
    };

    const toggleQuizFavorited = async () => {
        if (logged_in && !loading && !favoriteLoading && !unfavoriteLoading) {
            if (isFavorited == true) {
                console.log('UNFAVORITE');
                unfavoriteQuiz();
            } else {
                console.log('FAVORITE');
                favoriteQuiz();
            }
        }
    };

    async function handleAddComment() {
        setLoadingComment(true)
        const { data } = await AddComment({
            variables: {
                quiz_id: quizId,
                user_id: user._id,
                comment: comment,
            },
        });
        setComment('');
        refetch();
        setLoadingComment(false)
    }

    async function handleDeleteComment(comment_id) {
        // console.log(comment_id);
        const { data } = await DeleteComment({
            variables: {
                quiz_id: quizId,
                user_id: user._id,
                comment_id: comment_id,
            },
        });
        refetch();
    }

    const buttons = [
        {
            text: 'Info',
            page: '#info',
            isShowing: showInfo,
            icon: BsFillFilterSquareFill,
            clickFunction: onClickInfo,
        },
        {
            text: 'Leaderboard',
            page: '#leaderboard',
            isShowing: showLeaderboard,
            icon: BsListOl,
            clickFunction: onClickLeaderboard,
        },
        {
            text: 'Comments',
            page: '#comments',
            isShowing: showComments,
            icon: BsChatSquareDotsFill,
            clickFunction: onClickComments,
        },
    ];

    return (
        <Box>
            <Button variant='outline' leftIcon={<ArrowBackIcon />} colorScheme='blue' ml={10} mt={6} onClick={() => history.goBack()}>
                {' '}
                Back{' '}
            </Button>
            <Grid templateColumns='1fr 0.3fr' mt='20px'>
                {/* Left Side */}
                <Box paddingBottom='75px'>
                    <Box>
                        {/* Title and Image */}
                        <HStack>
                            <Image w='175px' h='175px' ml={10} src={icon_src} objectFit='cover' borderRadius='10%'></Image>
                            <Text fontSize='275%' as='b' transform='translateY(62%)' paddingLeft='20px'>
                                {quizTitle}
                                {isFavorited ? (
                                    <Icon
                                        as={BsHeartFill}
                                        color='red.500'
                                        w='45px'
                                        h='45px'
                                        marginLeft='30px'
                                        _hover={{
                                            cursor: 'pointer',
                                            color: 'red.300',
                                            transition: '.1s linear',
                                        }}
                                        transition='.1s linear'
                                        onClick={toggleQuizFavorited}
                                    />
                                ) : (
                                    <Icon
                                        as={BsHeart}
                                        w='45px'
                                        h='45px'
                                        marginLeft='30px'
                                        color='gray.500'
                                        _hover={{
                                            cursor: 'pointer',
                                            color: 'red.400',
                                            transition: '.1s linear',
                                        }}
                                        transition='.1s linear'
                                        onClick={toggleQuizFavorited}
                                    />
                                )}
                            </Text>
                        </HStack>

                        <Center>
                            <Box w='123%' position='absolute' mt={10} h='1px' bgColor='gray.300' />
                        </Center>

                        <Text ml='2%' top='0px' left='5px' mt='40px' mb='15px' pos='relative' fontSize='22' noOfLines={3}>
                            {' '}
                            {quizDescription}{' '}
                        </Text>

                        <Center>
                            <Box w='77%' position='absolute' mt={10} h='1px' bgColor='gray.300' />
                        </Center>
                    </Box>

                    {/* Settings */}
                    <Box>
                        <Center>
                            <HStack mb={0} mt={12} mb={0}>
                                {buttons.map((button, key) => {
                                    return (
                                        <Box
                                            key={key}
                                            w='200px'
                                            h='40px'
                                            color={button.isShowing ? 'white' : 'gray.500'}
                                            bg={button.isShowing ? 'gray.600' : 'gray.200'}
                                            borderRadius='5px'
                                            position='relative'
                                            transition='0.1s linear'
                                            _hover={{
                                                opacity: '80%',
                                                cursor: 'pointer',
                                                transition: '0.15s linear',
                                            }}
                                        >
                                            {/* for horizontal line*/}
                                            <a className='center button black' onClick={button.clickFunction}>
                                                <Icon as={button.icon} pos='relative' boxSize={4} top={0.5} mr={2} />
                                                {button.text} {button.page === '#comments' ? `(${quiz.comments.length})` : ''}
                                            </a>
                                        </Box>
                                    );
                                })}
                            </HStack>
                        </Center>

                        {showInfo ? (
                            <Box mt={10}>
                                {/* Description */}

                                <Grid pl='5%' templateColumns='1fr 1fr'>
                                    <HStack spacing={4}>
                                        <Icon as={BsAlarm} w={iconSize} h={iconSize} position='relative' />
                                        <Text fontSize={iconTextSize} as='b'>
                                            {' '}
                                            {quizTimer}
                                        </Text>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Icon as={BsShuffle} w={iconSize} h={iconSize} position='relative' />
                                        <Text fontSize={iconTextSize} as='b'>
                                            {' '}
                                            {quiz.quizShuffled ? 'Shuffled Question' : 'Ordered Questions'}{' '}
                                        </Text>
                                    </HStack>
                                </Grid>

                                <Grid pt='4%' pl='5%' templateColumns='1fr 1fr'>
                                    <HStack>
                                        <Icon as={BsQuestionLg} w={iconSize} h={iconSize} position='relative' />
                                        <Text fontSize={iconTextSize} as='b'>
                                            {' '}
                                            {numQuestions} Questions{' '}
                                        </Text>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Icon as={IoRibbonSharp} w={iconSize} h={iconSize} position='relative' />
                                        <Text fontSize={iconTextSize} as='b'>
                                            {' '}
                                            {quiz.quizInstant ? 'Instant Quiz' : 'Standard Quiz'}{' '}
                                        </Text>
                                    </HStack>
                                </Grid>
                            </Box>
                        ) : (
                            ''
                        )}
                        {quiz.quizInstant && showInfo ? (
                            <Text ml='70px' mt='65px' fontSize='20px' color='red.400' fontWeight='bold'>
                                Alert: This is an instant quiz, attempting to leave the quiz with any finalized questions will submit your quiz
                            </Text>
                        ) : (
                            ''
                        )}
                        {showLeaderboard ? (
                            <Center>
                                <Box w='75%' minW='430px' mt='30px' overflow='hidden'>
                                    <Box h='50px' bg='gray.800' color='white' lineHeight='2' position='relative' borderTopRadius={6}>
                                        <Text className='leaderboard_title'>Leaderboard</Text>
                                    </Box>
                                    <Box borderBottomRadius='2%' h='350px' position='relative' paddingTop='10px' border='1px' borderColor='gray.300'>
                                        <Grid h={8} templateColumns='0.2fr 0.40fr 0.2fr 0.2fr' fontWeight='medium'>
                                            <Box display='flex' flexDirection='column' justifyContent='center'>
                                                <Center>
                                                    <Text>
                                                        <Icon as={BsTrophy} pos='relative' top={-0.4} mr={2} />
                                                        Rank
                                                    </Text>
                                                </Center>
                                            </Box>

                                            <Box display='flex' flexDirection='column' justifyContent='center'>
                                                <Text>
                                                    <Icon as={BsPerson} pos='relative' top={-0.4} mr={2} />
                                                    Name
                                                </Text>
                                            </Box>

                                            <Box display='flex' flexDirection='column' justifyContent='center'>
                                                <Center>
                                                    <Text>
                                                        <Icon as={BsAlarm} pos='relative' top={-0.4} mr={2} />
                                                        Time
                                                    </Text>
                                                </Center>
                                            </Box>

                                            <Box display='flex' flexDirection='column' justifyContent='center'>
                                                <Center>
                                                    <Text>
                                                        <Icon as={BsCheck2Square} pos='relative' top={-0.4} mr={2} />
                                                        Score
                                                    </Text>
                                                </Center>
                                            </Box>
                                        </Grid>

                                        <Box h='1px' mt={1} mb={1} bgColor='gray.300' />

                                        {leaderboard.map((entry, index) => {
                                            return <LeaderboardCard place={index + 1} entry={entry} image={userImage} />;
                                        })}
                                    </Box>
                                </Box>
                            </Center>
                        ) : (
                            ''
                        )}

                        {showComments ? (
                            <Box width='75%' mt='15px' ml='100px' mr='15px'>
                                <Text marginBottom='20px' borderBottom='1px' borderColor='gray.300' fontSize='22px'>
                                    Comments ({comments.length})
                                </Text>
                                {user !== 'NoUser' ? (
                                    <Flex direction='row'>
                                        <Avatar src={user.iconImage} />
                                        <Input
                                            value={comment}
                                            onChange={handleCommentChange}
                                            variant='filled'
                                            placeholder='Add a public comment...'
                                            marginLeft='20px'
                                            marginBottom='20px'
                                            _hover={{ pointer: 'cursor', bgColor: 'gray.200' }}
                                            _focus={{ bgColor: 'white', border: '1px', borderColor: 'blue.400' }}
                                        />
                                        <Button isLoading={loadingComment} w='140px' colorScheme='blue' size='md' marginLeft='20px' onClick={handleAddComment}>
                                            Comment
                                        </Button>
                                    </Flex>
                                ) : (
                                    ''
                                )}

                                <Flex direction='column' display='flex' flexWrap='wrap'>
                                    {comments.map((comment, key) => {
                                        return (
                                            <CommentCard
                                                comment={comment}
                                                logged_in={user !== 'NoUser'}
                                                user_id={user === 'NoUser' ? null : user._id}
                                                player_icon={user.iconImage}
                                                handleDeleteComment={handleDeleteComment}
                                                refetch={refetch}
                                                quiz_id={quizId}
                                                key={comment._id}
                                            />
                                        );
                                    })}
                                </Flex>
                            </Box>
                        ) : (
                            ''
                        )}
                    </Box>
                </Box>

                {/* Right Side */}
                <Box borderLeft='1px solid' borderLeftColor='gray.300' pl={10} mt={195} pt={8}>
                    {/* Other Info */}
                    <HStack>
                        <Avatar src={quiz.user.iconImage} size='lg' />
                        <Stack spacing={0}>
                            <Text fontSize='140%' as='b'>
                                Creator
                            </Text>
                            <Text fontSize='120%' ml='10px'>
                                {quizAuthor}
                            </Text>
                        </Stack>
                    </HStack>
                    <Text fontSize='120%' ml='10px' top='30px' position='relative'>
                        {' '}
                        <Icon as={ViewIcon} color='blue.400' /> {numAttempts} Plays
                    </Text>
                    <Text fontSize='120%' ml='10px' top='40px' position='relative'>
                        {' '}
                        <Icon as={BsHeartFill} color='red.400' /> {numFavorites} Favorites
                    </Text>

                    {/* Start Quiz Button */}
                    <Stack pos="relative" top='205px'>
                        <Button w="fit-content" fontSize="24px" h="60px" colorScheme='blue' rightIcon={<BsFillPlayCircleFill />} size="lg" onClick={() => history.push('/quiztakingpage/' + quiz._id)}>
                            Start Quiz
                        </Button>
                        {isOwner ? (
                            <Button w="fit-content" fontSize="24px" h="60px" mt='15px' colorScheme='green' rightIcon={<EditIcon />}  size="lg" onClick={() => history.push('/editQuiz/' + quiz._id)}>
                                Edit Quiz
                            </Button>
                        ) : null}
                    </Stack>
                </Box>
            </Grid>
        </Box>
    );
}

function reverseArr(input) {
    var ret = new Array();
    for (var i = input.length - 1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}
