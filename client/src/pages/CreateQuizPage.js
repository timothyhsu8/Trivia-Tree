import { React, useState, useReducer } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
    Input,
    Select,
    Textarea,
    Text,
    Button,
    Image,
    RadioGroup,
    Stack,
    Radio,
    Center,
} from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import TimeField from 'react-simple-timefield';
import '../styles/CreateQuizPage.css';

function CreateQuizPage(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([
        {
            question: '',
            answerChoices: ['', '', '', ''],
            answer: '',
        },
    ]);
    const [quizType, setQuizType] = useState('Standard');
    const [quizOrdering, setQuizOrdering] = useState('Ordered');
    const [timeType, setTimeType] = useState('Quiz');
    const [quizTimer, setQuizTimer] = useState('00:00:00');
    const [questionTimer, setQuestionTimer] = useState('00:00:00');

    function updateQuestion(event, index) {
        const newQuestions = [...quizQuestions];
        newQuestions[index].question = event.target.value;
        setQuizQuestions(newQuestions);
    }

    function updateAnswerChoice(event, questionIndex, index) {
        const newQuestions = [...quizQuestions];
        if (
            newQuestions[questionIndex].answerChoices[index] ===
                newQuestions[questionIndex].answer &&
            event.target.value.trim() === ''
        ) {
            newQuestions[questionIndex].answer = '';
        }
        newQuestions[questionIndex].answerChoices[index] = event.target.value;
        setQuizQuestions(newQuestions);
    }

    function addAnswerChoice(questionIndex) {
        const newQuestions = [...quizQuestions];
        newQuestions[questionIndex].answerChoices.push('');
        setQuizQuestions(newQuestions);
    }

    function removeAnswerChoice(questionIndex, index) {
        const newQuestions = [...quizQuestions];
        if (
            newQuestions[questionIndex].answerChoices[index] ===
            newQuestions[questionIndex].answer
        ) {
            newQuestions[questionIndex].answer = '';
        }
        newQuestions[questionIndex].answerChoices.splice(index, 1);
        setQuizQuestions(newQuestions);
    }

    function updateAnswer(index, choice) {
        const newQuestions = [...quizQuestions];
        newQuestions[index].answer = choice;
        setQuizQuestions(newQuestions);
    }

    function addQuestion() {
        const newQuestions = [
            ...quizQuestions,
            {
                question: '',
                answerChoices: ['', '', '', ''],
                answer: '',
            },
        ];
        setQuizQuestions(newQuestions);
    }

    function removeQuestion(index) {
        const newQuestions = [...quizQuestions];
        newQuestions.splice(index, 1);
        setQuizQuestions(newQuestions);
    }

    const [createQuiz] = useMutation(CREATE_QUIZ, {
        update() {
            props.history.push('/');
        },
        onError(err) {
            console.log(err);
        },
    });

    function handleCreateQuiz() {
        createQuiz({
            variables: {
                quizInput: { title: title, questions: quizQuestions, description: description },
            },
        });
    }

    return (
        <div className='container'>
            <div className='leftSideSpacer' />
            <div className='title-description'>
                <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder='Enter Quiz Title'
                    variant='flushed'
                    borderColor='black'
                    borderBottomWidth='3px'
                    _focus={{ borderColor: 'black' }}
                    fontSize='300%'
                    height='fit-content'
                    marginTop='10px'
                    display='flex'
                    width='80%'
                />
                <Text marginLeft='10px'>Quiz Title</Text>
                <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder='Enter Quiz Description'
                    fontSize='100%'
                    height='fit-content'
                    borderColor='black'
                    borderWidth='3px'
                    _focus={{ borderColor: 'black' }}
                    _hover={{ borderColor: 'black' }}
                    resize='none'
                    marginTop='30px'
                    width='50%'
                />
                <Text marginLeft='10px'>Quiz Description</Text>
            </div>
            <div className='platform-icon'>
                <div
                    style={{
                        display: 'flex',
                        marginLeft: '20px',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        display='inline-block'
                        fontSize='200%'
                        marginRight='20px'
                    >
                        Platform:
                    </Text>
                    <Select
                        _hover={{ outline: 'none' }}
                        _focus={{ outline: 'none' }}
                        borderColor='black'
                        borderWidth='2px'
                        width='fit-content'
                        display='inline-block'
                        defaultValue='None'
                    >
                        <option value='None'>None</option>
                        <option value='Stony Brook'>Stony Brook</option>
                        <option value='Sports'>Sports</option>
                        <option value='School Subject'>School Subject</option>
                    </Select>
                </div>
                <Text fontSize='200%' marginRight='auto' marginLeft='auto'>
                    Quiz Icon
                </Text>
                <Image
                    boxSize='100px'
                    borderRadius='20px'
                    src='https://pbs.twimg.com/profile_images/1435332122655563777/KITvycyb_400x400.jpg'
                    marginRight='auto'
                    marginLeft='auto'
                />
                <Button
                    _focus={{ outline: 'none' }}
                    marginTop='10px'
                    fontSize='22px'
                    width='fit-content'
                    height='fit-content'
                    borderColor='black'
                    border='solid'
                    borderWidth='2px'
                    marginLeft='auto'
                    marginRight='auto'
                >
                    Upload Image
                </Button>
            </div>
            <div className='question'>
                {quizQuestions.map((quizQuestion, index) => (
                    <div
                        style={{ marginTop: index === 0 ? '10px' : '30px' }}
                        key={index}
                    >
                        <div>
                            <Text
                                verticalAlign='middle'
                                display='inline'
                                fontSize='200%'
                            >
                                Question #{index + 1}
                            </Text>
                            <BsTrash
                                className='trashCan'
                                style={{
                                    display: 'inline',
                                    verticalAlign: 'middle',
                                    fontSize: '160%',
                                    marginLeft: '20px',
                                }}
                                onClick={() => removeQuestion(index)}
                            />
                        </div>
                        <Input
                            value={quizQuestion.question}
                            onChange={(event) => updateQuestion(event, index)}
                            placeholder='Enter Question'
                            variant='flushed'
                            borderColor='black'
                            borderBottomWidth='3px'
                            _focus={{ borderColor: 'black' }}
                            fontSize='300%'
                            height='fit-content'
                            display='flex'
                            width='90%'
                        />
                        <div>
                            {quizQuestion.answerChoices.map(
                                (choice, choiceIndex) => (
                                    <div
                                        style={{ marginTop: '20px' }}
                                        key={index + choiceIndex + 1}
                                    >
                                        <Button
                                            border='solid'
                                            borderColor='black'
                                            display='inline'
                                            verticalAlign='middle'
                                            marginLeft='20px'
                                            marginRight='20px'
                                            colorScheme='green'
                                            background={
                                                quizQuestion.answer ===
                                                    choice &&
                                                choice.trim() !== ''
                                                    ? 'rgba(124, 252, 0, 0.5)'
                                                    : 'transparent'
                                            }
                                            size='sm'
                                            _focus={{ outline: 'none' }}
                                            onClick={() =>
                                                updateAnswer(index, choice)
                                            }
                                        />
                                        <Input
                                            value={choice}
                                            onChange={(event) =>
                                                updateAnswerChoice(
                                                    event,
                                                    index,
                                                    choiceIndex
                                                )
                                            }
                                            backgroundColor={
                                                quizQuestion.answer ===
                                                    choice &&
                                                choice.trim() !== ''
                                                    ? 'rgba(124, 252, 0, 0.5)'
                                                    : 'transparent'
                                            }
                                            borderRadius='10px'
                                            placeholder='Enter Answer Choice'
                                            variant='flushed'
                                            borderColor='black'
                                            borderBottomWidth='3px'
                                            _focus={{ borderColor: 'black' }}
                                            fontSize='200%'
                                            height='fit-content'
                                            display='inline'
                                            width='80%'
                                            verticalAlign='middle'
                                        />
                                        <BsTrash
                                            className='trashCan'
                                            style={{
                                                display: 'inline',
                                                verticalAlign: 'middle',
                                                fontSize: '160%',
                                                marginLeft: '20px',
                                            }}
                                            onClick={() =>
                                                removeAnswerChoice(
                                                    index,
                                                    choiceIndex
                                                )
                                            }
                                        />
                                    </div>
                                )
                            )}
                            <Button
                                _focus={{ outline: 'none' }}
                                marginLeft='70px'
                                marginTop='10px'
                                borderColor='black'
                                border='solid'
                                borderWidth='2px'
                                onClick={() => addAnswerChoice(index)}
                            >
                                Add Answer Choice
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    _focus={{ outline: 'none' }}
                    marginTop='10px'
                    padding='20px'
                    width='30%'
                    borderColor='black'
                    border='solid'
                    borderWidth='2px'
                    marginLeft='auto'
                    marginRight='auto'
                    fontSize='130%'
                    onClick={() => addQuestion()}
                >
                    Add Question
                </Button>
            </div>
            <div className='sidebar'>
                <Text
                    marginTop='10px'
                    marginBottom='10px'
                    fontSize='200%'
                    marginRight='auto'
                    marginLeft='auto'
                >
                    Options
                </Text>
                <div
                    style={{
                        border: 'solid',
                        borderColor: 'black',
                        borderWidth: '2px',
                        borderRadius: '10px',
                        marginLeft: '5px',
                        marginRight: '5px',
                        textAlign: 'center',
                    }}
                >
                    <Text marginTop='5px' fontSize='150%'>
                        Quiz Type
                    </Text>
                    <Center marginTop='10px'>
                        <RadioGroup onChange={setQuizType} value={quizType}>
                            <Stack spacing={20} direction='row'>
                                <Radio
                                    colorScheme='blackAlpha'
                                    size='lg'
                                    value='Standard'
                                >
                                    Standard
                                </Radio>
                                <Radio
                                    colorScheme='blackAlpha'
                                    size='lg'
                                    value='Instant'
                                >
                                    Instant
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </Center>
                    <hr
                        style={{
                            width: '90%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '15px',
                            borderColor: 'black',
                            borderWidth: '1px',
                        }}
                    />
                    <Text marginTop='15px' fontSize='150%'>
                        Question Ordering
                    </Text>
                    <Center marginTop='10px'>
                        <RadioGroup
                            onChange={setQuizOrdering}
                            value={quizOrdering}
                        >
                            <Stack spacing={20} direction='row'>
                                <Radio
                                    colorScheme='blackAlpha'
                                    size='lg'
                                    value='Ordered'
                                >
                                    Ordered
                                </Radio>
                                <Radio
                                    colorScheme='blackAlpha'
                                    size='lg'
                                    value='Shuffled'
                                >
                                    Shuffled
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </Center>
                    <hr
                        style={{
                            width: '90%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '15px',
                            borderColor: 'black',
                            borderWidth: '1px',
                        }}
                    />
                    <Text
                        marginTop='15px'
                        verticalAlign='middle'
                        display='inline'
                        fontSize='150%'
                        marginLeft='40px'
                    >
                        Quiz Timer
                    </Text>
                    <Button
                        border='solid'
                        borderColor='black'
                        borderRadius='25px'
                        display='inline'
                        verticalAlign='middle'
                        marginLeft='20px'
                        colorScheme='blackAlpha'
                        background={
                            timeType === 'Quiz' ? 'black' : 'transparent'
                        }
                        size='xs'
                        _focus={{ outline: 'none' }}
                        onClick={() => setTimeType('Quiz')}
                    />
                    <Center marginTop='10px'>
                        <TimeField
                            className='timer'
                            value={quizTimer}
                            onChange={(event) =>
                                setQuizTimer(event.target.value)
                            }
                            showSeconds
                            style={{
                                border: 'solid',
                                borderColor: 'black',
                                borderWidth: '2px',
                                borderRadius: '10px',
                                background: 'none',
                                width: '25%',
                                fontSize: '150%',
                                textAlign: 'center',
                            }}
                        />
                    </Center>
                    <hr
                        style={{
                            width: '90%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '15px',
                            borderColor: 'black',
                            borderWidth: '1px',
                        }}
                    />
                    <Text
                        marginTop='15px'
                        verticalAlign='middle'
                        display='inline'
                        fontSize='150%'
                        marginLeft='40px'
                    >
                        Question Timer
                    </Text>
                    <Button
                        border='solid'
                        borderColor='black'
                        borderRadius='25px'
                        display='inline'
                        verticalAlign='middle'
                        marginLeft='20px'
                        colorScheme='blackAlpha'
                        background={
                            timeType === 'Question' ? 'black' : 'transparent'
                        }
                        size='xs'
                        _focus={{ outline: 'none' }}
                        onClick={() => setTimeType('Question')}
                    />
                    <Center marginTop='10px' marginBottom='15px'>
                        <TimeField
                            className='timer'
                            value={questionTimer}
                            onChange={(event) =>
                                setQuestionTimer(event.target.value)
                            }
                            showSeconds
                            style={{
                                border: 'solid',
                                borderColor: 'black',
                                borderWidth: '2px',
                                borderRadius: '10px',
                                background: 'none',
                                width: '25%',
                                fontSize: '150%',
                                textAlign: 'center',
                            }}
                        />
                    </Center>
                </div>
            </div>
            <div className='footer'>
                <Button
                    border='solid'
                    borderColor='white'
                    borderRadius='10px'
                    colorScheme='blue'
                    width='30%'
                    margin='0 auto'
                    // marginRight='auto'
                    size='md'
                    fontSize='140%'
                    _focus={{ outline: 'none' }}
                    onClick={() => handleCreateQuiz()}
                >
                    Create Quiz
                </Button>
            </div>
        </div>
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

export default CreateQuizPage;
