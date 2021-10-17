import React from 'react';
import { useQuery } from '@apollo/client';
import * as queries from './cache/queries';
import { ChakraProvider } from "@chakra-ui/react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import Homepage from './pages/HomePage';
import QuizTakingPage from './pages/QuizTakingPage';

function App() {
    const {
        loading,
        error,
        data: { getQuizzes: quizzes } = {},
    } = useQuery(queries.FETCH_QUIZ_QUERY);

    if (loading) {
        return 'Loading';
    }
    
    // if (error) {
    //     return `Error! ${error}`;
    // }

    console.log(quizzes);
    return (
        <ChakraProvider>
            <Router>
                <Switch>
                    <Route exact path='/' component={Homepage}/>
                    <Route path='/quiztakingpage' component={QuizTakingPage}/>
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
