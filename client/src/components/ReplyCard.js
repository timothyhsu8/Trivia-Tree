import { useState } from 'react';
import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid, Button, Center, Stack, Tag, TagLabel, Flex, Input} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { BsTrash } from 'react-icons/bs';
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import * as mutations from '../cache/mutations';

export default function ReplyCard( props ) {    
    let reply = props.reply
    let reply_id = props.reply._id
    let timeAgo = getTimeAgo(props.reply.createdAt);
    let usersReply = false;
    let quiz_id = props.quiz_id
    if(reply.user._id == props.user_id){
        usersReply = true;
    }


    const[deleteConfirmation, setDeleteConfirmation] = useState(false)


    function handleDeleteReply() {
        setDeleteConfirmation(false)
        props.handleDeleteReply(reply_id)
    }

    return (
        <Flex
        direction="row"
        h="auto" 
        w="50vw"
        marginTop="2%"
        paddingBottom="1%"
        marginLeft="2%"
        borderBottom="1px" 
        borderColor="gray.400" 
        dipslay="flex" 
        alignItems="left"  
        transition="background-color 0.1s linear"
        overflow="hidden"
        onMouseLeave={() => setDeleteConfirmation(false)}
        >
        {/* USER ICON */}
        <Box className='squareimage_container' h="30px" w="25px" marginRight="10px"> 
            <Image className="squareimage" src={reply.user.iconImage} borderRadius="50%"></Image>
        </Box>

        {/* USER NAME */}
        <Stack spacing="0.1" direction="column">
            <HStack>
                <Text w="fit-content" fontSize="10px">
                    {reply.user.displayName}
                </Text>
                <Text w="fit-content" fontSize="8px">
                    {timeAgo}
                </Text>
                {usersReply ? 
                <HStack>
                    <BsTrash
                        className='trashCan'
                        style={{
                        display: 'inline',
                        verticalAlign: 'middle',
                        fontSize: '65%',
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
                                handleDeleteReply()
                            }>  
                            Delete Reply
                            </Button>
                            
                        </HStack>
                        :''}
                </HStack>
                : ''}
            </HStack>
            <Text fontSize="50%" fontWeight="medium"> {reply.reply}</Text>
        </Stack>
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