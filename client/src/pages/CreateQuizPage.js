import React, { useState, createRef, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
    Input,
    Select,
    Textarea,
    Text,
    Button,
    RadioGroup,
    Radio,
    Center,
    HStack,
    VStack,
    Box,
} from '@chakra-ui/react';
import { RiArrowRightSLine } from 'react-icons/ri';
import TimeField from 'react-simple-timefield';
import { v4 as uuidv4 } from 'uuid';
import '../styles/CreateQuizPage.css';
import QuestionCreatorCard from '../components/QuestionCreatorCard';

let refs = null;
let hiddenImageInput = null;
let img = null;

function CreateQuizPage(props) {
    const [isInitialDone, setInitialDone] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other');
    const [quizQuestions, setQuizQuestions] = useState([
        {
            question: '',
            questionType: 1,
            answerChoices: [
                { choice: '', id: uuidv4(), answer: false },
                { choice: '', id: uuidv4(), amswer: false },
            ],
            answer: [], //this will be populated at submission
            id: uuidv4(),
        },
    ]);
    const [icon, setIcon] = useState(
        'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png'
    );
    const [quizType, setQuizType] = useState('Standard');
    const [quizOrdering, setQuizOrdering] = useState('Ordered');
    const [timeType, setTimeType] = useState('Quiz');
    const [quizTimer, setQuizTimer] = useState('00:05:00');
    const [questionTimer, setQuestionTimer] = useState('00:00:00');

    useEffect(() => {
        refs = {};
        refs[quizQuestions[0].id] = createRef();
        hiddenImageInput = createRef(null);
        img = 'Default Image';
        setInitialDone(true);
    }, []);

    //Have to create a ref for the initial question manually

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

    function updateQuestion(value, questionId) {
        setQuizQuestions((prevQuizQuestions) =>
            prevQuizQuestions.map((quizQuestion) => {
                if (quizQuestion.id === questionId) {
                    return { ...quizQuestion, question: value };
                } else {
                    return quizQuestion;
                }
            })
        );
    }

    function addQuestion() {
        let id = uuidv4();
        refs[id] = createRef();
        setQuizQuestions((prevQuizQuestions) => [
            ...prevQuizQuestions,
            {
                question: '',
                questionType: 1,
                answerChoices: [
                    { choice: '', id: uuidv4(), answer: false },
                    { choice: '', id: uuidv4(), amswer: false },
                ],
                answer: [], //this will be populated at submission
                id: id,
            },
        ]);
    }

    function removeQuestion(questionId) {
        delete refs[questionId];
        setQuizQuestions((prevQuizQuestions) =>
            prevQuizQuestions.filter(
                (quizQuestion) => quizQuestion.id !== questionId
            )
        );
    }

    function updateQuestionType(value, questionId) {
        setQuizQuestions((prevQuizQuestions) =>
            prevQuizQuestions.map((quizQuestion) => {
                if (quizQuestion.id === questionId) {
                    let tempQuestion = { ...quizQuestion, questionType: value };
                    if (value === 1) {
                        let foundAnswer = false;
                        tempQuestion.answerChoices =
                            tempQuestion.answerChoices.map((answerChoice) => {
                                if (answerChoice.answer && !foundAnswer) {
                                    foundAnswer = true;
                                    return answerChoice;
                                } else {
                                    return {
                                        ...answerChoice,
                                        answer: false,
                                    };
                                }
                            });
                    }
                    return tempQuestion;
                } else {
                    return quizQuestion;
                }
            })
        );
    }

    function updateAnswerChoice(value, questionId, choiceId) {
        setQuizQuestions((prevQuizQuestions) =>
            prevQuizQuestions.map((quizQuestion) => {
                if (quizQuestion.id === questionId) {
                    let tempQuestion = { ...quizQuestion };
                    tempQuestion.answerChoices = tempQuestion.answerChoices.map(
                        (answerChoice) => {
                            if (answerChoice.id === choiceId) {
                                if (value.trim() === '') {
                                    return {
                                        ...answerChoice,
                                        choice: value,
                                        answer: false,
                                    };
                                } else {
                                    return { ...answerChoice, choice: value };
                                }
                            } else {
                                return answerChoice;
                            }
                        }
                    );
                    return tempQuestion;
                } else {
                    return quizQuestion;
                }
            })
        );
    }

    function addAnswerChoice(questionId) {
        setQuizQuestions((prevQuizQuestions) =>
            prevQuizQuestions.map((quizQuestion) => {
                if (quizQuestion.id === questionId) {
                    let tempQuestion = { ...quizQuestion };
                    tempQuestion.answerChoices = [
                        ...quizQuestion.answerChoices,
                        { choice: '', id: uuidv4(), answer: false },
                    ];
                    return tempQuestion;
                } else {
                    return quizQuestion;
                }
            })
        );
    }

    function removeAnswerChoice(questionId, choiceId) {
        setQuizQuestions((prevQuizQuestions) =>
            prevQuizQuestions.map((quizQuestion) => {
                if (quizQuestion.id === questionId) {
                    let tempQuestion = { ...quizQuestion };
                    tempQuestion.answerChoices =
                        tempQuestion.answerChoices.filter(
                            (answerChoice) => answerChoice.id !== choiceId
                        );
                    return tempQuestion;
                } else {
                    return quizQuestion;
                }
            })
        );
    }

    function updateAnswer(questionId, choiceId, choice) {
        if (choice.trim() !== '') {
            setQuizQuestions((prevQuizQuestions) =>
                prevQuizQuestions.map((quizQuestion) => {
                    if (quizQuestion.id === questionId) {
                        let tempQuestion = { ...quizQuestion };
                        tempQuestion.answerChoices =
                            tempQuestion.answerChoices.map((answerChoice) => {
                                if (answerChoice.id === choiceId) {
                                    return {
                                        ...answerChoice,
                                        answer: !answerChoice.answer,
                                    };
                                } else {
                                    if (quizQuestion.questionType === 1) {
                                        return {
                                            ...answerChoice,
                                            answer: false,
                                        };
                                    } else if (
                                        quizQuestion.questionType === 2
                                    ) {
                                        return answerChoice;
                                    }
                                }
                            });
                        return tempQuestion;
                    } else {
                        return quizQuestion;
                    }
                })
            );
        }
    }

    function updateIcon(event) {
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.split('/')[0] === 'image'
        ) {
            let tempImg = event.target.files[0];
            let fr = new FileReader();
            fr.readAsDataURL(tempImg);
            fr.onload = () => {
                tempImg = fr.result;
                img = 'New Image';
                setIcon(tempImg);
            };
        }
    }

    const [createQuiz] = useMutation(CREATE_QUIZ, {
        context: {
            headers: {
                imagetype: img,
            },
        },
        onCompleted() {
            props.history.push('/homepage');
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    function handleCreateQuiz() {
        let modifiedQuizQuestions = quizQuestions.map((question) => {
            return { ...question };
        });
        modifiedQuizQuestions.forEach((question) => {
            delete question.id;
            question.answer = question.answerChoices.flatMap((choice) => {
                if (choice.answer) {
                    return choice.choice.trim();
                } else {
                    return [];
                }
            });
            question.answerChoices = question.answerChoices.map((choice) => {
                return choice.choice.trim();
            });
        });
        console.log(modifiedQuizQuestions);
        createQuiz({
            variables: {
                quizInput: {
                    title: title,
                    questions: modifiedQuizQuestions,
                    description: description,
                    category: category,
                    icon: icon,
                    isTimerForQuiz: timeType === 'Quiz' ? true : false,
                    quizTimer: quizTimer,
                    questionTimer: questionTimer,
                    quizShuffled: quizOrdering === 'Shuffled' ? true : false,
                    quizInstant: quizType === 'Instant' ? true : false,
                },
            },
        });
    }

    if (!isInitialDone) {
        return null;
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
                                    {item.question.trim().substr(0, 40)}
                                    {item.question.trim().length > 40
                                        ? '...'
                                        : ''}
                                </Text>
                            </HStack>
                        ))}
                    </Box>
                </div>
                <div className='title-description'>
                    <Input
                        value={title}
                        onChange={(event) => updateTitle(event)}
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
                        value={description}
                        onChange={(event) => updateDescription(event)}
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
                    <HStack>
                        <Text paddingTop='20px' fontSize='24px'>
                            Category:{' '}
                        </Text>
                        <Select
                            _hover={{ outline: 'none' }}
                            _focus={{ outline: 'none' }}
                            borderColor='black'
                            borderWidth='2px'
                            value={category}
                            width='30%'
                            display='inline-block'
                            marginLeft='20px'
                            paddingTop='20px'
                            onChange={(event) => {
                                setCategory(event.target.value);
                            }}
                        >
                            <option value={'Other'}>Other</option>
                            <option value={'Anime'}>Anime</option>
                            <option value={'Art'}>Art</option>
                            <option value={'Books'}>Books</option>
                            <option value={'Food'}>Food</option>
                            <option value={'Geography'}>Geography</option>
                            <option value={'History'}>History</option>
                            <option value={'Languages'}>Languages</option>
                            <option value={'Math'}>Math</option>
                            <option value={'Movies and TV'}>
                                Movies and TV
                            </option>
                            <option value={'Music'}>Music</option>
                            <option value={'Science'}>Science</option>
                            <option value={'Sports'}>Sports</option>
                            <option value={'Stony Brook'}>Stony Brook</option>
                            <option value={'Technology'}>Technology</option>
                            <option value={'Video Games'}>Video Games</option>
                        </Select>
                    </HStack>
                </div>
                <div className='question'>
                    {quizQuestions.map((quizQuestion, questionIndex) => (
                        <QuestionCreatorCard
                            key={quizQuestion.id}
                            quizQuestion={quizQuestion}
                            questionIndex={questionIndex}
                            updateQuestion={updateQuestion}
                            removeQuestion={removeQuestion}
                            updateQuestionType={updateQuestionType}
                            updateAnswerChoice={updateAnswerChoice}
                            addAnswerChoice={addAnswerChoice}
                            removeAnswerChoice={removeAnswerChoice}
                            updateAnswer={updateAnswer}
                            questionRef={refs[quizQuestion.id]}
                        />
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
                                    objectFit: 'cover',
                                    width: '100px',
                                    height: '100px',
                                    border: 'solid',
                                    borderColor: 'black',
                                }}
                                src={icon}
                            />
                            <input
                                type='file'
                                accept='image/*'
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
                                            colorScheme='gray'
                                            value='Shuffled'
                                        >
                                            <Text fontSize='1.2vw'>
                                                Shuffled
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
                                ></div>
                            </div>
                            <Center marginTop='10px' mb='10px'>
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
