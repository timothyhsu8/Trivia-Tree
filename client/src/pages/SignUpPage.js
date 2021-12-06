import { Box, Grid, Text, Image, Center, Button, VStack, Input, HStack, Avatar} from '@chakra-ui/react';
import { React, useContext, useState, useEffect, createRef} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useQuery, useMutation } from '@apollo/client';
import * as queries from '../cache/queries';
import * as mutations from '../cache/mutations';
import categories from '../util/categories'
import ChooseCategoryCard from '../components/ChooseCategoryCard';

export default function SignUpPage({}) {
    let history = useHistory();

    const { user, refreshUserData} = useContext(AuthContext);

    const [section, setSection] = useState(1)
    const [displayName, setDisplayName] = useState('');
    const [iconImage, setIconImage] = useState("");
    const [categoriesSelected, setCategoriesSelected] = useState([]);
    const [pulledData, setPulledData] = useState(false);

    let profileImg = 'Same Image';

    const hiddenImageInput = createRef(null);

    const handleDisplayNameChange = (event) => setDisplayName(event.target.value);

    const [finishSignUp] = useMutation(mutations.FINISH_SIGNUP, {
        context:{
            headers: {
                profileimagetype: profileImg
            }
        },
        onCompleted() {
            refreshUserData();
            // history.go(0)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    });

    if(user == null){
        return <Box></Box>;
    }
    else if(!pulledData){
        setDisplayName(user.displayName)
        setIconImage(user.iconImage)
        setPulledData(true)
    }

    function updateIcon(event) {
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.split('/')[0] === 'image'
        ) {
            let tempImg = event.target.files[0];
            let fr = new FileReader();
            fr.readAsDataURL(tempImg);
            fr.onload = () => {
                tempImg = fr.result;
                profileImg = 'New Image';
                setIconImage(tempImg);
            };
        }
    }

    function handleCategorySelected(event){
        console.log(event.target)
        let category = event.target.alt;
        let newCategories = JSON.parse(JSON.stringify(categoriesSelected));
        let removeCategory = false;

        for(let i = 0; i < newCategories.length; i++){
            if(category == newCategories[i]){
                newCategories.splice(i,1);
                removeCategory = true;
                break;
            }
        }

        if(removeCategory == false){
            newCategories.push(category);
        }

        setCategoriesSelected(newCategories);
    }

    async function handleFinishSignup(){
        const { data } = await finishSignUp({ variables: {signUpInput:{userId:user._id, displayName:displayName, iconImage:iconImage, categoriesSelected:categoriesSelected}}});
        history.push('/');
    }
    
    

    return (
        <Box position="relative" top="90px">
            {section == 1 ?
            <VStack>
                <Center borderBottom="1px" fontSize="5xl">Choose A Display Name</Center>
                <Center fontSize="xl">(Display names can be changed later in the settings)</Center>
                <Center position="relative" top="40px">
                    <Box borderRadius="10px" bgColor="#E3E3E3" w="600px" h="180px">
                    <Center><Input value={displayName} onChange={handleDisplayNameChange} marginTop="65px" variant='filled' placeholder='Choose a display name...' w="80%"
                        _hover={{pointer:"cursor", bgColor:"gray.200"}}
                        _focus={{bgColor:"white", border:"1px", borderColor:"blue.400"}}/></Center>
                    </Box>
                </Center>
                <HStack spacing="40px">
                    <Button position="relative" top="80px" w="140px" colorScheme='blue' size="lg" onClick={() => {setSection(2)}}>
                        Next
                    </Button>
                </HStack>
            </VStack>
            : ""}

            {section == 2 ? 
            <VStack>
                <Center borderBottom="1px" fontSize="5xl">Choose An Icon Image</Center>
                <Center fontSize="xl">(Icon images can be changed later in the settings)</Center>
                <HStack spacing={10} position="relative" top="40px">
                            <Button
                                variant="outline"
                                _focus={{ outline: 'none' }}
                                width='fit-content'
                                borderColor="gray.300"
                                onClick={() => hiddenImageInput.current.click()}
                            >
                                Upload Image
                            </Button>
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={hiddenImageInput}
                                onChange={(event) => updateIcon(event)}
                            />
                            <Avatar maxW="100px" maxH="100px" w="auto" h="auto" borderRadius={5} src={iconImage} />
                        </HStack>
                <HStack spacing="40px">
                    <Button position="relative" top="80px" w="140px" colorScheme='blue' size="lg" onClick={() => {setSection(1)}}>
                        Previous
                    </Button>
                    <Button position="relative" top="80px" w="140px" colorScheme='blue' size="lg" onClick={() => {setSection(3)}}>
                        Next
                    </Button>
                </HStack>
            </VStack>
            : ""}

            {section == 3 ? 
            <VStack>
                <Center borderBottom="1px" fontSize="5xl">Select Categories That Interest You</Center>
                <Center fontSize="xl">(These will be used to recommend quizzes for you to take)</Center>
                <Center>
                    {categories.map((category, key) => {
                        return (
                            <ChooseCategoryCard category={category} handleCategorySelected={handleCategorySelected} categoriesSelected={categoriesSelected} key={key}/>
                        )
                    })}
                </Center>
                <HStack spacing="40px" position="relative" bottom="20px">
                    <Button position="relative" top="80px" w="140px" colorScheme='blue' size="lg" onClick={() => {setSection(2)}}>
                        Previous
                    </Button>
                    <Button position="relative" top="80px" w="140px" colorScheme='blue' size="lg" onClick={handleFinishSignup}>
                        Finish
                    </Button>
                </HStack>
            </VStack>
            : ""}
        </Box>
    )
}