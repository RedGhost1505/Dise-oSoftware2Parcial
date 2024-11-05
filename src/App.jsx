import {
  Button, Box, Flex, Text, Tooltip, Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { GrRestaurant } from "react-icons/gr";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { obtainMenu } from './services/apiLogic';
import { uploadOrderToFirestore } from './services/apiLogic';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado para el drawer
  const toast = useToast();

  // const obtainMenu = async () => {
  //   try {
  //     const response = await axios.get('https://api-menu-9b5g.onrender.com/menu');
  //     setMenuItems(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  obtainMenu().then((data) => {
    setMenuItems(data);
  });

  const handleItemClick = (item) => {
    const existingItem = selectedItems.find(selectedItem => selectedItem.id === item.id);
    if (existingItem) {
      const updatedItems = selectedItems.map(selectedItem =>
        selectedItem.id === item.id ? { ...selectedItem, price: selectedItem.price + item.price } : selectedItem
      );
      setSelectedItems(updatedItems);
      toast({
        title: "Item added",
        description: `The item ${item.name} has been added to your order`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setSelectedItems([...selectedItems, item]);
      toast({
        title: "Item added",
        description: `The item ${item.name} has been added to your order`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    obtainMenu();
  }, []);

  const total = selectedItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item before checking out",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    } else {
      try {
        // Crear un arreglo con el formato adecuado para subir a Firestore
        const items = selectedItems.map(item => ({
          name: item.name,
          price: item.price
        }));

        // Subir la orden a Firestore
        const orderId = await uploadOrderToFirestore(items, total);
        console.log('Orden subida correctamente con ID:', orderId);

        toast({
          title: "Order Confirmed",
          description: `Your order has been placed successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

      } catch (error) {
        console.error('Error al subir la orden a Firestore:', error);

        toast({
          title: "Error",
          description: "There was an issue placing your order. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

      } finally {
        // Mostrar el drawer
        setIsDrawerOpen(true);
      }
    }
  };


  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  return (
    <>
      <Flex direction="column" minH="100vh" px="40px" minW="100vw" bg="gray.200">
        <Flex direction="row" pt="20px" justify="space-between">
          <GrRestaurant size="70px" />
          <Box fontSize="4xl" fontWeight="bold">FoodAPI</Box>
        </Flex>
        <Flex mt="40px" direction="column" minW="100%" flex="1" mb="20px" borderRadius="10px">
          {/* Contenedor con flex row que ocupa todo el espacio */}
          <Flex direction="row" gap="4" flex="1" borderRadius="10px">
            {/* Primer Flex - azul */}
            <Flex flex="1" borderRadius="inherit" direction="column">
              <Text fontWeight="bold" fontSize="2xl" pl="20px" pt="20px">
                Our Menu 👀
              </Text>
              <Flex mt="20px" gap="10px" flexWrap="wrap" justify="space-between" pl="20px" pr="20px">
                {menuItems.map((item) => (
                  <Tooltip key={item.id} label={item.description} aria-label='A tooltip'>
                    <Button
                      borderRadius="10px"
                      _hover={{ bg: "green.400" }}
                      bg="white"
                      p="10px"
                      width="auto"
                      size="lg"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.name}
                    </Button>
                  </Tooltip>
                ))}
              </Flex>
            </Flex>

            {/* Segundo Flex - resumen */}
            <Flex bg="white" flex="1" direction="column" borderRadius="inherit" maxW="400px">
              <Text fontWeight="bold" fontSize="2xl" pl="20px" pt="20px">
                Your summary
              </Text>
              <Flex mt="20px" direction="column" pl="20px" pr="20px">
                {/* Mostrar ítems seleccionados */}
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => (
                    <Text key={index} fontSize="lg" onClick={() => handleRemoveItem(item.id)} cursor="pointer">{item.name} - ${item.price.toFixed(2)}</Text>
                  ))
                ) : (
                  <Text fontSize="lg">No items selected</Text>
                )}
                <Flex mt="auto" direction="column">
                  <Text fontSize="lg" fontWeight="bold" mt="4">Total: ${total}</Text>
                  <Button mt="20px" colorScheme="green" size="lg" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* Drawer para mostrar la confirmación de orden */}
        <Drawer isOpen={isDrawerOpen} placement="bottom" onClose={() => setIsDrawerOpen(false)}>
          <DrawerOverlay />
          <DrawerContent
            maxW="300px" // Limitar el ancho máximo a 300px
            mx="auto" // Centrar horizontalmente
            borderRadius="10px" // Bordes redondeados
          >
            <DrawerCloseButton />
            <DrawerHeader>
              <Flex align="center" justify="center">
                <Icon as={FaCheckCircle} w={8} h={8} color="green.500" mr={2} />
                <Text fontWeight="bold" fontSize="lg">Order Confirmed</Text>
              </Flex>
            </DrawerHeader>

            <DrawerBody textAlign="center">
              <Text fontSize="md">Your order has been placed successfully!</Text>
              <Text mt={4} fontSize="md">Thank you for your order!</Text>
              <Text mt={4} fontWeight="bold" fontSize="lg">Total: ${total}</Text>
            </DrawerBody>

            <DrawerFooter justifyContent="center">
              <Button colorScheme="blue" onClick={() => setIsDrawerOpen(false)}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex >
    </>
  );
}

export default App;
