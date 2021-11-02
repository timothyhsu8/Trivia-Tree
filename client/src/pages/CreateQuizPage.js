import { React, useState, useReducer, createRef } from 'react';
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
    HStack,
    VStack,
    Box,
} from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import { RiArrowRightSLine } from 'react-icons/ri';
import TimeField from 'react-simple-timefield';
import '../styles/CreateQuizPage.css';

let currentId = 0;

function CreateQuizPage(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([
        {
            question: '',
            answerChoices: ['', '', '', ''],
            answer: '',
            id: currentId,
        },
    ]);
    const [icon, setIcon] = useState(null);
    const [quizType, setQuizType] = useState('Standard');
    const [quizOrdering, setQuizOrdering] = useState('Ordered');
    const [timeType, setTimeType] = useState('Quiz');
    const [quizTimer, setQuizTimer] = useState('10:00:00');
    const [questionTimer, setQuestionTimer] = useState('00:00:00');
    const hiddenImageInput = createRef(null);

    const refs = quizQuestions.reduce((acc, value) => {
        acc[value.id] = createRef();
        return acc;
    }, {});

    function handleScrollAction(id) {
        let targetEle = refs[id].current;
        let pos = targetEle.style.position;
        let top = targetEle.style.top;
        targetEle.style.position = 'relative';
        targetEle.style.top = '-60px';
        targetEle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEle.style.top = top;
        targetEle.style.position = pos;
    }

    function updateTitle(event) {
        setTitle(event.target.value);
    }

    function updateDescription(event) {
        setDescription(event.target.value);
    }

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
        if (choice.trim() !== '') {
            const newQuestions = [...quizQuestions];
            newQuestions[index].answer = choice;
            setQuizQuestions(newQuestions);
        }
    }

    function addQuestion() {
        const newQuestions = [
            ...quizQuestions,
            {
                question: '',
                answerChoices: ['', '', '', ''],
                answer: '',
                id: ++currentId,
            },
        ];
        setQuizQuestions(newQuestions);
    }

    function removeQuestion(index) {
        const newQuestions = [...quizQuestions];
        newQuestions.splice(index, 1);
        setQuizQuestions(newQuestions);
    }

    function updateIcon(event) {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setIcon(URL.createObjectURL(img));
        }
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
        quizQuestions.forEach((e) => delete e.id);
        createQuiz({
            variables: {
                quizInput: {
                    title: title,
                    questions: quizQuestions,
                    description: description,
                    quizTimer: quizTimer,
                },
            },
        });
    }

    return (
        <div className='container'>
            <div className='gridContainer'>
                <div className='leftSidebar'>
                    <Box
                        position='sticky'
                        top='70px'
                        height='800px'
                        overflowY='auto'
                        width='90%'
                    >
                        <Text marginLeft='10px' fontSize='160%'>
                            Go To:
                        </Text>
                        {quizQuestions.map((item, index) => (
                            <HStack
                                key={item.id}
                                marginLeft='5px'
                                marginTop={index > 0 ? '20px' : '0px'}
                            >
                                <RiArrowRightSLine fontSize='150%' />
                                <Text
                                    fontSize='120%'
                                    fontWeight='500'
                                    width='80%'
                                    overflowWrap='anywhere'
                                    cursor='pointer'
                                    onClick={() => handleScrollAction(item.id)}
                                >
                                    Question #{index + 1} -{' '}
                                    {item.question
                                        .trim()
                                        .split(' ')
                                        .splice(0, 8)
                                        .join(' ')}
                                    {item.question.trim().split(' ').length > 8
                                        ? '...'
                                        : ''}
                                </Text>
                            </HStack>
                        ))}
                    </Box>
                </div>
                <div className='title-description'>
                    <Input
                        onBlur={(event) => updateTitle(event)}
                        placeholder='Enter Quiz Title'
                        variant='flushed'
                        borderColor='black'
                        borderBottomWidth='3px'
                        _focus={{ borderColor: 'black' }}
                        fontSize='200%'
                        height='fit-content'
                        width='80%'
                    />
                    <Text marginLeft='10px'>Quiz Title</Text>
                    <Textarea
                        onBlur={(event) => updateDescription(event)}
                        placeholder='Enter Quiz Description'
                        fontSize='100%'
                        height='fit-content'
                        overflow='auto'
                        borderColor='black'
                        borderWidth='3px'
                        _focus={{ borderColor: 'black' }}
                        _hover={{ borderColor: 'black' }}
                        marginTop='30px'
                        width='50%'
                    />
                    <Text marginLeft='10px'>Quiz Description</Text>
                </div>
                <div className='question'>
                    {quizQuestions.map((quizQuestion, index) => (
                        <div
                            style={{
                                marginTop: index === 0 ? '30px' : '30px',
                            }}
                            key={quizQuestion.id}
                            ref={refs[quizQuestion.id]}
                        >
                            <div>
                                <Text
                                    verticalAlign='middle'
                                    display='inline'
                                    fontSize='170%'
                                >
                                    Question #{index + 1}
                                </Text>
                                <BsTrash
                                    className='trashCan'
                                    style={{
                                        display: 'inline',
                                        verticalAlign: 'middle',
                                        fontSize: '180%',
                                        marginLeft: '20px',
                                    }}
                                    onClick={() => removeQuestion(index)}
                                />
                            </div>
                            <Textarea
                                onBlur={(event) => updateQuestion(event, index)}
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
                                {quizQuestion.answerChoices.map(
                                    (choice, choiceIndex) => (
                                        <HStack
                                            style={{ marginTop: '20px' }}
                                            key={
                                                quizQuestion.id +
                                                choiceIndex +
                                                1
                                            }
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
                                                size='xs'
                                                _focus={{ outline: 'none' }}
                                                onClick={() =>
                                                    updateAnswer(index, choice)
                                                }
                                            />
                                            <Input
                                                onBlur={(event) =>
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
                                                        index,
                                                        choiceIndex
                                                    )
                                                }
                                            />
                                        </HStack>
                                    )
                                )}
                                <Button
                                    _focus={{ outline: 'none' }}
                                    marginLeft='70px'
                                    marginTop='20px'
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
                    <Center>
                        <Button
                            _focus={{ outline: 'none' }}
                            marginTop='10px'
                            padding='20px'
                            borderColor='black'
                            border='solid'
                            borderWidth='2px'
                            fontSize='120%'
                            onClick={() => addQuestion()}
                        >
                            Add Question
                        </Button>
                    </Center>
                </div>
                <div className='rightSidebar'>
                    <Box position='sticky' top='70px'>
                        <HStack
                            display='flex'
                            flexDirection='column'
                            direction='row'
                        >
                            <Text fontSize='160%'>Platform:</Text>
                            <Select
                                fontSize='160%'
                                _hover={{ outline: 'none' }}
                                _focus={{ outline: 'none' }}
                                borderColor='black'
                                borderWidth='2px'
                                defaultValue='None'
                                width='fit-content'
                            >
                                <option value='None'>None</option>
                                <option value='Stony Brook'>Stony Brook</option>
                                <option value='Sports'>Sports</option>
                                <option value='School Subject'>
                                    School Subject
                                </option>
                            </Select>
                        </HStack>
                        <VStack marginTop='20px'>
                            <Text fontSize='160%'>Quiz Icon</Text>
                            <img
                                style={{
                                    maxHeight: '100px',
                                    maxWidth: '100px',
                                    objectFit: 'contain',
                                    width: 'auto',
                                    height: 'auto',
                                    display: 'block',
                                }}
                                // borderRadius='20px'
                                src={icon}
                            />
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={hiddenImageInput}
                                onChange={(event) => updateIcon(event)}
                            />
                            <Button
                                _focus={{ outline: 'none' }}
                                marginTop='10px'
                                fontSize='160%'
                                width='fit-content'
                                borderColor='black'
                                border='solid'
                                borderWidth='2px'
                                onClick={() => hiddenImageInput.current.click()}
                            >
                                Upload Image
                            </Button>
                        </VStack>
                        <Center>
                            <Text
                                marginTop='20px'
                                marginBottom='10px'
                                fontSize='1.6vw'
                            >
                                Options
                            </Text>
                        </Center>
                        <div
                            style={{
                                border: 'solid',
                                borderColor: 'black',
                                borderWidth: '2px',
                                borderRadius: '10px',
                                marginLeft: '8px',
                                marginRight: '8px',
                                textAlign: 'center',
                            }}
                        >
                            <Text marginTop='5px' fontSize='1.4vw'>
                                Quiz Type
                            </Text>
                            <Center marginTop='10px'>
                                <RadioGroup
                                    onChange={(value) => setQuizType(value)}
                                    value={quizType}
                                >
                                    <HStack>
                                        <Radio
                                            fontSize='1.4vw'
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Standard'
                                        >
                                            <Text fontSize='1.2vw'>
                                                Standard
                                            </Text>
                                        </Radio>
                                        <Radio
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Instant'
                                        >
                                            <Text fontSize='1.2vw'>
                                                Instant
                                            </Text>
                                        </Radio>
                                    </HStack>
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
                            <Text marginTop='5px' fontSize='1.4vw'>
                                Question Ordering
                            </Text>
                            <Center marginTop='10px'>
                                <RadioGroup
                                    onChange={setQuizOrdering}
                                    value={quizOrdering}
                                >
                                    <HStack>
                                        <Radio
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Ordered'
                                        >
                                            <Text fontSize='1.2vw'>
                                                Ordered
                                            </Text>
                                        </Radio>
                                        <Radio
                                            _focus={{ outline: 'none' }}
                                            value='Shuffled'
                                        >
                                            <Text fontSize='1.2vw'>
                                                Ordered
                                            </Text>
                                        </Radio>
                                    </HStack>
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
                            <RadioGroup onChange={setTimeType} value={timeType}>
                                <div
                                    style={{
                                        marginTop: '5px',
                                        position: 'relative',
                                    }}
                                >
                                    <Text
                                        fontSize='1.4vw'
                                        marginLeft='auto'
                                        marginRight='auto'
                                    >
                                        Quiz Timer
                                    </Text>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            left: '80%',
                                            height: 'fit-content',
                                        }}
                                    >
                                        <Radio
                                            value='Quiz'
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            size='lg'
                                        />
                                    </div>
                                </div>
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
                                            width: '5.1vw',
                                            fontSize: '1.2vw',
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
                                <div
                                    style={{
                                        marginTop: '5px',
                                        position: 'relative',
                                    }}
                                >
                                    <Text
                                        fontSize='1.4vw'
                                        marginLeft='auto'
                                        marginRight='auto'
                                    >
                                        Question Timer
                                    </Text>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            left: '80%',
                                            height: 'fit-content',
                                        }}
                                    >
                                        <Radio
                                            value='Question'
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            size='lg'
                                        />
                                    </div>
                                </div>
                            </RadioGroup>
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
                                        width: '5.1vw',
                                        fontSize: '1.2vw',
                                        textAlign: 'center',
                                    }}
                                />
                            </Center>
                        </div>
                    </Box>
                </div>
            </div>
            <div className='footer'>
                <Button
                    float='right'
                    border='solid'
                    borderColor='white'
                    borderRadius='10px'
                    colorScheme='blue'
                    size='md'
                    fontSize='160%'
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
