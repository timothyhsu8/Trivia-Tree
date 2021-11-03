import { Box, Grid, Text, Image, Center, Button, GridItem } from '@chakra-ui/react';
import treeicon from '../images/triviatree_icon.png'
import { config } from '../util/constants';

export default function ShoppingPage() {
    return (
        <Box>
            <Grid h="845px" templateRows="repeat(10, 1fr)" px="20px" py="20px" bgColor="white" paddingTop="10px">

                {/*Shop Banner*/}
                <GridItem rowSpan={2} border="1px">

                </GridItem>

                {/*Navigate Between Categories*/}
                <GridItem rowSpan={1} border="1px">

                </GridItem>

                {/*Main Body*/}
                <GridItem rowSpan={6} border="1px">
                </GridItem>

                {/*Page Number*/}
                <GridItem rowSpan={1} border="1px">
                </GridItem>
            </Grid>
        </Box>
    )
}