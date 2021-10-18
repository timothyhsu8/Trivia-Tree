import React from 'react';
import { ChakraProvider } from "@chakra-ui/react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import Homepage from './pages/HomePage';
import QuizTakingPage from './pages/QuizTakingPage';
import AccountPage from './pages/AccountPage';

function App() {

    return (
        <ChakraProvider>
            <Router>
                <Switch>
                    <Route exact path='/' component={Homepage}/>
                    <Route path='/quiztakingpage' component={QuizTakingPage}/>
                    <Route path='/accountpage' component={AccountPage}/>
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
