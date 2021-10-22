import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
    Box,
    Input,
    Center,
    Button as BetterButton,
    Text,
} from '@chakra-ui/react';

function CreateQuiz(props) {
    const [quizTitle, setQuizTitle] = useState('');

    const [quizQuestions, setQuizQuestions] = useState(() => [
        {
            question: '',
            answer: '',
            answerChoices: ['', '', '', ''],
        },
    ]);

    function updateQuestion(event, index) {
        setQuizQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[index].question = event.target.value;
            return newQuestions;
        });
    }

    function updateAnswerChoice(event, questionIndex, index) {
        setQuizQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[questionIndex].answerChoices[index] =
                event.target.value;
            return newQuestions;
        });
    }

    function updateAnswer(index, choice) {
        setQuizQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[index].answer = choice;
            return newQuestions;
        });
    }

    function removeAnswer(index) {
        setQuizQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions.splice(index, 1);
            return newQuestions;
        });
    }

    function addQuestion() {
        setQuizQuestions((prevQuestions) => {
            const newQuestions = [
                ...prevQuestions,
                {
                    question: '',
                    answerChoices: ['', '', '', ''],
                    answer: '',
                },
            ];
            return newQuestions;
        });
    }

    const [createQuiz] = useMutation(CREATE_QUIZ, {
        update() {
            props.history.push('/quizzes');
        },
        onError(err) {
            console.log(err);
        },
    });

    function handleCreateQuiz() {
        console.log(quizTitle);
        console.log(quizQuestions);
        createQuiz({
            variables: {
                quizInput: { title: quizTitle, questions: quizQuestions },
            },
        });
    }

    return (
        <Box>
            <div style={{ display: 'flex' }}>
                <div style={{ textAlign: 'left', width: '33.33333%' }}>
                    <Link
                        className='homeLink'
                        style={{ fontSize: '30px', marginLeft: '10px' }}
                        to='/quizzes'
                    >
                        Quizzes
                    </Link>
                </div>
                <Input
                    variant='flushed'
                    textAlign='center'
                    placeholder='Quiz Title'
                    value={quizTitle}
                    width='33.33333%'
                    height='fit-content'
                    fontSize='50px'
                    onChange={(event) => setQuizTitle(event.target.value)}
                />
                <div
                    style={{
                        textAlign: 'right',
                        width: '33.33333%',
                    }}
                >
                    <Text
                        onClick={() => handleCreateQuiz()}
                        _hover={{ textColor: 'purple', cursor: 'pointer' }}
                        style={{ fontSize: '30px', marginRight: '10px' }}
                    >
                        Submit Quiz
                    </Text>
                </div>
            </div>
            {quizQuestions.map((question, index) => (
                <Box key={index}>
                    <Box marginTop='50px' marginBottom='20px'>
                        <Input
                            marginLeft='25%'
                            display='inline'
                            width='50%'
                            textAlign='center'
                            verticalAlign='middle'
                            fontSize='30px'
                            height='fit-content'
                            border='1px'
                            borderStyle='solid'
                            borderColor='black'
                            borderRadius='8px'
                            placeholder='Question'
                            value={question.question}
                            onChange={(event) => updateQuestion(event, index)}
                        />
                        <BetterButton
                            display='inline'
                            marginLeft='10px'
                            verticalAlign='middle'
                            onClick={() => removeAnswer(index)}
                            colorScheme='red'
                            size='lg'
                        >
                            Remove Question
                        </BetterButton>
                    </Box>
                    <div>
                        {question.answerChoices.map((choice, choiceIndex) => (
                            <Box marginBottom='20px' key={index + choiceIndex}>
                                <Input
                                    marginLeft='38%'
                                    display='inline'
                                    textAlign='center'
                                    verticalAlign='middle'
                                    borderRadius='8px'
                                    fontSize='30px'
                                    width='25%'
                                    border='1px'
                                    borderStyle='solid'
                                    borderColor='black'
                                    placeholder={'Choice: ' + (choiceIndex + 1)}
                                    value={choice}
                                    onChange={(event) =>
                                        updateAnswerChoice(
                                            event,
                                            index,
                                            choiceIndex
                                        )
                                    }
                                    background='transparent'
                                />
                                <BetterButton
                                    background={
                                        question.answer === choice &&
                                        choice.trim() !== ''
                                            ? 'green'
                                            : 'transparent'
                                    }
                                    border='solid'
                                    borderColor='black'
                                    display='inline'
                                    verticalAlign='middle'
                                    marginLeft='10px'
                                    onClick={() => updateAnswer(index, choice)}
                                    colorScheme='green'
                                    size='sm'
                                ></BetterButton>
                            </Box>
                        ))}
                    </div>
                </Box>
            ))}
            <Center>
                <BetterButton
                    onClick={() => addQuestion()}
                    marginTop='50px'
                    colorScheme='blue'
                    size='lg'
                    marginBottom='50px'
                >
                    Add Question
                </BetterButton>
            </Center>
        </Box>
    );
}

const CREATE_QUIZ = gql`
    mutation ($quizInput: QuizInput!) {
        createQuiz(quizInput: $quizInput) {
            title
            _id
        }
    }
`;

export default CreateQuiz;
