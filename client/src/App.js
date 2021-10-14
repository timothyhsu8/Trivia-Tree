import React from 'react';
import { useQuery } from '@apollo/client';
import * as queries from './cache/queries';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
    Router,
} from 'react-router-dom';

function App() {
    const {
        loading,
        error,
        data: { getQuizzes: quizzes } = {},
    } = useQuery(queries.FETCH_QUIZ_QUERY);

    if (loading) {
        return 'Loading';
    }

    if (error) {
        return `Error! ${error}`;
    }

    console.log(quizzes);
    return <div>Welcome to Trivia Tree</div>;
}

export default App;
