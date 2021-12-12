import { React, useState, useRef, createRef, useContext } from 'react';
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
    Stack,
    Icon,
    Spinner,
    AlertDialog, 
    AlertDialogOverlay, 
    AlertDialogContent,
    AlertDialogBody, 
    AlertDialogFooter,
    AlertDialogHeader
} from '@chakra-ui/react';
import TimeField from 'react-simple-timefield';
import { AuthContext } from '../context/auth';
import { v4 as uuidv4 } from 'uuid';
import '../styles/CreateQuizPage.css';
import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
import QuestionCreatorCard from '../components/QuestionCreatorCard';
import { BsFillFileEarmarkTextFill, BsFillImageFill } from 'react-icons/bs';

let img = null;
let refs = null;
let hiddenImageInput = null;

function EditQuizPage(props) {
    const cancelRef = useRef()
    const quizId = props.match.params.quizId;
    const { user } = useContext(AuthContext);

    const [setup, setSetUp] = useState(false);
    const [showQuizUpdated, setShowQuizUpdated] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other');
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
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingButton, setLoadingButton] = useState(false);

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
                    { choice: '', id: uuidv4(), amswer: false },
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
            setLoadingButton(false)
            setErrorMessage(null)
            setShowQuizUpdated(true)
        },
        onError(err) {
            setLoadingButton(false)
            let errors = err.graphQLErrors[0].extensions;
            let errorKeys = Object.keys(errors);
            let errorStrings = []
            for (let i = 0; i < errorKeys.length; i++) {
                if (errorKeys[i] !== 'code' && errorKeys[i] !== 'exception') {
                    errorStrings.push(errors[errorKeys[i]])
                }
            }
            setErrorMessage(errorStrings);
            console.log(JSON.stringify(err, null, 2));
        },
    });

    function handleUpdateQuiz() {
        setLoadingButton(true)
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
            setCategory(quiz.category);
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

    // Show dialogue for 'Item Unffordable' and 'Purchase Successful'
    function renderSuccessfulQuizUpdate() {
        return (
            <Center>
                <AlertDialog
                    isOpen={showQuizUpdated}
                    leastDestructiveRef={cancelRef}
                    onClose={() => {
                        setShowQuizUpdated(false)
                        props.history.goBack()
                    }}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent top="30%">
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Success!
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Quiz Updated Succesfully
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button 
                                    colorScheme="yellow"
                                    ref={cancelRef} 
                                    onClick={() => {
                                        setShowQuizUpdated(false)
                                        props.history.goBack()
                                    }}
                                    _focus={{border:"none"}}
                                >
                                    Close
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Center>
        )
    }

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
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    return (
        <div className='container'>
            <div className='gridContainer'>
                <div className='leftSidebar'>
                    <Box
                        top="70px"
                        h="80vh"
                        position='sticky'
                        overflowY='auto'
                        width='90%'
                        borderRight="1px"
                        borderColor="gray.200"
                    >
                        <Center>
                            <Text marginLeft='10px' fontSize='120%' fontWeight="medium" textColor="gray.600">
                                Jump To Question:
                            </Text>
                        </Center>
                        <Box mt='10px'>
                            {quizQuestions.map((item, index) => (
                                <HStack
                                    key={item.id}
                                    marginLeft='15px'
                                    marginTop={index > 0 ? '20px' : '0px'}
                                >
                                    <Text
                                        paddingRight='15px'
                                        fontSize='100%'
                                        overflowWrap='anywhere'
                                        cursor='pointer'
                                        onClick={() => handleScrollAction(item.id)}
                                    >
                                        <Text fontWeight="medium" textColor="gray.700">
                                            <Icon as={ChevronRightIcon} pos="relative" top="-1.1px" mr="2px"/>
                                             Question #{index + 1} 
                                        </Text>
                                        {item.question.trim().substr(0, 35)}
                                        {item.question.trim().length > 35
                                            ? '...'
                                            : ''}
                                    </Text>
                                </HStack>
                            ))}
                        </Box>
                    </Box>
                </div>
                <div className='title-description'>
                    <Stack spacing="1px">
                        <Input
                            value={title}
                            onChange={(event) => updateTitle(event)}
                            placeholder='Enter A Quiz Title...'
                            variant='flushed'
                            borderColor='gray.400'
                            borderBottomWidth='1px'
                            _hover={{bgColor: 'gray.100'}}
                            _focus={{ borderColor: 'blue.500', bgColor:"gray.100" }}
                            fontSize='140%'
                            height='fit-content'
                            width='80%'
                            overflowWrap="break-word"
                        />
                        <Text fontSize="90%" textColor="gray.600" fontWeight="medium">Quiz Title</Text>
                    </Stack>
                    <Stack spacing="1px">
                        <Textarea
                            value={description}
                            onChange={(event) => updateDescription(event)}
                            placeholder='Enter A Description...'
                            fontSize='100%'
                            height='fit-content'
                            overflow='auto'
                            borderColor='gray.400'
                            borderWidth='1px'
                            _focus={{ borderColor: 'blue.500' }}
                            _hover={{ borderColor: 'blue.500' }}
                            marginTop='30px'
                            width='80%'
                        />
                        <Text fontSize="90%" textColor="gray.600" fontWeight="medium">Quiz Description</Text>
                    </Stack>
                    <HStack mt='20px'>
                        <Text fontSize="100%" fontWeight="medium">
                            Category:
                        </Text>
                        <Select
                            _hover={{ outline: 'none' }}
                            _focus={{ outline: 'none', borderColor: "blue.500" }}
                            borderColor='gray.400'
                            borderWidth='1px'
                            value={category}
                            width='fit-content'
                            display='inline-block'
                            marginLeft='20px'
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
                    <Box w='90%' h="1px" mt='30px' bgColor="gray.400" />
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
                            leftIcon={<AddIcon />}
                            size="lg"
                            colorScheme="pink"
                            _focus={{ outline: 'none' }}
                            marginTop='40px'
                            onClick={() => addQuestion()}
                        >
                            Add Question
                        </Button>
                    </Center>
                </div>

                {/* Right Sidebar */}
                <div className='rightSidebar'>
                    <Box position='sticky' top='70px'>
                        {/* <HStack
                            display='flex'
                            flexDirection='column'
                            direction='row'
                        >
                            <HStack>
                                <Text fontSize='105%' textColor="gray.600" fontWeight="medium"> Platform:</Text>
                                <Select
                                    _hover={{ outline: 'none' }}
                                    _focus={{ outline: 'none' }}
                                    borderColor='gray.300'
                                    borderWidth='1px'
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
                        </HStack> */}

                        {/* Quiz Icon */}
                        <VStack marginTop='20px'>
                            <Text fontSize='110%' textColor="gray.600" fontWeight="medium">Quiz Icon</Text>
                            <img
                                style={{
                                    objectFit: 'cover',
                                    width: '100px',
                                    height: '100px',
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
                                leftIcon={<BsFillImageFill />}
                                variant="outline"
                                borderColor="gray.300"
                                textColor="gray.700"
                                _focus={{ outline: 'none' }}
                                marginTop='10px'
                                onClick={() => hiddenImageInput.current.click()}
                            >
                                Upload Image
                            </Button>
                        </VStack>

                        {/* Options */}
                        <Center>
                            <Text
                                marginTop='20px'
                                marginBottom='4px'
                                fontSize='120%'
                                fontWeight="medium"
                            >
                                Options
                            </Text>
                        </Center>
                        <Box
                            border='1px'
                            borderColor='gray.300'
                            borderRadius='10px'
                            marginLeft='16px'
                            marginRight='16px'
                            textAlign='center'
                        >
                            {/* Quiz Type */}
                            <Text marginTop='5px' fontSize='105%'>
                                Quiz Type
                            </Text>
                            <Center marginTop='10px'>
                                <RadioGroup
                                    onChange={(value) => setQuizType(value)}
                                    value={quizType}
                                >
                                    <HStack spacing={5}>
                                        <Radio
                                            fontSize='100%'
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Standard'
                                        >
                                            <Text fontSize='100%'>
                                                Standard
                                            </Text>
                                        </Radio>
                                        <Radio
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Instant'
                                        >
                                            <Text fontSize='100%'>
                                                Instant
                                            </Text>
                                        </Radio>
                                    </HStack>
                                </RadioGroup>
                            </Center>
                            <Box
                                width= '90%'
                                height="1px"
                                bgColor="gray.300"
                                marginLeft= 'auto'
                                marginRight= 'auto'
                                marginTop= '15px'
                            />

                            {/* Question Ordering */}
                            <Text marginTop='5px' fontSize='105%'>
                                Question Ordering
                            </Text>
                            <Center marginTop='10px'>
                                <RadioGroup
                                    onChange={setQuizOrdering}
                                    value={quizOrdering}
                                >
                                    <HStack spacing={5}>
                                        <Radio
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Ordered'
                                        >
                                            <Text fontSize='100%'>
                                                Ordered
                                            </Text>
                                        </Radio>
                                        <Radio
                                            _focus={{ outline: 'none' }}
                                            colorScheme='gray'
                                            value='Shuffled'
                                        >
                                            <Text fontSize='100%'>
                                                Shuffled
                                            </Text>
                                        </Radio>
                                    </HStack>
                                </RadioGroup>
                            </Center>
                            <Box
                                width= '90%'
                                height="1px"
                                bgColor="gray.300"
                                marginLeft= 'auto'
                                marginRight= 'auto'
                                marginTop= '20px'
                            />

                            {/* Quiz Timer */}
                            <div
                                style={{
                                    marginTop: '5px',
                                    position: 'relative',
                                }}
                            >
                                <Text
                                    fontSize='105%'
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
                                        borderColor: '#cccccc',
                                        borderWidth: '1px',
                                        borderRadius: '10px',
                                        background: 'none',
                                        width: '50%',
                                        fontSize: '130%',
                                        textAlign: 'center',
                                    }}
                                />
                            </Center>
                        </Box>

                        <Center>
                            <VStack w="90%">
                                <Button
                                    isLoading={loadingButton}
                                    leftIcon={<BsFillFileEarmarkTextFill/>}
                                    mt={10}
                                    colorScheme='purple'
                                    size='lg'
                                    _focus={{ outline: 'none' }}
                                    onClick={() => handleUpdateQuiz()}
                                >
                                    Save Changes
                                </Button>
                                {errorMessage ? errorMessage.map((message, index) =>
                                    <Text key={index} textAlign="center" textColor="red.500" fontWeight="medium">
                                        {message}
                                    </Text>
                                ) : null}
                            </VStack>
                        </Center>
                    </Box>
                </div>
            </div>
            { renderSuccessfulQuizUpdate() }
        </div>
    );
}

const FETCH_QUIZ_QUERY = gql`
    query ($quizId: ID!) {
        getQuiz(quizId: $quizId) {
            _id
            title
            description
            category
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
