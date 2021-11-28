import { React, useState, useEffect, createRef, useContext } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
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
import { AuthContext } from '../context/auth';
import { v4 as uuidv4 } from 'uuid';
import '../styles/CreateQuizPage.css';
import QuestionCreatorCard from '../components/QuestionCreatorCard';

let img = null;
let refs = null;
let hiddenImageInput = null;

function EditQuizPage(props) {
    const quizId = props.match.params.quizId;
    const { user } = useContext(AuthContext);

    const [setup, setSetUp] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([
        {
            question: '',
            answerChoices: [
                { choice: '', id: uuidv4(), answer: false },
                { choice: '', id: uuidv4(), answer: false },
            ],
            answer: [], //this will be populated at submission
            id: uuidv4(),
        },
    ]);
    const [icon, setIcon] = useState('');
    const [quizType, setQuizType] = useState('Standard');
    const [quizOrdering, setQuizOrdering] = useState('Ordered');
    const [timeType, setTimeType] = useState('Quiz');
    const [quizTimer, setQuizTimer] = useState('10:00:00');
    const [questionTimer, setQuestionTimer] = useState('00:00:00');

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
                id: uuidv4(),
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
                    let tempQuestion = {
                        ...quizQuestion,
                        questionType: value,
                    };
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

    const [updateQuiz] = useMutation(UPDATE_QUIZ, {
        context: {
            headers: {
                imagetype: img,
            },
        },
        onCompleted() {
            props.history.push('/');
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    function handleUpdateQuiz() {
        let modifiedQuizQuestions = quizQuestions.map((question) => {
            return { ...question };
        });
        modifiedQuizQuestions.forEach((question) => {
            // question.question = question.question.trim();
            // question.answerChoices.forEach((choice, index) => {
            //     question.answerChoices[index] = choice..trim();
            // });
            delete question.id;
            delete question.__typename;
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
        updateQuiz({
            variables: {
                quizInput: {
                    quizId: quizId,
                    title: title.trim(),
                    questions: modifiedQuizQuestions,
                    description: description.trim(),
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

    const {
        loading,
        error,
        data: { getQuiz: quiz } = {},
    } = useQuery(FETCH_QUIZ_QUERY, {
        skip: !user,
        fetchPolicy: 'network-only',
        variables: {
            quizId,
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
            props.history.push('/');
        },
        onCompleted({ getQuiz: quiz }) {
            if (user === 'NoUser' || user._id !== quiz.user._id) {
                props.history.push('/');
            }
            refs = {};
            img = 'Same Image';
            hiddenImageInput = createRef(null);
            setTitle(quiz.title);
            setDescription(quiz.description);
            let modifiedQuizQuestions = quiz.questions.map((question) => {
                return JSON.parse(JSON.stringify(question));
            });
            modifiedQuizQuestions.forEach((question) => {
                let tempId = uuidv4();
                question.id = tempId;
                refs[tempId] = createRef();
                question.answerChoices = question.answerChoices.map(
                    (choice) => {
                        tempId = uuidv4();
                        return {
                            choice: choice,
                            id: tempId,
                            answer: question.answer.includes(choice),
                        };
                    }
                );
                question.answer = [];
            });
            console.log(modifiedQuizQuestions);
            setQuizQuestions(modifiedQuizQuestions);
            setIcon(quiz.icon);
            setQuizType(quiz.quizInstant ? 'Instant' : 'Standard');
            setQuizOrdering(quiz.quizShuffled ? 'Shuffled' : 'Ordered');
            setTimeType(quiz.isTimerForQuiz ? 'Quiz' : 'Question');
            setQuizTimer(quiz.quizTimer);
            setQuestionTimer(quiz.questionTimer);
            setSetUp(true);
        },
    });

    if (user === null) {
        return <div></div>;
    }

    if (!setup) {
        return <div></div>;
    }

    if (error) {
        return <div></div>;
    }

    if (loading) {
        return <div></div>;
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
                    onClick={() => handleUpdateQuiz()}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

const FETCH_QUIZ_QUERY = gql`
    query ($quizId: ID!) {
        getQuiz(quizId: $quizId) {
            _id
            title
            description
            user {
                _id
            }
            icon
            quizInstant
            quizShuffled
            isTimerForQuiz
            quizTimer
            questionTimer
            questions {
                question
                answer
                answerChoices
                questionType
            }
        }
    }
`;

const UPDATE_QUIZ = gql`
    mutation ($quizInput: QuizInput!) {
        updateQuiz(quizInput: $quizInput) {
            title
            _id
        }
    }
`;

export default EditQuizPage;
