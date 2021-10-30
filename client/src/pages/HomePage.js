import { React, useContext } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Heading, Center, VStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import quizImage from '../images/defaultquiz.jpeg';

export default function Homepage() {
    const { user } = useContext(AuthContext);

    let pfp_src =
        quizImage;

    if (!user) {
        return null;
    }

    return (
        <Box>
            <Center marginTop='30px'>
                {user !== 'NoUser' ? (
                    <div>
                        <Heading marginBottom='20px'>
                            {'Hello, ' + user.displayName}
                        </Heading>
                        <Center>
                            <img
                                style={{ ce: 'center' }}
                                src={user.iconImage}
                            />
                        </Center>
                        <Center>
                            <Heading marginTop='20px'>
                                <a href={`${config.API_URL}/auth/logout`}>
                                    Logout
                                </a>
                            </Heading>
                        </Center>
                    </div>
                ) : (
                    <Heading>
                        <a href={`${config.API_URL}/auth/google`}>
                            Login with Google
                        </a>
                    </Heading>
                )}
            </Center>
            <div>
                <VStack marginTop='50px'>
                    <Link style={{ fontSize: '25px' }} to='/quizzes'>
                        Quizzes with CRUD
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/createQuiz'>
                        Create Quiz Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/quiztakingpage'>
                        Quiz Taking Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/accountpage'>
                        Account Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/categoryPage'>
                        Category Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/postquizpage'>
                        Post Quiz Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/prequizpage'>
                        Pre Quiz Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/loginpage'>
                        Login Page
                    </Link>
                    <Link to='/prequizpage/617a191e44a08bd08c08d405'>
                        <Image
                            marginTop='30px'
                            width={['100px', '100px', '100px', '200px']}
                            height={['100px', '100px', '100px', '200px']}
                            src={pfp_src}
                            objectFit='cover'
                            borderRadius='10%'
                        ></Image>
                    </Link>
                </VStack>
            </div>
        </Box>
    );
}
