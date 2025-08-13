import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../components/context/auth';
import moment from "moment";
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const Order = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSpinnerLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  //url checker
  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const toggleCollapse = (orderId) => {
    setOpenOrderId(prev => (prev === orderId ? null : orderId));
  };
  return (
    <Layout title={"Dashboard - Your Orders"}>
      <div className="container-fluid mt-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h2 className="text-center my-3"><i class="fa-solid fa-box"></i> All Orders ({orders.length})</h2>
            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <>
              {orders?.length < 1 ? (
                <h5 className='text-center'>
                  You don't have any pending orders. Visit <Link to="/">Home</Link> to order.
                </h5>
              ) : (
                orders?.map((o, i) => {
                  const productQuantities = o.products.reduce((acc, product) => {
                    acc[product._id] = (acc[product._id] || 0) + 1;
                    return acc;
                  }, {});

                  const uniqueProducts = o.products.filter(
                    (product, index, self) =>
                      index === self.findIndex((p) => p._id === product._id)
                  );

                  return (
                    <div className="card mt-3 p-4 table-container" key={o._id}>
                      <table href={`#${o._id}`} className="table">
                        <thead className='table-dark'>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Updated</th>
                            <th scope="col">Created</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Trx ID</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Note</th>
                            <th scope="col">Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th
                              scope="row"
                              data-bs-toggle="collapse"
                              href={`#${o?._id}`}
                              onClick={() => toggleCollapse(o._id)}
                              style={{ cursor: "pointer" }}
                            >
                              {i + 1}&nbsp;
                              <i
                                className={`btn fa-solid ${openOrderId === o._id ? "fa-chevron-up" : "fa-chevron-down"}`}
                              ></i>
                            </th>
                            <td>{o.status === 'Canceled' ? <span className='text-danger fw-bold'>Canceled</span> : o.status}</td>
                            <td>{o.createdAt !== o.updatedAt ? moment(o?.updatedAt).fromNow() : "--"}</td>
                            <td>{moment(o?.createdAt).format('lll')}</td>
                            <td className={o?.payment?.success ? "text-success" : "text-danger fw-bold"}>
                              {o?.payment?.success ? "Success" : "Failed"}
                            </td>
                            <td><b>{o.payment?.transaction?.id ? o.payment?.transaction?.id : "---"}</b></td>
                            <td>Tk. {o?.payment?.transaction?.amount ? o?.payment?.transaction?.amount : "---"}</td>
                            <td>{o.products.length}</td>
                            <td>{o?.orderNote === "" ? "---" : o?.orderNote}</td>
                            <td>
                              {isUrl(o?.orderAddress) ? (
                                <a href={o?.orderAddress} target="_blank" rel="noopener noreferrer">
                                  Open Map
                                </a>
                              ) : (
                                o?.orderAddress
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className={`container collapse ${openOrderId === o._id ? "show" : ""}`} id={o?._id}>
                        <div className="d-flex flex-wrap">
                          {uniqueProducts.map((p) => (
                            <div className="row m-2 p-3 card flex-row" key={p._id}>
                              <div className="col-md-4">
                                <Link to={`/product/${p.slug}`}>
                                  <img
                                    src={p?.photo}
                                    className="imgFit card-img-top"
                                    alt={p.name}
                                    width={"100px"}
                                    height={"100px"}
                                  />
                                </Link>
                              </div>
                              <div className="col-md-8">
                                <p className='my-2'><b>{p.name}</b> &nbsp;
                                  <span class="badge rounded-pill text-bg-dark fs-6"> {productQuantities[p._id]}</span>
                                </p>
                                <p>{p.description.substring(0, 30)}</p>
                                <p>Price : {p.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;