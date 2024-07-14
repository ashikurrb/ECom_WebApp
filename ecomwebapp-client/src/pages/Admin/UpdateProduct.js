import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [catagories, setCatagories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [catagory, setCatagory] = useState('');
    const [photo, setPhoto] = useState('');
    const [id, setId] = useState("");
    const [search, setSearch] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [spinnerProdLoading, setSpinnerProdLoading] = useState(false);

    //get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setSpinnerProdLoading(false)
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setShipping(data.product.shipping);
            setCatagory(data.product.catagory._id);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getSingleProduct();
        setSpinnerProdLoading(true)
        //eslint-disable-next 

    }, [])

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

    //update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true)
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("shipping", shipping);
            photo && productData.append("photo", photo);
            productData.append("catagory", catagory);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`, productData);
            setSpinnerLoading(true);
            if (data?.success) {
                setSpinnerLoading(false)
                toast.success(data?.message);
                navigate('/dashboard/admin/products')
            } else {
                toast.success("Product Updated Successfully");

            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setSpinnerLoading(false)
        }
    }

    //Delete Product
    const handleDelete = async () => {
        try {
            let answer = window.confirm("Are you sure want to delete this product?")
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
            toast.success("Product Deleted Successfully");
            navigate('/dashboard/admin/products')
        } catch (error) {
            console.log(error);
            toast.error('Something wrong while delete')
        }
    }

    return (
        <Layout title={"Dashboard - Update Product"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h3 className='text-center my-3'>Update Product</h3>
                        <div className="m-1 w-75">
                            <Select bordered={false}
                                placeholder="Select a catagory"
                                size='large'
                                className='form-select mb-3' onChange={(value) => { setCatagory(value) }}
                                value={catagory}>
                                {catagories?.map(c => (
                                    <Option key={c._id} value={c._id}>{c.name}</Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <h6 className='text-center my-3'>Maximum Photo size is 1 MB</h6>
                                <div className="m-2">
                                    {spinnerProdLoading ? <Spinner /> : ""}
                                </div>
                                {photo ? (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt='products-img' height={'200px'} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div className="text-center ">
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} alt='products-img' height={'200px'} className='border border-primary rounded img img-responsive' />
                                    </div>
                                )}
                            </div>
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
                                    value={shipping}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            {spinnerLoading ? <Spinner /> : ""}
                            <div className="d-flex">
                                <button className="btn btn-primary m-1" onClick={handleUpdate}>
                                    Update Product
                                </button>

                                <button className="btn btn-danger m-1" onClick={handleDelete}>
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default UpdateProduct;