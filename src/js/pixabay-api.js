
import axios from "axios";

// const newInstance = axious.create({
//     // configuration
//     baseURL: 'https://pixabay.com/api/',
// })
axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common["key"] = "40320013-0b58b3814b292a6d5e83f5f83";


async function getImages(searchQuery, page) {
    const API_KEY = "40320013-0b58b3814b292a6d5e83f5f83"
    const params = new URLSearchParams({
        key: API_KEY,   
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        q: searchQuery,
        per_page: 40,
        page,
        
})
    return await axios.get(`?${params}`)
        .then (response => {
    if (response.status !== 200) {
        throw new Error (response.statusText);}
    return response;
})
}

// getImages("cat", 1)
// .then((data) => {
//     console.log(data)});

export {getImages};




















