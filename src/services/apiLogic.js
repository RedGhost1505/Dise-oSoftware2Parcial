import axios from 'axios';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta


export const obtainMenu = async () => {
    try {
        const response = await axios.get('https://api-menu-9b5g.onrender.com/menu');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Get all orders from Firestore
export const getOrdersFromFirestore = async () => {
    try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection); // Cambia .get() a getDocs()
        const ordersList = ordersSnapshot.docs.map(doc => doc.data());
        return ordersList;
    } catch (error) {
        console.error('Error al obtener las órdenes de Firestore:', error);
        throw error;
    }
};

// Función para subir una orden a Firestore con name y price
export const uploadOrderToFirestore = async (items, total) => {
    try {
        // Validar que los parámetros estén presentes
        if (!items || items.length === 0 || !total) {
            throw new Error('El arreglo de items y el total son requeridos.');
        }

        // Subir la orden a Firestore
        const docRef = await addDoc(collection(db, 'orders'), {
            items: items,
            total: total,
            date: new Date(),
        });

        console.log('Orden subida correctamente con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error al subir la orden a Firestore:', error);
        throw error;
    }
};
