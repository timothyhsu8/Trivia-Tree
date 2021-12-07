import React from 'react';
import {
    Input,
    Textarea,
    Text,
    Button,
    HStack,
    Box,
    Select,
} from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import { AddIcon } from '@chakra-ui/icons';

function QuestionCreatorCard({
    quizQuestion,
    questionIndex,
    updateQuestion,
    removeQuestion,
    updateQuestionType,
    updateAnswerChoice,
    addAnswerChoice,
    removeAnswerChoice,
    updateAnswer,
    questionRef,
}) {
    // console.log('Rendering question ' + (questionIndex + 1));
    return (
        <Box
            mr={10}
            border="1px"
            boxShadow="sm"
            borderRadius={8}
            borderColor="gray.200"
            padding={4}
            style={{
                marginTop: questionIndex === 0 ? '30px' : '30px',
            }}
            ref={questionRef}
        >
            <Box position='relative'>
                <HStack spacing={4}>
                    <Text verticalAlign='middle' display='inline' fontSize='110%' fontWeight="medium">
                        Question #{questionIndex + 1}
                    </Text>
                    <Select
                        w='fit-content'
                        _hover={{ outline: 'none' }}
                        _focus={{ outline: 'none' }}
                        borderColor='gray.400'
                        borderWidth='1px'
                        value={quizQuestion.questionType}
                        onChange={(event) =>
                            updateQuestionType(
                                parseInt(event.target.value),
                                quizQuestion.id
                            )
                        }
                        display='inline-block'
                        marginLeft='20px'
                    >
                        <option value={1}>Multiple Choice</option>
                        <option value={2}>Select All That Apply</option>
                    </Select>
                </HStack>
                <BsTrash
                    className='trashCan'
                    style={{
                        position: 'absolute',
                        right: '1%',
                        bottom: '10%',
                        fontSize: '120%',
                    }}
                    onClick={() => removeQuestion(quizQuestion.id)}
                />
            </Box>
            <Input
                marginTop='20px'
                value={quizQuestion.question}
                onChange={(event) => {
                    updateQuestion(event.target.value, quizQuestion.id);
                }}
                placeholder='Question Title'
                borderColor="gray.400"
                padding={2}
                variant="flushed"
                _focus={{ borderColor: 'blue.500', bgColor:"gray.100" }}
                _hover={{ borderColor: 'blue.500', bgColor:"gray.100" }}
                fontSize='110%'
                width='90%'
            />
            <div>
                {quizQuestion.answerChoices.map((answerChoice) => (
                    <HStack key={answerChoice.id} style={{ marginTop: '20px' }}>
                        <Button
                            border='1px'
                            borderColor='gray.500'
                            display='inline'
                            verticalAlign='middle'
                            marginLeft='20px'
                            marginRight='10px'
                            colorScheme='green'
                            background={
                                answerChoice.answer &&
                                answerChoice.choice.trim() !== ''
                                    ? 'rgba(124, 252, 0, 0.5)'
                                    : 'transparent'
                            }
                            size='xs'
                            _focus={{ outline: 'none' }}
                            onClick={() =>
                                updateAnswer(
                                    quizQuestion.id,
                                    answerChoice.id,
                                    answerChoice.choice
                                )
                            }
                        />
                        <Input
                            value={answerChoice.choice}
                            onChange={(event) =>
                                updateAnswerChoice(
                                    event.target.value,
                                    quizQuestion.id,
                                    answerChoice.id
                                )
                            }
                            backgroundColor={
                                answerChoice.answer &&
                                answerChoice.choice.trim() !== ''
                                    ? 'rgba(124, 252, 0, 0.5)'
                                    : 'transparent'
                            }
                            // borderRadius='10px'
                            placeholder='Answer Choice'
                            variant='flushed'
                            borderColor='gray.400'
                            borderBottomWidth='1px'
                            _hover={{
                                bgColor: "gray.100"
                            }}
                            _focus={{
                                borderColor: 'blue.500',
                            }}
                            fontSize='100%'
                            height='fit-content'
                            display='inline'
                            verticalAlign='middle'
                            width='80%'
                        />
                        <BsTrash
                            className='trashCan'
                            style={{
                                display: 'inline',
                                verticalAlign: 'middle',
                                fontSize: '110%',
                                marginLeft: '20px',
                            }}
                            onClick={() =>
                                removeAnswerChoice(
                                    quizQuestion.id,
                                    answerChoice.id
                                )
                            }
                        />
                    </HStack>
                ))}
                <Button
                    size="sm"
                    leftIcon={<AddIcon />}
                    colorScheme="twitter"
                    _focus={{ outline: 'none' }}
                    marginLeft='60px'
                    marginTop='20px'
                    onClick={() => addAnswerChoice(quizQuestion.id)}
                >
                    Add Answer Choice
                </Button>
            </div>
        </Box>
    );
}

function areEqual(prevProps, nextProps) {
    let quickStatement =
        prevProps.quizQuestion.question === nextProps.quizQuestion.question &&
        prevProps.quizQuestion.answerChoices.length ===
            nextProps.quizQuestion.answerChoices.length &&
        prevProps.questionIndex === nextProps.questionIndex &&
        prevProps.quizQuestion.questionType ===
            nextProps.quizQuestion.questionType;
    if (quickStatement) {
        for (let i = 0; i < nextProps.quizQuestion.answerChoices.length; i++) {
            if (
                prevProps.quizQuestion.answerChoices[i].choice !==
                    nextProps.quizQuestion.answerChoices[i].choice ||
                prevProps.quizQuestion.answerChoices[i].answer !==
                    nextProps.quizQuestion.answerChoices[i].answer
            ) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

export default React.memo(QuestionCreatorCard, areEqual);
