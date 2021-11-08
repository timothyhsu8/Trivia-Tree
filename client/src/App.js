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
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './context/auth';
import Quizzes from './pages/Quizzes';
import Quiz from './pages/Quiz';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import CreateQuizPage from './pages/CreateQuizPage';
import CategoryPage from './pages/CategoryPage';
import ShoppingPage from './pages/ShoppingPage';
import Navbar from './components/Navbar';
import PlatformPage from './pages/PlatformPage';
import EditQuizPage from './pages/EditQuizPage';

function App() {
    return (
        <ChakraProvider>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Switch>
                        <Route exact path='/' component={Homepage} />
                        <Route exact path='/quizzes' component={Quizzes} />
                        <Route exact path='/quiz/:quizId' component={Quiz} />
                        <Route
                            exact
                            path='/createQuiz'
                            component={CreateQuizPage}
                        />
                        <Route
                            exact
                            path='/editQuiz/:quizId'
                            component={EditQuizPage}
                        />
                        <Route
                            path='/quiztakingpage/:quizId'
                            component={QuizTakingPage}
                        />
                        <Route path='/settingspage' component={SettingsPage} />
                        <Route path='/categorypage' component={CategoryPage} />
                        <Route path='/accountpage' component={AccountPage} />
                        <Route path='/platformpage/:platformId' component={PlatformPage} />
                        <Route
                            path='/postquizpage/:quizId/:quizAttemptId'
                            component={PostQuizPage}
                        />
                        <Route
                            path='/prequizpage/:quizId'
                            component={PreQuizPage}
                        />
                        \
                        <Route
                            path='/searchresultspage'
                            component={SearchResultsPage}
                        />
                        <Route path='/loginpage' component={LoginPage}></Route>
                        <Route
                            path='/shoppingpage'
                            component={ShoppingPage}
                        ></Route>
                    </Switch>
                </Router>
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;
