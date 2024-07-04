import axios from 'axios';
import { useEffect, useState } from "react";


export default function useCatagory() {
    const [catagories, setCatagories] = useState([]);
    const [loading, setLoading] = useState(true);

    //get catagory
    const getCatagories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/catagory/get-catagory`);
            setCatagories(data?.catagory)
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCatagories();
    }, [])

    return { catagories, loading };
}