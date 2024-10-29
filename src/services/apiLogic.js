import axios from 'axios';

export const obtainMenu = async () => {
    try {
        const response = await axios.get('https://api-menu-9b5g.onrender.com/menu');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};