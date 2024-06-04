import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Modal } from 'antd';
import CatagoryForm from '../../components/Form/CatagoryForm';

const CreateCatagory = () => {
    const [catagories, setCatagories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    //handle Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/catagory/create-catagory`, { name });
            if (data?.success) {
                toast.success(`${name} | Catagory created successfully`)
                getAllCatagory();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Somethng wrong in Input Form")
        }
    }

    //get all catagory
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

    //update catagory
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/catagory/update-catagory/${selected._id}`, { name: updatedName });
            if (data.success) {
                toast.success(`${updatedName} is updated`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCatagory();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while update')
        }
    }

    //delete catagory
    const handleDelete = async (pId) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/catagory/delete-catagory/${pId}`);
            if (data.success) {
                toast.success(`Catagory deleted successfully`);
                getAllCatagory();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while Delete')
        }
    }


    return (
        <Layout title={"Dashboard - Create Catagory"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h1>Catagory Creation</h1>
                        <div className="p-3 w-50">
                            <CatagoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                        <div className='w-75 '>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {catagories.map((c) => (
                                        <>
                                            <tr>
                                                <td key={c._id}>{c.name}</td>
                                                <td>
                                                    <button className="btn btn-primary ms-1" onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c); }}>Edit</button>
                                                    <button className="btn btn-danger ms-1" onClick={() => { handleDelete(c._id) }}>Delete</button>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Modal
                        onCancel={() => setVisible(false)}
                        footer={null}
                        visible={visible}
                    >
                        <CatagoryForm value={updatedName}
                            setValue={setUpdatedName}
                            handleSubmit={handleUpdate} />
                    </Modal>
                </div>
            </div>
        </Layout >
    );
};

export default CreateCatagory;