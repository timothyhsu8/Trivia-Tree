import { useEffect, useState } from 'react';
import { Text, Image, HStack, Button, Flex, Input, Avatar, Center, Spinner} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { BsTrash, BsFillHandThumbsUpFill, BsHandThumbsUp } from 'react-icons/bs';
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import * as mutations from '../cache/mutations';
import PostReplyCard from './PostReplyCard.js'

export default function PostCard( props ) {    
    let history = useHistory();
    let post = props.post
    let likedBy = false;
    let post_id = props.post._id
    let replies = props.post.replies;
    let timeAgo = getTimeAgo(props.post.createdAt);
    let usersPost = false;
    let quiz_id = props.quiz_id
    if(post.user._id == props.user_id){
        usersPost = true;
    }
    const [AddPostReply] = useMutation(mutations.ADD_POST_REPLY);
    const [DeletePostReply] = useMutation(mutations.DELETE_POST_REPLY);

    const [LikePost, {loading: likeLoading }] = useMutation(mutations.LIKE_POST, {
        onCompleted() {
            props.refetch();
        }
    });
    const [UnlikePost, {loading: unlikeLoading }] = useMutation(mutations.UNLIKE_POST, {
        onCompleted() {
            props.refetch();
        }
    });

    const [reply, setReply] = useState('');
    const handleReplyChange = (event) => setReply(event.target.value);

    const[deleteConfirmation, setDeleteConfirmation] = useState(false)
    const[showReply, setShowReply] = useState(false)
    const [loadingReply, setLoadingReply] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        let found = false;
        for(let i = 0; i < props.post.likedBy.length; i++){
            if(props.post.likedBy[i]._id === props.user_id){
                console.log("HERE")
                setIsLiked(true);
                found = true;
                break;
            }
        } 
        if (!found) {
            setIsLiked(false);
        }
        setProcessing(false);
    }, [props.post.numLikes])

    function handleDeletePost() {

        setDeleteConfirmation(false)
        props.handleDeletePost(props.post._id)

    }

    async function handleAddReply(){
        setLoadingReply(true)
        setReply("");
        const {data} = await AddPostReply({ variables: {
            platform_id: props.platform_id, user_id: props.user_id, post_id: post_id, reply:reply
        }});
        props.refetch();
        setLoadingReply(false)
    }


    async function handleDeleteReply(reply_id) {
        setLoadingReply(true)
        const {data} = await DeletePostReply({ variables: {
            platform_id: props.platform_id, user_id: props.user_id, post_id: post_id, reply_id:reply_id
        }});
        props.refetch();
        setLoadingReply(false)

    }

    async function handleLikePost(){
        const {data} = await LikePost({ variables: {
            platform_id: props.platform_id, user_id: props.user_id, post_id: post_id
        }});
    }

    async function handleUnlikePost(){
        const {data} = await UnlikePost({ variables: {
            platform_id: props.platform_id, user_id: props.user_id, post_id: post_id
        }});
    }

    function toggleLikePost() {
        if (!likeLoading && !unlikeLoading && !processing) {
            setProcessing(true);
            if (isLiked) {
                handleUnlikePost();
            } else {
                handleLikePost();
            }
        } else {
            return;
        }
    }

    return (

        <Flex
            direction="row"
            h="auto" 
            w="60vw"
            mt={5}
            minH="80px"
            marginLeft={6}
            borderBottom="1px" 
            borderColor="gray.300" 
            dipslay="flex" 
            alignItems="left"  
            transition="background-color 0.1s linear"
            overflow="hidden"
        >
            {/* USER ICON */}
            <Flex ml={3} spacing="0.1" direction="column">
                <Avatar src={post.user.iconImage} _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + post.user._id)}/>
                <Center> <Text fontSize="10px" marg1inTop="5px">{post.numLikes} {post.numLikes == 1 ? 'Like' : 'Likes'} </Text> </Center>
            </Flex>

            {/* USER NAME */}
            <Flex ml={3} spacing="0.1" direction="column">
                <HStack>
                    <Text w="fit-content" fontSize="12px" _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + post.user._id)}>
                        {post.user.displayName}
                    </Text>
                    <Text w="fit-content" fontSize="10px">
                        {timeAgo}
                    </Text>
                    {usersPost || props.is_owner ? 
                    <HStack>
                        <BsTrash
                            className='trashCan'
                            style={{
                            display: 'inline',
                            verticalAlign: 'middle',
                            fontSize: '60%',
                            }}
                            onClick={() =>
                            setDeleteConfirmation(true)
                            }
                        /> 
                        {deleteConfirmation ? 
                            <HStack>
                                <Button 
                                size="xs" 
                                variant='link' 
                                colorScheme="black"
                                fontSize="60%" 
                                onClick={() =>
                                    setDeleteConfirmation(false)
                                }> 
                                Cancel
                                </Button>

                                <Button 
                                size="xs" 
                                variant='link' 
                                colorScheme="red"
                                fontSize="60%" 
                                onClick={() =>
                                    handleDeletePost()
                                }>  
                                Delete Post
                                </Button>
                                
                            </HStack>
                            :''}
                    </HStack>
                    : ''}
                </HStack>
                <Text fontSize="100%"> {post.postText}</Text>                    
                {post.postImage != null ? <Image src={post.postImage} maxWidth="200px" maxHeight="300px" marginTop="10px" marginBottom="10px" borderRadius="5%" /> : ""}
                <HStack marginTop="5px">
                    {showReply ? 
                        <Button leftIcon={<ArrowDownIcon />} size="xs" variant="ghost" onClick={() => setShowReply(false)}  _focus={{}}>
                            Hide Replies ({replies.length})
                        </Button> 
                    
                    :
                        <Button leftIcon={<ArrowForwardIcon />} size="xs" variant="ghost" onClick={() => setShowReply(true)} _focus={{}}>
                            View Replies ({replies.length})
                        </Button>
                    }
                    {likeLoading || unlikeLoading || processing ? <Spinner position='relative' left='23px' size='xs'></Spinner> :
                    ( !isLiked ? 
                    <Button leftIcon={<BsHandThumbsUp/>} size="xs" variant="ghost" onClick={() => toggleLikePost()}  _focus={{}}>
                        Like
                    </Button>
                    :
                    <Button color="blue.500" leftIcon={<BsFillHandThumbsUpFill/>} size="xs" variant="ghost" onClick={() => toggleLikePost()}  _focus={{}}>
                        Like
                    </Button>
                    )}
                </HStack>

                    {!showReply ? "":
                        <Flex direction="column" spacing="15%" display="flex" flexWrap="wrap" marginBottom="5px">
                            {replies.map((reply, key) => {
                                return (
                                    <PostReplyCard
                                        reply={reply}
                                        quiz_id={quiz_id}
                                        user_id={props.user_id}
                                        key={key}
                                        logged_in={props.logged_in}
                                        handleDeleteReply={handleDeleteReply}
    
                                    />
                                )
                            })}
                        </Flex>
                    }

                    {showReply && props.logged_in ? 
                        <HStack paddingTop="5px" paddingBottom="10px">
                            <Avatar src={props.player_icon} size="xs"/>
                            <Input value={reply} onChange={handleReplyChange} variant='filled' placeholder='Reply to the comment...' marginLeft="20px" marginBottom="20px"
                                size="xs" borderRadius={5} _focus={{ border:"1px", borderColor:"blue.400", bgColor:"white" }}/>
                            <Button isLoading={loadingReply} w="100px" colorScheme='blue' variant='solid' size="xs" marginLeft="20px" onClick={handleAddReply}>
                                Reply
                            </Button>
                        </HStack>
                    : ""}
            </Flex>
        </Flex>
    )
}

