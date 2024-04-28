import axios from 'axios';
import { useEffect, useState } from "react";


export default function useCatagory() {
    const [catagories, setCatagories] = useState([]);

    //get catagory
    const getCatagories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/catagory/get-catagory`);
            setCatagories(data?.catagory)
        } catch (error) {
            console.log(error);
        }
    } 
    useEffect(() => {
        getCatagories();
    }, [])

    return catagories;
}