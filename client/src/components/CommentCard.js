import { useState } from 'react';
import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid, Button, Center, Stack, Tag, TagLabel} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { BsTrash } from 'react-icons/bs';

export default function CommentCard( props ) {    
    let comment = props.comment
    let comment_id = props.comment._id
    let timeAgo = getTimeAgo(props.comment.createdAt);
    let usersComment = false;
    if(comment.user._id == props.user_id){
        usersComment = true;
    }

    const[deleteConfirmation, setDeleteConfirmation] = useState(false)

    function handleDeleteComment() {
        setDeleteConfirmation(false)
        props.handleDeleteComment(comment_id)
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

        <HStack
        h="12vh" 
        w="60vw"
        minH="80px"
        top="50%" 
        spacing="1.5%"
        borderBottom="1px" 
        borderColor="gray.400" 
        dipslay="flex" 
        alignItems="center" 
        _hover={{bgColor:"gray.200", 
        cursor:"pointer", 
        transition:"background-color 0.2s linear"}} 
        transition="background-color 0.1s linear"
        overflow="hidden"
        onMouseLeave={() => setDeleteConfirmation(false)}
        >
        {/* USER ICON */}
        <Box className='squareimage_container' w="5%" minW="55px" ml="2.8%"> 
            <Image className="squareimage" src={comment.user.iconImage} objectFit="cover" borderRadius="50%"></Image>
        </Box>

        {/* USER NAME */}
        <Stack spacing="0.5" direction="column">
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

            {/* <Text fontSize="110%"> {platform.followers.length} Followers </Text> */}
        </Stack>
        </HStack>
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