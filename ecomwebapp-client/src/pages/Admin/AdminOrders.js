import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout';
import moment from "moment";
import { useAuth } from '../../components/context/auth';
import axios from 'axios';
import { Select } from "antd";
import toast from 'react-hot-toast';
const { Option } = Select;


const AdminOrder = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Canceled"]);
    const [changeStatus, setChangeStatus] = useState("");
    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([]);

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
                        <h2 className="text-center">All Orders</h2>
                        {orders?.map((o, i) => {
                            return (
                                <div className="border m-2 table-container">
                                    <table className="table">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Buyer</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Payment</th>
                                                <th scope="col">Trx Id</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{i + 1}</td>
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
                                                <td>{o?.products?.length}</td>
                                                <td><button className="btn btn-danger ms-1" onClick={() => handleDelete(o._id)}>Delete</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="container">
                                        <div className="d-flex flex-wrap">
                                            {o?.products?.map((p, i) => (
                                                <div className="row m-2 p-3 card flex-row" key={p._id}>
                                                    <div className="col-md-4">
                                                        <img
                                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                                            className="card-img-top"
                                                            alt={p.name}
                                                            width="100px"
                                                            height={"100px"}
                                                        />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className='fw-bold'>{p.name}</p>
                                                        <p>{p.description.substring(0, 30)}</p>
                                                        <p>Price : {p.price}</p>
                                                    </div>
                                                </div>
                                            ))}
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