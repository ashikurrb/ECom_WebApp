import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../components/context/auth';
import moment from "moment";
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const Order = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [spinnerLoading, setSpinnerLoading] = useState(true);


  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`)
      setOrders(data)
    } catch (error) {
      console.log(error);
    } finally {
      setSpinnerLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token])

  return (
    <Layout title={"Dashboard - Your Orders"}>
      <div className="container-fluid mt-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h2 className="text-center my-3">All Orders ({orders.length})</h2>
            {spinnerLoading ? <Spinner /> : <>
              {orders?.length < 1 ? <h5 className='text-center'>You don't have any pending. Visit <Link to="/">Home</Link> to order.</h5> : <>
                {orders?.map((o, i) => {
                  return (
                    <div className="card mt-3 p-4 table-container">
                      <table data-bs-toggle="collapse" href={`#${o?._id}`} className="table">
                        <thead className='table-dark'>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Time</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Trx ID</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope='row'>{i + 1}&nbsp;<i class="fa-solid fa-chevron-down"></i> </th>
                            <td>
                              {o?.status}
                            </td>
                            <td>{moment(o?.createdAt).fromNow()}</td>
                            <td className={o?.payment.success ? "text-success" : "text-danger fw-bold"}>
                              {o?.payment.success ? "Success" : "Failed"}
                            </td>
                            <td><b>{o?.payment?.transaction?.id}</b></td>
                            <td>Tk. {o?.payment?.transaction?.amount}</td>
                            <td>{o?.products?.length}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="container collapse show" id={o?._id}>
                        <div className="d-flex flex-wrap">
                          {o?.products?.map((p, i) => (
                            <div className="row m-2 p-3 card flex-row" key={p._id} onClick={() => navigate(`/product/${p.slug}`)}>
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
                                <p><b>{p.name}</b></p>
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
              </>}</>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;