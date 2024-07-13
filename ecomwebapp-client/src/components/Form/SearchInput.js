import React, { useState } from "react";
import { useSearch } from '../context/search'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true)
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`
            );
            setSpinnerLoading(false)
            setValues({ ...values, results: data });
            navigate("/search");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button className="btn btn-outline-success" type="submit">
                    {spinnerLoading?<Spinner/>:"Search"}
                </button>
            </form>
        </div>
    );
};

export default SearchInput;