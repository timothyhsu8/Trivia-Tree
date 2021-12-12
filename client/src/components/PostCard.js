import { useState } from 'react';
import { Text, Image, HStack, Button, Flex, Input, Avatar } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { BsTrash } from 'react-icons/bs';
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import * as mutations from '../cache/mutations';
import ReplyCard from './ReplyCard.js'

export default function PostCard( props ) {    
    let history = useHistory();
    let post = props.post
    let post_id = props.post._id
    let timeAgo = getTimeAgo(props.post.createdAt);
    let usersPost = false;
    let quiz_id = props.quiz_id
    console.log(props.user_id)
    console.log(post.user._id)
    if(post.user._id == props.user_id){
        usersPost = true;
    }


    const [comment, setComment] = useState('');
    const handleCommentChange = (event) => setComment(event.target.value);

    const[deleteConfirmation, setDeleteConfirmation] = useState(false)


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
            <Avatar src={post.user.iconImage} _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + post.user._id)}/>

            {/* USER NAME */}
            <Flex ml={3} spacing="0.1" direction="column">
                <HStack>
                    <Text w="fit-content" fontSize="12px" _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + post.user._id)}>
                        {post.user.displayName}
                    </Text>
                    <Text w="fit-content" fontSize="10px">
                        {timeAgo}
                    </Text>
                    {usersPost ? 
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
                                colorScheme="red">  
                                Delete Post
                                </Button>
                                
                            </HStack>
                            :''}
                    </HStack>
                    : ''}
                </HStack>
                <Text fontSize="100%"> {post.postText}</Text>                    
                {post.postImage != null ? <Image src={post.postImage} maxWidth="200px" maxHeight="300px" marginTop="10px" marginBottom="10px" borderRadius="5%" /> : ""}
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