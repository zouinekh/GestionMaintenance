/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiFillWarning, AiOutlinePlusCircle } from 'react-icons/ai';
import { baseUrl } from 'utils/baseUrl';
import Swal from 'sweetalert2'
import { GrValidate } from "react-icons/gr";

import { CiWarning } from "react-icons/ci";

export default function LigneAssigned() {
    const [storedToken, setStoredToken] = useState('');
    const [modal, setModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedLigne, setSelectedLigne] = useState({});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [assignedError, setAssignedError] = useState(false);
    const [users, setUsers] = useState([]);

    const [lignes, setLignes] = useState([{

    },]);



    const getAllLignes = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Check token value
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };//http://localhost:8000/technicien/get/
            const response = await axios.get(`${baseUrl}/lignes/`, config);
            console.log(response)
            const filteredLignes = response.data.filter(ligne => ligne.status == 'completed');
            console.log('Filtered Lignes:', filteredLignes);

            setLignes(filteredLignes);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }
    };



    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setStoredToken(token || '');
            console.log(storedToken);
        }
        getAllLignes();
    }, []);
    return (
        <>
            <div style={{ padding: 23, marginTop: 22 }}>
                {/* <div style={{ paddingBottom: 22 }}>
                    <ActionButton
                        Icon={AiOutlinePlusCircle}
                        label="Ajouter nouveau ligne"
                      
                    />
                </div> */}
                <div class="table-container">
                    <table class="custom-table">
                        <colgroup>
                            <col style={{ width: "10%" }} /> {/* ID */}
                            <col style={{ width: "20%" }} /> {/* Titre de ligne */}
                            <col style={{ width: "20%" }} /> {/* Date de Realisation prev */}
                            <col style={{ width: "20%" }} /> {/* Date de creation */}
                            <col style={{ width: "20%" }} /> {/* Edit */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Titre de ligne</th>
                                <th scope="col">Date de creation</th>
                                <th scope="col">Status</th>
                                <th scope="col">Semaine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                lignes.map((ligne, index) => {
                                    return (

                                        <tr key={index} >
                                            <td>{ligne.id}</td>
                                            <td>{ligne.title}</td>
                                            <td>{new Date(ligne.datecreation).toLocaleDateString()}</td>
                                            <td>{ligne.status}</td>
                                            <th>{ligne.sem}</th>
                                        </tr>)

                                })
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

