import { useState } from 'react';
import { Text, Image, HStack, Button, Flex, Input, Avatar, useColorModeValue } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { BsTrash } from 'react-icons/bs';
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import * as mutations from '../cache/mutations';
import ReplyCard from './ReplyCard.js'

export default function CommentCard( props ) {    
    let history = useHistory();
    let comment = props.comment
    let comment_id = props.comment._id
    let replies = props.comment.replies;
    let timeAgo = getTimeAgo(props.comment.createdAt);
    let usersComment = false;
    let quiz_id = props.quiz_id
    if(comment.user._id == props.user_id){
        usersComment = true;
    }


    const [AddReply] = useMutation(mutations.ADD_REPLY);
    const [DeleteReply] = useMutation(mutations.DELETE_REPLY);

    const[deleteConfirmation, setDeleteConfirmation] = useState(false)
    const[showReply, setShowReply] = useState(false)

    const [reply, setReply] = useState('');
    const [loadingReply, setLoadingReply] = useState(false);
    const handleReplyChange = (event) => setReply(event.target.value);

    const activeBgColor = useColorModeValue("white", "gray.700")

    function handleDeleteComment() {
        setDeleteConfirmation(false)
        props.handleDeleteComment(comment_id)
    }

    async function handleAddReply(){
        setLoadingReply(true)
        const {data} = await AddReply({ variables: {
            quiz_id: quiz_id, user_id: props.user_id, comment_id: comment_id, reply:reply
        }});
        setReply("");
        props.refetch();
        setLoadingReply(false)
    }

    async function handleDeleteReply(reply_id){
        console.log(reply_id);
        const {data} = await DeleteReply({ variables: {
            quiz_id: quiz_id, user_id: props.user_id, comment_id: comment_id, reply_id: reply_id
        }});
        props.refetch();
    }

    return (
        // <Box
        // width="60vw"
        // height="auto"
        // marginBottom="10px"
        // paddingTop="20px"
        // paddingLeft="15px"
        // paddingRight="15px"
        // bg="white"
        // justifyContent="center"
        // >
        //     <Text as="b" fontSize="2.5vw">{comment.comment}</Text> 
        // </Box>

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
            <Avatar src={comment.user.iconImage} _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + comment.user._id)}/>

            {/* USER NAME */}
            <Flex ml={3} spacing="0.1" direction="column">
                <HStack>
                    <Text w="fit-content" fontSize="12px" _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + comment.user._id)}>
                        {comment.user.displayName}
                    </Text>
                    <Text w="fit-content" fontSize="10px">
                        {timeAgo}
                    </Text>
                    {usersComment ? 
                    <HStack>
                        <BsTrash
                            className='trashCan'
                            style={{
                            display: 'inline',
                            verticalAlign: 'middle',
                            fontSize: '70%',
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
                                    handleDeleteComment()
                                }>  
                                Delete Comment
                                </Button>
                                
                            </HStack>
                            :''}
                    </HStack>
                    : ''}
                </HStack>
                <Text fontSize="100%"> {comment.comment}</Text>
                <HStack>
                    {showReply ? 
                        <Button color="blue.500" leftIcon={<ArrowDownIcon />} size="xs" variant="ghost" onClick={() => setShowReply(false)}  _focus={{}}>
                            Hide Replies ({ replies.length })
                        </Button> 
                    
                    :
                        <Button color="blue.500" leftIcon={<ArrowForwardIcon />} size="xs" variant="ghost" onClick={() => setShowReply(true)} _focus={{}}>
                            View Replies ({ replies.length })
                        </Button>
                    }
                </HStack>

                    {!showReply ? "":
                        <Flex direction="column" spacing="15%" display="flex" flexWrap="wrap" marginBottom="5px">
                            {replies.map((reply, key) => {
                                return (
                                    <ReplyCard
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
                            <Input value={reply} onChange={handleReplyChange} variant='filled' placeholder='Reply to the comment...' marginLeft="20px" marginBottom="20px" size="xs"
                                borderRadius={5} _focus={{ border:"1px", borderColor:"blue.400", bgColor:activeBgColor }}/>
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