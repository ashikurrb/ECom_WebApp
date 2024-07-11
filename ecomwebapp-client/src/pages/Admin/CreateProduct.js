
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();
    const [catagories, setCatagories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [catagory, setCatagory] = useState('');
    const [photo, setPhoto] = useState('');
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [search, setSearch] = useState(false);

    //get call catagory
    const getAllCatagory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/catagory/get-catagory`);
            if (data?.success) {
                setCatagories(data?.catagory)
            }
        } catch (error) {
            console.log(error);
            toast.error('Error getting Catagory')
        }
    }

    useEffect(() => {
        getAllCatagory();

    }, [])

    //create product function
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true)
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("shipping", shipping);
            productData.append("photo", photo);
            productData.append("catagory", catagory);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, productData);
            setSpinnerLoading(true);
            if (data?.success) {
                setSpinnerLoading(false)
                toast.success(data?.message);
                navigate("/dashboard/admin/products");
            } else {
                toast.success("Product Created Successfully");
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setSpinnerLoading(false)
        }
    }

    return (
        <Layout title={"Dashboard - Create Product"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h3 className='text-center mb-3'>Create Product</h3>
                        <div className="m-1  w-75">
                            <Select bordered={false}
                                placeholder="Select a catagory"
                                size='large' showSearch
                                onSearch={(value) => { setSearch(value) }}
                                className='form-select mb-3'
                                onChange={(value) => { setCatagory(value) }}>
                                {catagories?.map(c => (
                                    <Option key={c._id} value={c._id}>{c.name}</Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt='products-img' height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder='Product Name'
                                    className='form-control'
                                    onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <textarea type="text"
                                    value={description}
                                    placeholder="Description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="Price"
                                    className="form-control"
                                    onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="Quantity"
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <Select
                                    bordered={false}
                                    placeholder="Select Shipping "
                                    size="large"
                                    className="form-select mb-3"
                                    onChange={(value) => {
                                        setShipping(value);
                                    }}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3 text-center">
                                {spinnerLoading ? <Spinner /> : ""}

                                <button className="btn btn-warning fw-bold " onClick={handleCreate}>
                                    Create Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default CreateProduct;
