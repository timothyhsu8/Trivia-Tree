import { React, useContext } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Heading, Center } from '@chakra-ui/react';

export default function Homepage() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null;
    }

    return (
        <Center marginTop='30px'>
            {user !== 'NoUser' ? (
                <div>
                    <Heading marginBottom='20px'>
                        {'Hello, ' + user.displayName}
                    </Heading>
                    <Center>
                        <img style={{ ce: 'center' }} src={user.iconImage} />
                    </Center>
                    <Center>
                        <Heading marginTop='20px'>
                            <a href={`${config.API_URL}/auth/logout`}>Logout</a>
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
    );
}