function getTimeAgo(creationDate) {
    // Get difference in time between now and the creation date
    let time_diff_ms= Math.abs(new Date() - creationDate)
    
    // For brand comments quizzes ('A few seconds ago')
    if (parseInt(time_diff_ms) < 5000)
        return "A few seconds ago"

    // Format as 'x weeks ago'
    let weeks_ago = parseInt(time_diff_ms / (7*24*60*60*1000))
    if (weeks_ago !== 0)
        return weeks_ago !== 1 ? weeks_ago + " weeks ago" : "1 week ago"

    // Format as 'x days ago'
    let days_ago = parseInt(time_diff_ms / (60*60*24*1000))
    if (days_ago !== 0)
        return days_ago !== 1 ? days_ago + " days ago" : "1 day ago"
    
    // Format as 'x hours ago'
    let hours_ago = parseInt(time_diff_ms / (60*60*1000))
    if (hours_ago !== 0)
        return hours_ago + " hours ago"

    // Format as 'x minutes ago'
    let minutes_ago = parseInt(time_diff_ms / (60*1000))
    if (minutes_ago !== 0)
        return minutes_ago !== 1 ? minutes_ago + " minutes ago" : "1 minute ago"

    // Format as 'x seconds ago'
    let seconds_ago = parseInt(time_diff_ms / 1000)
    if (seconds_ago !== 0)
        return seconds_ago + " seconds ago"

    return "A few seconds ago"
}