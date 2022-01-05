import axios from 'axios';

export const apiData = axios.create({
    baseURL: 'http://localhost:3000/api'
})