import { Box, Text, Image, VStack, Tooltip, HStack, Icon, Grid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

export default function ChooseCategoryCard( props ) {

    let category = props.category;
    
    return (
        <VStack padding="10px" position="relative" top="30px" paddingBottom="0px" 
        textColor={ props.categoriesSelected.includes(category.name) ? "blue.300":""} onClick={(e) => props.handleCategorySelected(e)}
        >
            <Image value={category.name} alt={category.name} h="65px" w="65px" src={category.icon} borderRadius={5} padding="7px" _hover={{bgColor:"blue.100", borderRadius:5, cursor:"pointer"}}/>  
            <Text alt={category.name} fontSize="sm">{category.name}</Text>
        </VStack> 
    )
}