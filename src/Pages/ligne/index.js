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
    const [assignModal, setAssignModal] = useState(false);
    const [selectedLigne, setSelectedLigne] = useState({});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [users, setUsers] = useState([]);
    const [lignes, setLignes] = useState([]);
    const [ligneTests, setLigneTests] = useState([]);
    const [tests, setTests] = useState([]);

    const onSubmit = async (data) => {
        const date = new Date();
        let newLigne = {
            "title": data.titre,
            "sem": data.sem,
            "status":"pending"
        }

        try {
            // Send the request to create a new Ligne object
            const response = await axios.post(`${baseUrl}/lignes/`, newLigne, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });

            // If the Ligne creation is successful, create the related LignesAssignto object
            if (response.status === 201 || response.status === 200) {
                const ligneId = response.data.id;
                setLignes([...lignes, newLigne]);
                handleClose(); // Close the form or perform any other necessary action
            }
        } catch (error) {
            // Handle errors
            console.error('Error creating Ligne:', error);
            Swal.fire({
                icon: "error",
                title: "Error creating Ligne...",
                text: error,
            });
        }
    };
    async function updateLigne(data) {
        let newLinge = {
            "title": data.titre,
            "sem": data.sem,
        }
        try {
            const response = await axios.put(`${baseUrl}/lignes/${selectedLigne.id}`, newLinge, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
            if (response.status === 200) {
                // Update lignes state with the updated ligne
                setLignes(prevLignes => {
                    const updatedLignes = prevLignes.map(ligne => {
                        if (ligne.id === selectedLigne.id) {
                            return {
                                ...ligne,
                                title: newLinge.title,
                                sem: newLinge.sem
                            };
                        }
                        return ligne;
                    });
                    return updatedLignes;
                });
                setUpdateModal(false);
                setSelectedLigne({});
            }
        } catch (error) {
            console.error('Error updating Ligne:', error);
            Swal.fire({
                icon: "error",
                title: "Error updating Ligne...",
                text: error,
            });
        }
    }
    const handleClose = () => {
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
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Fetch lignes data
            const responseLignes = await axios.get(`${baseUrl}/lignes/`, config);
            const lignesData = responseLignes.data;
            setLignes(lignesData);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }
    };
    const getAllLigneTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${baseUrl}/lignes/ligne-tests/`, config);
            setLigneTests(response.data);
        } catch (error) {
            console.error('Error fetching ligne-tests:', error);
        }
    };
    const getAllTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${baseUrl}/lignes/tests/`, config);
            setTests(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };
    const checkIfLigneAssignedToTest = (ligneId) => {
        return ligneTests.some(lt => lt.ligne === ligneId);
    };
    const handleDeletLigne = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .delete(`${baseUrl}/lignes/${id}`, {
                            headers: { Authorization: `Bearer ${storedToken}` },
                        })
                        .then(() => {
                            setLignes(lignes.filter((ligne) => ligne.id !== id));
                            Swal.fire({
                                title: "Deleted!",
                                text: "Ligne has been deleted.",
                                icon: "success",
                            });
                        });
                }
            });
        } catch (err) {
            console.error('Error deleting Ligne:', err);
            Swal.fire({
                icon: "error",
                title: "Error deleting Ligne...",
                text: err,
            });
        }

    }
    const assignToTest = async (data) => {
        const assign = {
            "ligne": data.ligne,
            "test": data.test,
            "periodicity": data.periodicity
        };

        try {
            const response = await axios.post(`${baseUrl}/lignes/ligne-tests/`, assign, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Ligne assigned to test",
                    text: "Ligne assigned to test successfully",
                });
                handleClose();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ligne already in progress or done, you can't update it.",
                });
                handleClose();
            }
        } catch (error) {
            console.error('Error assigning Ligne to test:', error);
            Swal.fire({
                icon: "error",
                title: "Error assigning Ligne to test...",
                text: error.toString(),
            });
        }
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setStoredToken(token || '');
            console.log(storedToken);
        }
        getAllLignes();
        getUsers();
        getAllLigneTests();
        getAllTests();
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
                        <colgroup>
                            <col style={{ width: "5%" }} /> {/* ID */}
                            <col style={{ width: "15%" }} /> {/* Titre de ligne */}
                            <col style={{ width: "10%" }} /> {/* Date de Realisation prev */}
                            <col style={{ width: "10%" }} /> {/* Date de creation */}
                            <col style={{ width: "10%" }} /> {/* Edit */}
                            <col style={{ width: "10%" }} /> {/* Assigné à */}
                            <col style={{ width: "10%" }} /> {/* Assigné à */}
                            <col style={{ width: "10%" }} /> {/* Supprimer */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Titre de ligne</th>
                                <th scope="col">Date de creation</th>
                                <th scope="col">Semaine </th>
                                <th scope="col">edit: </th>
                                <th scope="col">Assigné à  </th>
                                <th scope="col"> Status </th>
                                <th scope="col">supprimer   </th>

                            </tr>
                        </thead>
                        <tbody>
                            {lignes.map((ligne, index) => (
                                <tr key={index}>
                                    <td>{ligne.id}</td>
                                    <td>{ligne.title}</td>
                                    <td>{new Date(ligne.datecreation).toLocaleDateString()}</td>
                                    <td>{ligne.sem}</td>
                                    <td onClick={(e) => {
                                        setSelectedLigne(ligne);
                                        setUpdateModal(true);
                                    }}>Edit</td>
                                    <td onClick={() => {
                                        setSelectedLigne(ligne);
                                        setAssignModal(true);
                                    }}>
                                        {checkIfLigneAssignedToTest(ligne.id) ? 'Assigned' : 'Not Assigned'}
                                    </td>
                                    <td>{ligne.status || 'Pending'}</td> {/* Display status here */}
                                    <td onClick={(e) => handleDeletLigne(ligne.id)}>Supprimer</td>
                                </tr>
                            ))}
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
                                            {...register("sem", { required: true })}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                        <span>Semaine du ligne (sem 1)</span>
                                        {errors.sem && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">Semaine requis</p>}
                                    </label>

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
                                <form className="form" onSubmit={handleSubmit(updateLigne)}>
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
                                            {...register("sem", { required: true })}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                        <span>{selectedLigne.sem}</span>
                                        {errors.sem && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">semaine</p>}
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
                {assignModal ? (
                    <section className={"modal-bg"}>
                        <div className={"modal-container"}>
                            <div className={"modal-header"}>
                                <h3 className={"modal-heading"}>Assigner une ligne à un test</h3>
                                <button onClick={(e) => setAssignModal(false)} className={"close-btn"}>X</button>
                            </div>
                            <div className={"modal-body"}>
                                <form className="form" onSubmit={handleSubmit(assignToTest)}>
                                    <label>
                                        <span>Ligne:</span>
                                        <select {...register("ligne", { required: true })} className="input">
                                            {lignes.map((ligne, key) => (
                                                <option key={key} value={ligne.id}>{ligne.title}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        <span>Test:</span>
                                        <select {...register("test", { required: true })} className="input">
                                            {tests.map((test, key) => (
                                                <option key={key} value={test.id}>{test.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        <input
                                            {...register("periodicity", { required: true })}
                                            placeholder="Periodicity"
                                            type="text"
                                            className="input"
                                        />
                                        <span>Periodicity</span>
                                        {errors.periodicity && <p className="error-message">Periodicity requis</p>}
                                    </label>
                                    {}
                                    <button type="submit" className="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    </section>
                ):null}
            </div>
        </>

    )
}

export default ligne