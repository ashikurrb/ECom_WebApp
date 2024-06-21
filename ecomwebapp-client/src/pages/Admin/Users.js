import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../components/context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';

const Users = () => {
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);


    //get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`)
            setUsers(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token])

    //delete users
    const handleDelete = async (uId) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/auth/delete-user/${uId}`);
            if (data.success) {
                toast.success(`User deleted successfully`);
                getAllUsers();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while Delete')
        }
    }


    return (
        <Layout title={"User's List"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center'>All User's List</h2>
                        <div className="a table-container">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Name</th>
                                        <th scope='col'>Email</th>
                                        <th scope='col'>Phone</th>
                                        <th scope='col'>Address</th>
                                        <th scope='col'>Fvt Food</th>
                                        <th scope='col'>Role</th>
                                        <th scope='col'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        users.map((u, i) => {
                                            return (
                                                <tr>
                                                    <th scope='row'>{i + 1}</th>
                                                    <td>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.phone}</td>
                                                    <td>{u.address}</td>
                                                    <td>{u.answer}</td>
                                                    <td >{u.role}</td>
                                                    <td>
                                                        {
                                                            u.role == "1" ? "Admin" : (
                                                                <button className="btn btn-danger ms-1" onClick={() => handleDelete(u._id)}>Delete</button>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;