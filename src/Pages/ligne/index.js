/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';
import InlineButton from '@aio/components/InlineButton';
import Modal from '@aio/components/Modal';
import Table from '@aio/components/Table';
import TextButton from '@aio/components/TextButton';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { baseUrl } from 'utils/baseUrl';
import Swal from 'sweetalert2'


function ligne() {

    const [storedToken, setStoredToken] = useState('');
    const [modal, setModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedLigne, setSelectedLigne] = useState({});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [assignedError, setAssignedError] = useState(false);
    // const [users, setUsers] = useState([
    //     {
    //         "id": 1,
    //         "email": "vipan@gmail.com",
    //         "first_name": "",
    //         "last_name": "",
    //         "password": "pbkdf2_sha256$260000$PHqEzke3ANQhUTd5t9u3mo$VFEHte+CLQT+8rjdZg3/hFNZUkEg20dIqmVkti2VVXs=",
    //         "username": "vipan",
    //         "role": 1
    //     },
    //     {
    //         "id": 2,
    //         "email": "mohit@gmail.com",
    //         "first_name": "mohit",
    //         "last_name": "kuamr",
    //         "password": "pbkdf2_sha256$260000$DHhIHhXjBNxMoQTnvJRlOr$OZRuSFaqB8muCs5BF1hyuXyhfGU2/eiA6VYtxwr7Rfg=",
    //         "username": "mohit1",
    //         "role": 3
    //     },
    //     {
    //         "id": 3,
    //         "email": "akhil@gmail.com",
    //         "first_name": "akhil",
    //         "last_name": "kumar",
    //         "password": "pbkdf2_sha256$260000$qF6Tim8kqxytQcXkCmUYxa$5SEiQQiPVZWXqXv7+9iJVU69ypm058GTKQIz2q6fAfY=",
    //         "username": "akhil123",
    //         "role": 3
    //     },
    //     {
    //         "id": 4,
    //         "email": "admin@pfe.com",
    //         "first_name": "",
    //         "last_name": "",
    //         "password": "pbkdf2_sha256$720000$7zOHxwVm2r0YGB7v1sMimM$LbrVZaRIea9qupJugwjyKb8s4LIqdOXLqeVfc3EY5qo=",
    //         "username": "admin",
    //         "role": 1
    //     },
    //     {
    //         "id": 5,
    //         "email": "test@pfe.com",
    //         "first_name": "test",
    //         "last_name": "test",
    //         "password": "test",
    //         "username": "test",
    //         "role": 3
    //     },
    //     {
    //         "id": 6,
    //         "email": "test@example.com",
    //         "first_name": "Test",
    //         "last_name": "User",
    //         "password": "pbkdf2_sha256$720000$PPhSN6ppQ25xCqOl27yoUI$ZGaxJiNkElEvz2WhBSEYfzcMBfvCcQTyZfh9FnuvUV8=",
    //         "username": "test_user",
    //         "role": 2
    //     },
    //     {
    //         "id": 7,
    //         "email": "ahmed@gamil.com",
    //         "first_name": "Test",
    //         "last_name": "User",
    //         "password": "pbkdf2_sha256$720000$R3iqcUZufokgwKiuaEw3qT$1mJZyktAIzB9Ed5gE5s4TD+siBY2l0RNoeNV5CdGH5U=",
    //         "username": "ahmed",
    //         "role": 1
    //     },
    //     {
    //         "id": 8,
    //         "email": "ahmed@gmail.com",
    //         "first_name": "Test",
    //         "last_name": "User",
    //         "password": "pbkdf2_sha256$720000$fbj5XlUd9SIBLwvnqSVQFQ$tZaEhoSdsVXCz/mMZU+iiHqFT0lwUa2kviCU4bA39eU=",
    //         "username": "ahmed1",
    //         "role": 1
    //     },]);
    const [lignes, setLignes] = useState([{
        // "id": 1,
        // "title": "Sample Line 2",
        // "daterealisation": "2024-04-01",
        // "datecreation": "2024-04-07T06:34:29.656434Z",
        // "technician": 2,
        // "status": "Progress"
    },]);
    //  const storedToken = localStorage.getItem('token');
    // if (!storedToken) {
    //     window.location.href = '/login'
    // }
    // const userConnected = localStorage.getItem('user')
    // if (userConnected.role != 1) {
    //     alert("this side is only for admin wait until other side got developed")
    //     window.location.href = '/login'

    // }
    const onSubmit = async (data) => {
        const date = new Date();
        let newLinge = {
            "title": data.titre,
            "daterealisation": data.dateRealisation,
        }
        if (data.assigne != "") {
            newLinge = {
                "title": data.titre,
                "daterealisation": data.dateRealisation,
                "technician": data.assigne
            }
        }
        lignes.push(newLinge)
        setLignes(lignes)
        axios.post(`${baseUrl}/lignes/`, newLinge, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }).then((res) => { handleClose() })

    };
    const onUpdateSubmit = data => {
        if (selectedLigne.status !== "On Hold") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ligne already on progress or done you can't update it ",
            });
            setUpdateModal(false)
        } else {
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
    }
    const handleClose = () => {
        //alert('closing');
        setModal(false);
    };
    const openModal = () => {
        setModal(true);
    };
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
    
    const assignToUser = async (ligne) => {
        if (ligne.status == "On Hold") {
            if (ligne.technician) {
                alert("ligne already signed")
            }

            const userOptions = {};
            users.forEach((user) => {
                userOptions[user.id] = `${user.first_name} ${user.last_name}`;
            });

            const { value: user } = await Swal.fire({
                title: "Assigne ligne to user :",
                input: "select",
                inputOptions: userOptions,
                inputPlaceholder: "Selcter un utilisateur",
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        //    this should be only to insert new assignement to table LingeAssignedTo cause you can't update primary key 
                        //which is composed with technecien and the ligne
                        //TODO: use axios to consume the endpoint of creating new assignement to technecien 
                        resolve()
                    });
                }
            });
            if (user) {
                Swal.fire(`user assigned successfully!`);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ligne already on progress or done you can't update it ",
            });
        }
    }
    const handleDeletLigne = async (id) => {
        return (
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    setLignes(lignes.filter(ligne => ligne.id !== id));
                    axios.delete(`${baseUrl}/lignes/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } }).then(() => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "User has been deleted.",
                            icon: "success"
                        });
                    })
                }
            })
        )
    }
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