import { useState } from 'react';
import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid, Button, Center, Stack, Tag, TagLabel, Flex, Input} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { BsTrash } from 'react-icons/bs';
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import * as mutations from '../cache/mutations';
import ReplyCard from './ReplyCard.js'

export default function CommentCard( props ) {    
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
    const handleReplyChange = (event) => setReply(event.target.value);

    function handleDeleteComment() {
        setDeleteConfirmation(false)
        props.handleDeleteComment(comment_id)
    }

    async function handleAddReply(){
        console.log(reply);
        const {data} = await AddReply({ variables: {
            quiz_id: quiz_id, user_id: props.user_id, comment_id: comment_id, reply:reply
        }});
        setReply("");
        props.refetch();
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
        minH="80px"
        marginTop="2%"
        marginBottom="2%"
        marginLeft="2%"
        spacing="1.5%"
        borderBottom="1px" 
        borderColor="gray.400" 
        dipslay="flex" 
        alignItems="left"  
        transition="background-color 0.1s linear"
        overflow="hidden"
        onMouseLeave={() => setDeleteConfirmation(false)}
        >
        {/* USER ICON */}
        <Box className='squareimage_container' h="60px" w="30px" w="5%" minW="55px" marginRight="10px"> 
            <Image className="squareimage" src={comment.user.iconImage} borderRadius="50%"></Image>
        </Box>

        {/* USER NAME */}
        <Flex spacing="0.1" direction="column">
            <HStack>
                <Text w="fit-content" fontSize="12px">
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
                            onClick={() =>
                                setDeleteConfirmation(false)
                            }> 
                            Cancel
                            </Button>

                            <Button 
                            size="xs" 
                            variant='link' 
                            colorScheme="red"
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
            <Text fontSize="100%" fontWeight="medium"> {comment.comment}</Text>
            <HStack>
                {showReply ? 
                <Button leftIcon={<ArrowDownIcon />} size="xs" variant="ghost" onClick={() => setShowReply(false)}>
                        Hide Replies
                </Button> 
                
                :
                <Button leftIcon={<ArrowForwardIcon />} size="xs" variant="ghost" onClick={() => setShowReply(true)}>
                        View Replies
                </Button>
                }
            </HStack>

                {!showReply ? "":
                    <Flex direction="column" spacing="15%" display="flex" flexWrap="wrap" marginBottom="20px">
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
                    <HStack borderBottom="1px" borderColor="gray.400" paddingTop="5px" paddingBottom="10px">
                        <Image src={props.player_icon} alt="pfp" className="round_image" position="relative" />
                        <Input value={reply} onChange={handleReplyChange} size="xs" variant='filled' placeholder='Reply to the comment...' marginLeft="20px" marginBottom="20px"/>
                        <Button w="140px" colorScheme='blue' variant='solid' size="xs" marginLeft="20px" onClick={handleAddReply}>
                            Reply
                        </Button>
                    </HStack>
                : ""}
                

            {/* <Text fontSize="110%"> {platform.followers.length} Followers </Text> */}
        </Flex>
        </Flex>
    )
}

function getTimeAgo(creationDate) {
    // Get difference in time between now and the creation date
    let time_diff_ms= Math.abs(new Date() - creationDate)
    
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

    return "Undefined Date"
}