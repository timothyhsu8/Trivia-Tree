import React from 'react';
import { Box, Text, Avatar, useColorModeValue, HStack, Grid, Center } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import '../styles/postpage.css';

export default function AttemptEntryCard(props) {
    let history = useHistory();
    /*Edit the mt/mb to change the spacing between elements */
    //Dark mode styling
    const whiteBlackText = useColorModeValue('gray.600', 'white');
    return (
        <Grid h={12} templateColumns='0.3fr 0.5fr 0.3fr' borderBottom='1px' borderColor='gray.200' cursor='pointer' onClick={() => history.push(`/postquizpage/${props.quizId}/${props.id}`)} _hover={{backgroundColor: 'gray.100'}}>
            <Box display='flex' flexDirection='column' justifyContent='center'>
                <Center>
                    <Text color={whiteBlackText} fontWeight='medium'>
                        {' '}
                        {(new Date(parseInt(props.id.substring(0, 8), 16) * 1000)).toLocaleDateString()}{' '}
                    </Text>
                </Center>
            </Box>

            <Box display='flex' flexDirection='column' justifyContent='center'>
                <Center>
                    <Text color={whiteBlackText}> {props.time} </Text>
                </Center>
            </Box>

            <Box display='flex' flexDirection='column' justifyContent='center'>
                <Center>
                    <Text color={whiteBlackText}>{props.score}</Text>
                </Center>
            </Box>
        </Grid>
    );
}
