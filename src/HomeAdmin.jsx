import React, { useState } from 'react';
import { getOrdersFromFirestore } from '../src/services/apiLogic';
import { Flex, Text, Card, CardBody, Box, Grid, GridItem } from '@chakra-ui/react';
import { GrRestaurant } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

const HomeAdmin = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    getOrdersFromFirestore().then((data) => {
        setOrders(data);
        console.log(data);
    });

    const handleMainPageClick = () => {
        navigate('/');
    };


    return (
        <>
            <Flex direction="column" minW="100%" >
                <Flex direction="row" pt="20px" px={10} justify="space-between">
                    <Box onClick={handleMainPageClick} cursor="pointer">
                        <GrRestaurant size="70px" />
                    </Box>
                    <Box fontSize="4xl" fontWeight="bold" >FoodAPI</Box>
                </Flex>
                <Text fontSize="2xl" pl={10} mt={10} fontWeight="bold" mb={4}>Your orders</Text>
                <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} px={10} mt={4} alignItems="center" >
                    {orders.map((order, index) => (
                        <GridItem key={index}>
                            <Card>
                                <CardBody>
                                    <Text fontSize="lg" fontWeight="bold">Total: {order.total}</Text>
                                    {order.items.map((item, itemIndex) => (
                                        <Flex key={itemIndex} direction="column">
                                            <Text fontSize="md">Name: {item.name}</Text>
                                            <Text fontSize="md">Price: {item.price}</Text>
                                        </Flex>
                                    ))}
                                </CardBody>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </Flex>

        </>

    )
}

export default HomeAdmin