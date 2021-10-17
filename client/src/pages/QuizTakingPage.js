import { Box, Center, Text, Grid, VStack, Button } from "@chakra-ui/react"

export default function QuizTakingPage( {} ) {
	let question = "1. What is the song that plays at Whomp's Fortress?"
    let choices = ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]

    return (
		<Box>
			<Grid templateColumns="1fr 6fr"> 
				{/* SIDEBAR */}
				<Box h="100vh" bgColor="gray.200" ></Box>

				{/* MAIN PAGE */}
				<Box>
					{/* QUESTION */}
					<Text fontSize="50">
						<Center>
							{question}
						</Center>
					</Text>

					{/* ANSWER CHOICES */}
					<VStack>
						{choices.map((item, index)=>{
							return (
							<Button w="40%" h="10vh" bgColor="gray.600" fontSize="24" textColor="white"> 
								{choices[index]} 
							</Button>
							)
						})}
					</VStack>
					
					<Center>
						<Button w="20%" bgColor="purple.800" textColor="white">
							Next Question
						</Button>
					</Center>
				</Box>
			</Grid>
		</Box>
	)
}