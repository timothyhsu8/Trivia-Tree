import { React, useContext } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Heading, Center, VStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Homepage() {
    const { user } = useContext(AuthContext);

    let pfp_src =
        'https://yt3.ggpht.com/ytc/AKedOLQ2xNBI8aO1I9etug8WnhQ-WPhnVEyNgj6cFVPfNw=s900-c-k-c0x00ffffff-no-rj';

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
                    <Link style={{ fontSize: '25px' }} to='/postquizpage'>
                        Post Quiz Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/prequizpage'>
                        Pre Quiz Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/loginpage'>
                        Login Page
                    </Link>
                    <Link to='/prequizpage'>
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
