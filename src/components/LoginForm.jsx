import React, { useState } from 'react';
import { loginUser } from '../services/auth';
import { createUser } from '../services/auth';
import { Flex, Text, Input, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);

    const handleSignUp = () => {
        setIsSignUp(!isSignUp);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            try {
                const user = await createUser(email, password, name);
                if (user) {
                    toast({
                        title: "Success",
                        description: "You have successfully created an account",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    setIsSignUp(false); // Cambiar a modo de inicio de sesión después del registro
                }
            } catch (error) {
                setError(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            try {
                const { user, userData } = await loginUser(email, password);
                if (user) {
                    toast({
                        title: "Success",
                        description: "You have successfully logged in",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });

                    // Redirigir según el rol del usuario
                    if (userData.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/app');
                    }
                }
            } catch (error) {
                setError(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Flex direction="column" alignItems="center" w="100%" maxW="400px" mt={4}>

            {isSignUp ? (
                <>
                    <Text fontSize="2xl" mb={4}>Welcome, create your account</Text>
                    <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        mb={4}
                        _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        mb={4}
                        _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        mb={4}
                        _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
                    />
                    <Button
                        onClick={handleSubmit}
                        bg="black" // Fondo negro
                        color="white" // Texto blanco
                        _hover={{ bg: "gray.700" }} // Fondo más oscuro al pasar el mouse
                        w="40%"
                    >
                        Sign-Up
                    </Button>
                    <Text mt={4} cursor="pointer" onClick={handleSignUp}>
                        Already have an account? Sign-In
                    </Text>
                </>
            ) : (
                <>
                    <Text fontSize="2xl" mb={4}>Sign-In</Text>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        mb={4}
                        _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        mb={4}
                        _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
                    />
                    <Button
                        onClick={handleSubmit}
                        bg="black" // Fondo negro
                        color="white" // Texto blanco
                        _hover={{ bg: "gray.700" }} // Fondo más oscuro al pasar el mouse
                        w="40%"
                    >
                        Sign-In
                    </Button>
                    <Text mt={4} cursor="pointer" onClick={handleSignUp}>
                        Don't have an account? Sign-Up
                    </Text>
                </>
            )}






        </Flex>
    );
}