import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react'
import { LuChefHat } from "react-icons/lu";
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { LoginForm } from './components/LoginForm';

const HomePage = () => {

    const navigate = useNavigate(); // Inicializamos el hook de navegación

    // Funciones para redirigir cuando se haga click en un botón
    const handleUserClick = () => {
        navigate('/app'); // Redirige a la página /user
    };

    const handleAdminClick = () => {
        navigate('/admin'); // Redirige a la página /admin
    };

    return (
        <>
            <Flex direction={'column'} justifyContent="center" alignItems="center" h="100vh">

                <LuChefHat size="100px" />
                <Text fontSize="5xl" ml={4}>Welcome to Food<Text as="span" fontWeight="bold">API</Text></Text>

                <LoginForm />

                {/* <HStack spacing={4} mt={4}>
                    <Button colorScheme="teal" size="lg" mt={4} onClick={handleUserClick}>User</Button>
                    <Button colorScheme="teal" size="lg" mt={4} onClick={handleAdminClick}>Admin</Button>
                </HStack> */}


            </Flex>
        </>
    )
}

export default HomePage