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

function App() {
    return (
        <ChakraProvider>
            <AuthProvider>
                <Router>
                    <Switch>
                        <Route exact path='/' component={Homepage} />
                        <Route
                            path='/quiztakingpage'
                            component={QuizTakingPage}
                        />
                        <Route path='/accountpage' component={AccountPage} />
                        <Route path='/postquizpage' component={PostQuizPage} />
                        <Route path='/prequizpage' component={PreQuizPage} />
                    </Switch>
                </Router>
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;
