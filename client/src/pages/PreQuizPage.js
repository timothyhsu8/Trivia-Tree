import { Box, Center, Text, Grid, VStack, Button, Image } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import * as queries from '../cache/queries';

export default function QuizTakingPage( {} ) {

	let quiz = null;
	const {data, loading, error} = useQuery(queries.GET_QUIZ, { variables: {quizId:"616be915d990fe64da8f392e"} });

	if(loading){
		return <div></div>;
	}
	if(data){
		quiz = data.getQuiz;
	}
	if(error){
		console.log(error);
	}
	
    return (
		<Box>{quiz.title}</Box>
	)
}