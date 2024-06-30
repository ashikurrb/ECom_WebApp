import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout';
import moment from "moment";
import { useAuth } from '../../components/context/auth';
import axios from 'axios';
import { Select } from "antd";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;


const AdminOrder = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Canceled"]);
    const [changeStatus, setChangeStatus] = useState("");
    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`)
            setOrders(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token])

    //order status change
    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`, { status: value })
            getOrders();
        } catch (error) {
            console.error(error);
        }
    }

    //delete orders
    const handleDelete = async (oId) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/auth/delete-order/${oId}`);
            if (data.success) {
                toast.success(`Order deleted successfully`);
                getOrders();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while Delete')
        }
    }


    return (
        <Layout title={"Admin - All Orders"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h2 className="text-center my-3">All Orders ({orders.length})</h2>
                        {orders?.map((o, i) => {
                            return (
                                <div className="border m-2 table-container">
                                    <table data-bs-toggle="collapse" href={`#${o?._id}`} className="table">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Buyer</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Payment</th>
                                                <th scope="col">Trx Id</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope='row'>{i + 1}</th>
                                                <td>
                                                    <Select border={false} onChange={(value) => handleChange(o._id, value)} defaultValue={o?.status}>
                                                        {status.map((s, i) => (
                                                            <Option key={i} value={s}>{s}</Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>{o?.buyer?.name}</td>
                                                <td>{moment(o?.createdAt).fromNow()}</td>
                                                <td className={o?.payment.success ? "text-success" : "text-danger fw-bold"}>
                                                    {o?.payment.success ? "Success" : "Failed"}
                                                </td>
                                                <td><b>{o?.payment?.transaction?.id}</b></td>
                                                <td>Tk. {o?.payment?.transaction?.amount} </td>
                                                <td>{o?.products?.length}</td>
                                                <td><button className="btn btn-danger ms-1" onClick={() => handleDelete(o._id)}>Delete</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="container collapse " id={o?._id}>
                                        <div className="d-flex flex-wrap">
                                            <table className="table shadow">
                                                <thead className='table-info'>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Photo</th>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {o?.products?.map((p, i) => (
                                                        <tr>
                                                            <td>{i + 1}</td>
                                                            <td onClick={() => navigate(`/product/${p.slug}`)}>
                                                                <img
                                                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                                                    className="img-thumbnail"
                                                                    alt={p.name}
                                                                    width="100px"
                                                                    height={"100px"}
                                                                />
                                                            </td>
                                                            <td>{p?.name}</td>
                                                            <td>{p?.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default AdminOrder;