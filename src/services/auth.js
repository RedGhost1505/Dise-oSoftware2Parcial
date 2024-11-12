import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';

const auth = getAuth();

// Función para crear un usuario con Firebase Authentication
const createUser = async (email, password, name) => {
    try {
        // Crear el usuario con correo y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Obtener el usuario creado
        const user = userCredential.user;

        // Guardar datos adicionales del usuario en Firestore usando el UID como ID del documento
        await setDoc(doc(db, 'Users', user.uid), {
            role: 'user',
            email: email,
            name: name,
            created: new Date(),
        });

        console.log('Usuario creado correctamente:', user.uid);
        return user;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};


//Login user
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'Users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData);
        } else {
            console.log("No such document!");
        }
        return { user: userCredential.user, error: null, userData: userDoc.data() };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

//Logout user
const logoutUser = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
}

export { createUser, loginUser, logoutUser };