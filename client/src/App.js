import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import Homepage from './pages/HomePage';
import QuizTakingPage from './pages/QuizTakingPage';
import AccountPage from './pages/AccountPage';
import PostQuizPage from './pages/PostQuizPage';
import PreQuizPage from './pages/PreQuizPage';
import { AuthProvider } from './context/auth';
import Quizzes from './pages/Quizzes';
import CreateQuiz from './pages/CreateQuiz';
import Quiz from './pages/Quiz';
import SearchResultsPage from './pages/SearchResultsPage'
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <ChakraProvider>
            <AuthProvider>
                <Router>
                    <Switch>
                        <Route exact path='/' component={Homepage} />
                        <Route exact path='/quizzes' component={Quizzes} />
                        <Route exact path='/quiz/:quizId' component={Quiz} />
                        <Route
                            exact
                            path='/createQuiz'
                            component={CreateQuiz}
                        />
                        <Route
                            path='/quiztakingpage'
                            component={QuizTakingPage}
                        />
                        <Route path='/accountpage' component={AccountPage} />
                        <Route path='/postquizpage/:quizAttemptId' component={PostQuizPage} />
                        <Route path='/prequizpage' component={PreQuizPage} />\
                        <Route path='/searchresultspage' component={SearchResultsPage} />
                        <Route path='/loginpage' component={LoginPage}></Route>
                    </Switch>
                </Router>
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;
