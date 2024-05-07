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


    async function getComment() {
        const { value: text } = await Swal.fire({
            input: "textarea",
            inputLabel: "Comment",
            inputPlaceholder: "Type your comment here...",
            inputAttributes: {
                "aria-label": "Type your comment here"
            },
            showCancelButton: true
        });
        if (text) {
            return text
        } else {
            return "no comment"
        }
    }

    function confirmLigne(id) {
        Swal.fire({
            title: "Do you want to Valide this ligne?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.isConfirmed) {
                //TODO: uri of the endpoint of update  id passed by params in then use the swal in the line 38 dont forget to update also the status and remove from the ligne table
                // const token = localStorage.getItem('token');
                // console.log('Token:', token); // Check token value
                // const config = {
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // };
                // const currentDate = new Date();

                // // Get year, month, and day
                // const year = currentDate.getFullYear();
                // const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                // const day = currentDate.getDate().toString().padStart(2, '0');

                // // Format the date
                // const formattedDate = `${year}-${month}-${day}`;

                // const body = {

                //     "status": "completed",  // Update the status
                //     "realisation_date": formattedDate,  // Update the realization date
                //     "comment": ""  // Update the comment
                // }
                // axios.put(`${baseUrl}/technicien/update/${id}/`, body, config).then((res) => {
                //     const updatedLignes = lignes.filter(line => line.id !== id);
                //     setLignes(updatedLignes)
                //     Swal.fire("Saved!", "", "success");
                //     console.log(res)
                // })
                Swal.fire("Saved!", "", "success");


            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

    const getAllLignes = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Check token value
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };//http://localhost:8000/technicien/get/
            const response = await axios.get(`${baseUrl}/lignesAssignTo/`, config);
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
                            <col style={{ width: "5%" }} /> {/* ID */}
                            <col style={{ width: "15%" }} /> {/* Titre de ligne */}
                            <col style={{ width: "10%" }} /> {/* Date de Realisation prev */}
                            <col style={{ width: "10%" }} /> {/* Date de creation */}
                            <col style={{ width: "10%" }} /> {/* Edit */}
                            <col style={{ width: "20%" }} /> {/* Assigné à */}
                            <col style={{ width: "10%" }} /> {/* Supprimer */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Titre de ligne</th>
                                <th scope="col">Date de affectation </th>
                                <th scope="col">Status</th>
                                <th scope="col">Validation status</th>
                                <th scope="col">comment</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                lignes.map((ligne, index) => {


                                    return (

                                        <tr key={index} >
                                            <td>{ligne.id}</td>
                                            <td>{ligne.ligne_title}</td>
                                            <td>{new Date(ligne.affectation_date).toLocaleString()}</td>
                                            <td>{ligne.status}</td>
                                            <td> {ligne.confirmed ? "confirmed" : "not confirmed"}  </td>
                                            <td style={{fontSize: 13, color: "black" }} >{ligne.comment}</td>
                                            {<td style={{ fontWeight: "bold", cursor: 'pointer', fontSize: 13, color: "black" }} onClick={(e) => { confirmLigne(ligne.id) }}>Validate</td>}
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

