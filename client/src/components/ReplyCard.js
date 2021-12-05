import { useState } from 'react';
import { Text, Avatar, HStack, Button, Stack, Flex} from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';

export default function ReplyCard( props ) {   
    let history = useHistory();
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
            w="55vw"
            marginTop="2%"
            paddingBottom="1%"
            marginLeft="2%"
            borderBottom="1px" 
            borderColor="gray.200" 
            dipslay="flex" 
            alignItems="left"  
            transition="background-color 0.1s linear"
            overflow="hidden"
        >
        {/* USER ICON */}
        <Avatar src={reply.user.iconImage} size="sm" _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + reply.user._id)}/>

        {/* USER NAME */}
        <Stack pl={2} spacing="0.1" direction="column">
            <HStack>
                <Text w="fit-content" fontSize="12px" _hover={{cursor:"pointer"}} onClick={() => history.push('/accountpage/' + reply.user._id)}>
                    {reply.user.displayName}
                </Text>
                <Text w="fit-content" fontSize="10px">
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
            <Text> {reply.reply} </Text>
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

    return "A few seconds ago"
}