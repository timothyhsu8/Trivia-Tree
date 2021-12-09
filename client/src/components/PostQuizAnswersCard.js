import React from 'react'
import { Box, Text, Stack, Icon, HStack } from "@chakra-ui/react"
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

import '../styles/postpage.css';

export default function PostQuizAnswersCard(props) {
    // let down_arrow="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/TriangleArrow-Down.svg/1200px-TriangleArrow-Down.svg.png";
    // let right_arrow="data:image/png;base64,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";

    const [showDetails, setShowDetails] = React.useState(false)
    const onClickDetails = () => {setShowDetails(!showDetails);}
    var bgcolor = 'blue.500'

    let question = props.question
    let questionTitle = props.question.question
    let answer = question.answer 
    if(answer.concat().sort().toString().trim() !== props.answer.concat().sort().toString().trim()) {
        bgcolor = "red.500"
    }
    

    /*Edit the mt/mb to change the spacing between elements */
    return ( 
        <Box className="containerAcross" mb={props.isLast ? "120px" : ""} >
            {/* Arrow */}
            { showDetails ? 
                <Box ml="15px" mt="10px" mb="26px">
                    <Icon as={ChevronDownIcon} onClick={onClickDetails} _hover={{cursor:"pointer"}}/>
                </Box>
            : 
                <Box ml="15px" mt="14px" mb="26px">
                     <Icon as={ChevronRightIcon} onClick={onClickDetails} _hover={{cursor:"pointer"}}/>
                </Box>
            
            }
            
            {/* Question Box */}
            <Box className="containerDown" w="100%" p={2}>
                <Box width={["80vw","80vw","80vw","61.2vw"]} h="45px" bg={bgcolor} borderRadius={5} _hover={{cursor:"pointer", opacity:"85%", transition:".15s linear"}} 
                    _active={{opacity:"75%"}}    transition=".1s linear" onClick={onClickDetails}>  {/* Gradebox */}
                    <Box h="100%" display="flex" flexDirection="column" justifyContent="center">
                        <Text color="white" fontWeight="medium" pl={4}>
                            {props.place}.   {questionTitle} 
                        </Text>
                    </Box>
                </Box>

                {/* Show Correct Answer */}
                { showDetails ? 
                <Box width={["80vw","80vw","80vw","61.2vw"]} borderRight="1px" borderLeft="1px" borderBottom="1px" borderBottomRadius={10} borderColor="gray.300">  {/* Gradebox */}
                    <Stack p={2}>
                        <HStack>
                            <Text color={bgcolor}> Your Answer: </Text>
                            <Text color={bgcolor} fontWeight="medium"> {props.answer.concat().sort().join(', ')} </Text>
                        </HStack>
                        
                        <HStack>
                            <Text> Correct Answer: </Text>
                            <Text fontWeight="medium"> {answer.concat().sort().join(', ')} </Text>
                        </HStack>
                    </Stack>
                </Box>
                : null}

            </Box>
        </Box>
        
    )
}
