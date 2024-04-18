/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { baseUrl } from 'utils/baseUrl';
import Swal from 'sweetalert2'
import { BsCheckLg } from 'react-icons/bs';


function ligne() {

    const [storedToken, setStoredToken] = useState('');
    const [modal, setModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedLigne, setSelectedLigne] = useState({});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [assignedError, setAssignedError] = useState(false);
    const [users, setUsers] = useState([]);

    const [lignes, setLignes] = useState([{

    },]);

    const onSubmit = async (data) => {
        const date = new Date();
        let newLigne = {
            "title": data.titre,
            "daterealisation": data.dateRealisation,
        }

        // If an assigne (technician) is provided, include it in the new ligne object
        if (data.assigne !== "") {
            newLigne.technician = data.assigne;
        }

        try {
            // Send the request to create a new Ligne object
            const response = await axios.post(`${baseUrl}/lignes/`, newLigne, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });

            // If the Ligne creation is successful, create the related LignesAssignto object
            if (response.status === 201) {
                const ligneId = response.data.id;
                const assigneId = data.assigne; // Assuming assigneId is the ID of the technician

                if (assigneId) {
                    // Send the request to create a new LignesAssignto object
                    await axios.post(`${baseUrl}/ligne-assignments/create/`, {
                        "ligne": ligneId,
                        "technician": assigneId,
                        "status": "pending"
                    }, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });
                }
                handleClose(); // Close the form or perform any other necessary action
            } else {
                // Handle unsuccessful response if needed
            }
        } catch (error) {
            // Handle errors
            console.error('Error creating Ligne:', error);
        }
    };
    async function updateLigne(data) {
        let newLinge = {
            "title": data.titre,
            "daterealisation": data.dateRealisation,
        }
        axios.put(`${baseUrl}/lignes/${selectedLigne.id}`, newLinge, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }).then((res) => { setUpdateModal(false) })
    }
    const onUpdateSubmit = async (data) => {
        axios.get(`${baseUrl}/lignesAssignTo/get/${selectedLigne.id}`,
            { headers: { Authorization: `Bearer ${storedToken}` } })
            .then((res) => {
                const ligneAssigned = res.data

                if (ligneAssigned.status != "pending") {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Ligne already on progress or done you can't update it ",
                    });
                    setUpdateModal(false)
                } else {
                    updateLigne(data)
                }
            }).catch((err) => {
                updateLigne(data).then((res) => {
                    location.reload()

                })
            })
    }
    const handleClose = () => {
        //alert('closing');
        setModal(false);
    };
    const openModal = () => {
        setModal(true);
    };

    const getUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Check token value
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${baseUrl}/auth/users/`, config);
            console.log(response.data);
            const filteredUsers = response.data.filter(user => user.role === 2);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }

    }
    const getAllLignes = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Check token value
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${baseUrl}/lignes/`, config);
            console.log('Response:', response.data);
            setLignes(response.data);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }
    };
    function updateAsignementToUser(ligne) {
        const userOptions = {};
        users.forEach((user) => {
            userOptions[user.id] = `${user.email} `;
        });

        const { value: user } = Swal.fire({
            title: "Assigne ligne to user :",
            input: "select",
            inputOptions: userOptions,
            inputPlaceholder: "Selcter un utilisateur",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {

                    resolve()
                });
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                let body = {
                    "ligne": ligne.id,
                    "technician": result.value,
                    "status": "pending"
                }
                axios.post(`${baseUrl}/lignesAssignTo/create/`, body,
                    { headers: { Authorization: `Bearer ${storedToken}` } }).then((res) => {
                        console.log(res)
                        Swal.fire(`user assigned successfully!`);

                    })
            }

        })
    }
    const assignToUser = async (ligne) => {

        console.log(ligne)
        axios.get(`${baseUrl}/lignesAssignTo/get/${ligne.id}`,
            { headers: { Authorization: `Bearer ${storedToken}` } })
            .then((res) => {
                if (res.data.status == "pending") {
                    updateAsignementToUser(ligne)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Ligne already on progress or done you can't update it ",
                    });
                }

            }).catch((err) => {
                if (err.response && err.response.status === 404) {

                    updateAsignementToUser(ligne)
                    console.log(err)
                }
            }
            )
    }
    const handleDeletLigne = async (id) => {
        axios.get(`${baseUrl}/lignesAssignTo/get/${id}`,
            { headers: { Authorization: `Bearer ${storedToken}` } })
            .then((res) => {
                if (res.data.status == "pending") {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                        axios.delete(`${baseUrl}/lignesAssignTo/delete/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } }).then(() => {
                        if (result.isConfirmed) {
                            setLignes(lignes.filter(ligne => ligne.id !== id));
                            axios.delete(`${baseUrl}/lignes/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } }).then(() => {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Ligne has been deleted.",
                                    icon: "success"
                                });
                            })
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "all good!",
                        });
                    }
            );
                    })
                }
            })
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setStoredToken(token || '');
            console.log(storedToken);
        }
        getAllLignes();
        getUsers();

    }, []);
    return (

        <>
            <div style={{ padding: 23, marginTop: 22 }}>
                <div style={{ paddingBottom: 22 }}>
                    <ActionButton
                        Icon={AiOutlinePlusCircle}
                        label="Ajouter nouveau ligne"
                        onClick={openModal}

                    />
                </div>
                <div class="table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Titre de ligne</th>
                                <th scope="col">Date de Realisation prev</th>
                                <th scope="col">Date de creation </th>
                                <th scope="col">edit: </th>
                                <th scope="col">Assigné à : </th>
                                <th scope="col">supprimer  : </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                lignes.map((ligne, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{ligne.id}</td>
                                            <td>{ligne.title}</td>
                                            <td>{ligne.daterealisation}</td>
                                            <td>{ligne.datecreation}</td>
                                            <td onClick={(e) => {
                                                setSelectedLigne(ligne)
                                                setUpdateModal(true)
                                            }}>Edit</td>
                                            <td onClick={(e) => assignToUser(ligne)}>Assigné</td>
                                            <td onClick={(e) => handleDeletLigne(ligne.id)}>Supprimer</td>

                                        </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {modal ? (
                    <section className={"modal-bg"}>
                        <div className={"modal-container"}>
                            <div className={"modal-header"}>
                                <h3 className={"modal-heading"}>Ajouter une nouvelle ligne</h3>
                                <button
                                    onClick={handleClose}
                                    className={"close-btn"}
                                >
                                    X
                                </button>
                            </div>
                            <div className={"modal-body"}>
                                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex">
                                        <label>
                                            <input
                                                {...register("id")}
                                                placeholder=""
                                                type="text"
                                                className="input"
                                                disabled
                                            />
                                            <span>ID (généré automatique)</span>
                                        </label>
                                    </div>

                                    <label>
                                        <input
                                            {...register("titre", { required: true })}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                        <span>Titre de la ligne</span>
                                        {errors.titre && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">Titre requis</p>}
                                    </label>

                                    <label>
                                        <input
                                            {...register("dateRealisation", { required: true })}
                                            placeholder=""
                                            type="date"
                                            className="input"
                                        />
                                        <span>DATE DE REALISATION PREV</span>
                                        {errors.dateRealisation && errors.dateRealisation.type === "required" && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">Date de réalisation requise</p>}
                                    </label>

                                    <div className="dropdown">
                                        <select {...register("assigne")} className="dropbtn">
                                            <option value="" disabled selected hidden>Assigné à :</option>
                                            <option value=""  >no one</option>

                                            {
                                                users.map((user, key) => {
                                                    return (
                                                        <option key={key} value={user.id}>{`${user.first_name} ${user.last_name}`}</option>

                                                    )
                                                })
                                            }
                                        </select>
                                    </div>

                                    <button type="submit" className="submit">Submit</button>
                                </form>
                            </div>

                        </div>
                    </section>
                ) : null}
                {updateModal ? (
                    <section className={"modal-bg"}>
                        <div className={"modal-container"}>
                            <div className={"modal-header"}>
                                <h3 className={"modal-heading"}>Modifier  ligne</h3>
                                <button
                                    onClick={(e) => setUpdateModal(false)}
                                    className={"close-btn"}
                                >
                                    X
                                </button>
                            </div>
                            <div className={"modal-body"}>
                                <form className="form" onSubmit={handleSubmit(onUpdateSubmit)}>
                                    <div className="flex">
                                        <label>
                                            <input
                                                {...register("id")}
                                                placeholder=""
                                                type="text"
                                                className="input"
                                                disabled
                                            />
                                            <span>{selectedLigne.id}</span>
                                        </label>
                                    </div>

                                    <label>
                                        <input
                                            {...register("titre", { required: true })}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                        <span>{selectedLigne.title}</span>
                                        {errors.titre && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">Titre requis</p>}
                                    </label>

                                    <label>
                                        <input
                                            {...register("dateRealisation", { required: true })}
                                            placeholder=""
                                            type="date"
                                            className="input"
                                        />
                                        <span>{selectedLigne.daterealisation}</span>
                                        {errors.dateRealisation && errors.dateRealisation.type === "required" && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">Date de réalisation requise</p>}
                                    </label>

                                    {/* <div className="dropdown">
                                        <select {...register("assigne")} className="dropbtn">
                                            <option value="" disabled selected hidden>Assigné à :</option>
                                            <option value=""  >no one</option>

                                            {
                                                users.map((user, key) => {
                                                    return (
                                                        <option key={key} value={user.id}>{`${user.first_name} ${user.last_name}`}</option>

                                                    )
                                                })
                                            }
                                        </select>
                                    </div> */}

                                    <button type="submit" className="submit">Submit</button>
                                </form>
                            </div>

                        </div>
                    </section>
                ) : null}
            </div>
        </>

    )
}

export default ligne