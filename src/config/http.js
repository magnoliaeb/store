import axios from 'axios'

const http = axios.create({
    baseURL: 'https://api-store.herokuapp.com/api',
    // baseURL: 'http://localhost:4000/api',
})

export default http