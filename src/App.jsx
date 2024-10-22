import { Button, Box, Flex, Text, Tooltip, useToast } from '@chakra-ui/react';
import { GrRestaurant } from "react-icons/gr";
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const obtainMenu = async () => {
    try {
      const response = await axios.get('https://api-menu-9b5g.onrender.com/menu');
      console.log(response.data);
      setMenuItems(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleItemClick = (item) => {
    // Comprobar si el ítem ya está seleccionado
    const existingItem = selectedItems.find(selectedItem => selectedItem.id === item.id);
    if (existingItem) {
      // Si el ítem ya existe, solo sumamos su precio
      const updatedItems = selectedItems.map(selectedItem =>
        selectedItem.id === item.id ? { ...selectedItem, price: selectedItem.price + item.price } : selectedItem
      );
      setSelectedItems(updatedItems);
    } else {
      // Si el ítem no existe, lo agregamos al array
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    obtainMenu();
  }, []);

  const total = selectedItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  return (
    <>
      <Flex direction="column" minH="100vh" px="40px" minW="100vw" bg="gray.200">
        <Flex driection="row" pt="20px" justify="space-between">
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
                      key={item.id}
                      borderRadius="10px"
                      _hover={{ bg: "green.400" }}
                      bg="white"
                      p="10px"
                      width="auto"  // Hace que cada botón ocupe el 100% del ancho
                      size="lg"  // Tamaño pequeño
                      onClick={() => handleItemClick(item)}  // Agrega el item al array de items seleccionados
                    >
                      {item.name}
                    </Button>
                  </Tooltip>
                ))}
              </Flex>
            </Flex>

            {/* Segundo Flex - rojo */}
            <Flex bg="white" flex="1" direction="column" borderRadius="inherit" maxW="400px">
              <Text fontWeight="bold" fontSize="2xl" pl="20px" pt="20px">
                Your summary
              </Text>
              <Flex mt="20px" direction="column" pl="20px" pr="20px">
                {/* Mostrar ítems seleccionados */}
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => (
                    <Text key={index} fontSize="lg">{item.name} - ${item.price.toFixed(2)}</Text>
                  ))
                ) : (
                  <Text fontSize="lg">No items selected</Text>
                )}
                <Flex mt="auto" direction="column">
                  <Text fontSize="lg" fontWeight="bold" mt="4">Total: ${total}</Text>
                  <Button mt="20px" colorScheme="green" size="lg">
                    Checkout
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex >
    </>
  )
}

export default App
