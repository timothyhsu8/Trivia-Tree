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
        <div
            style={{
                marginTop: questionIndex === 0 ? '30px' : '30px',
            }}
            ref={questionRef}
        >
            <Box position='relative'>
                <Text verticalAlign='middle' display='inline' fontSize='170%'>
                    Question #{questionIndex + 1}
                </Text>
                <Select
                    _hover={{ outline: 'none' }}
                    _focus={{ outline: 'none' }}
                    borderColor='black'
                    borderWidth='2px'
                    value={quizQuestion.questionType}
                    onChange={(event) =>
                        updateQuestionType(
                            parseInt(event.target.value),
                            quizQuestion.id
                        )
                    }
                    width='15%'
                    display='inline-block'
                    marginLeft='20px'
                >
                    <option value={1}>Multiple Choice</option>
                    <option value={2}>Checkboxes</option>
                </Select>
                <BsTrash
                    className='trashCan'
                    style={{
                        position: 'absolute',
                        right: '10%',
                        bottom: '10%',
                        fontSize: '180%',
                    }}
                    onClick={() => removeQuestion(quizQuestion.id)}
                />
            </Box>
            <Textarea
                marginTop='20px'
                value={quizQuestion.question}
                onChange={(event) => {
                    updateQuestion(event.target.value, quizQuestion.id);
                }}
                placeholder='Enter Question'
                height='fit-content'
                overflow='auto'
                borderColor='black'
                borderWidth='3px'
                _focus={{ borderColor: 'black' }}
                _hover={{ borderColor: 'black' }}
                fontSize='160%'
                width='90%'
            />
            <div>
                {quizQuestion.answerChoices.map((answerChoice) => (
                    <HStack key={answerChoice.id} style={{ marginTop: '20px' }}>
                        <Button
                            border='solid'
                            borderColor='black'
                            display='inline'
                            verticalAlign='middle'
                            marginLeft='20px'
                            marginRight='20px'
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
                            borderRadius='10px'
                            placeholder='Enter Answer Choice'
                            variant='flushed'
                            borderColor='black'
                            borderBottomWidth='3px'
                            _focus={{
                                borderColor: 'black',
                            }}
                            fontSize='150%'
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
                                fontSize: '150%',
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
                    _focus={{ outline: 'none' }}
                    marginLeft='70px'
                    marginTop='20px'
                    borderColor='black'
                    border='solid'
                    borderWidth='2px'
                    onClick={() => addAnswerChoice(quizQuestion.id)}
                >
                    Add Answer Choice
                </Button>
            </div>
        </div>
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
