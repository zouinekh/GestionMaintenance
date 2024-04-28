import ActionButton from "@aio/components/ActionButton";
import HeaderSection from "@aio/components/HeaderSection";
import InlineButton from "@aio/components/InlineButton";
import TextButton from "@aio/components/TextButton";
import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useForm } from 'react-hook-form';
import axios from "axios";
import Swal from 'sweetalert2'
import { baseUrl } from "utils/baseUrl";
import { headers } from "next.config";

const Profile = (props) => {
    const [users, setUsers] = useState([{}]);

    async function getUsers() {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.get(`${baseUrl}/auth/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            const activatedUsers = response.data.filter(user => user.is_active === true);
            console.log(activatedUsers);
            setUsers(activatedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            window.location.href = '/login'
        }
        const userConnectedString = localStorage.getItem('user');
        const userConnected = JSON.parse(userConnectedString);
        console.log(userConnected.role);
        if (userConnected.role != 1) {
            alert("this side is only for admin wait until other side got developed")
            window.location.href = '/login'

        }
        getUsers();
    }, []);

    const handlePageChange = (pageNumber) => {
        getUsers(pageNumber);
    };


    // if (!storedToken) {
    //     window.location.href = '/login'
    // }
    // const userConnected = localStorage.getItem('user')
    // if (userConnected.role != 1) {
    //     alert("this side is only for admin wait until other side got developed")
    //     window.location.href = '/log'
    // }
    const [modal, setModal] = useState(false);
    const [updateModal, setupdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const handleClose = () => {
        //alert('closing');
        setModal(false);
    };
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const openModal = () => {
        setModal(true);
    };
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [confirmMdpError, setconfirmMdpError] = useState(false);
    const [RoleError, setRoleError] = useState(false);

    const onSubmit = data => {
        console.log(data)
        if (data.password !== data.confirmPassword) {
            setconfirmMdpError(true);
        } else if (selectedValue === "") {
            setRoleError(true);
            alert("Vous devez sélectionner un rôle pour l'utilisateur");
        } else {
            const token = localStorage.getItem('token');
            console.log(selectedValue);
            console.log(data);
            axios.post(`${baseUrl}/auth/adduser/`, {
                username: data.email,
                email: data.email,
                password: data.password,
                first_name: data.prenom,
                last_name: data.nom,
                role: selectedValue
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                // Handle success response
                Swal.fire({
                    icon: 'success',
                    title: 'User added',
                    text: response.data.message, // Display the message from the backend
                    showConfirmButton: false,
                    timer: 1500
                });
                handleClose();
            }).catch(error => {
                // Handle error response
                if (error.response) {
                    // The request was made and the server responded with a status code that falls out of the range of 2xx
                    if (error.response.status === 401) {
                        // Handle 401 Unauthorized error
                        const errorMessage = error.response.data.detail || "Unauthorized access";
                        alert(errorMessage);
                    } else if (error.response.status === 400) {
                        // Handle other error responses
                        alert(error.response.data.message || " user with this email already exists.");
                    }
                    else if (error.response.status === 500) {
                        // Handle other error responses
                        alert(error.response.data.message || " Server Error.");
                    }
                } else {
                    // The request was made but no response was received
                    alert("Something went wrong. Please try again later.");
                }
            });
        }
    };

    const handleSubmitUpdateModal = (data) => {
        const token = localStorage.getItem('token');
        const updatedUserData = {
            username: data.email || selectedUser.email,
            email: data.email || selectedUser.email,
            first_name: data.first_name || selectedUser.first_name,
            last_name: data.last_name || selectedUser.last_name,
            password: data.password,
            confirmPassword: data.confirmPassword,
            role: selectedValue || selectedUser.role
        };

        axios.put(`${baseUrl}/auth/update-user/${selectedUser.id}/`, updatedUserData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // Handle success response
                Swal.fire({
                    icon: 'success',
                    title: 'User updated',
                    text: response.data.message, // Display the message from the backend
                    showConfirmButton: false,
                    timer: 1500
                });
                // Close the update modal
                setupdateModal(false);
                // Refresh the user list
                getUsers();
            })
            .catch(error => {
                // Handle error response
                if (error.response) {
                    // The request was made and the server responded with a status code that falls out of the range of 2xx
                    if (error.response.status === 401) {
                        // Handle 401 Unauthorized error
                        const errorMessage = error.response.data.detail || "Unauthorized access";
                        alert(errorMessage);
                    } else if (error.response.status === 400) {
                        // Handle other error responses
                        alert(error.response.data.message || " user with this email already exists.");
                    }
                    else if (error.response.status === 500) {
                        // Handle other error responses
                        alert(error.response.data.message || " Server Error.");
                    }
                } else {
                    // The request was made but no response was received
                    alert("Something went wrong. Please try again later.");
                }
            });
    };

    const CloseUpdateModalUi = () => {
        setupdateModal(!updateModal)
    }
    function handleDeleteUser(id) {
        const token = localStorage.getItem('token'); // Define the token variable here
        return (

            // Handle success response
            Swal.fire({
                title: "Es-tu sûr?",
                text: "Vous ne pourrez pas revenir en arrière!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, effacer-le!"
            }).then((result) => {
                if (result.isConfirmed) {

                    axios.delete(`${baseUrl}/auth/delete-user/${id}/`, // Pass the user ID as part of the URL path
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(response => {

                            setUsers(users.filter(user => user.id !== id));
                            Swal.fire({
                                title: "effacer!",
                                text: "L'utilisateur a été effacé.",
                                icon: "success"
                            });
                        })
                }

            })
                .catch(function (error) {
                    // Handle error response
                    if (error.response) {
                        // The request was made and the server responded with a status code that falls out of the range of 2xx
                        if (error.response.status === 401) {
                            // Handle 401 Unauthorized error
                            const errorMessage = error.response.data.detail || "Unauthorized access";
                            alert(errorMessage);
                        } else if (error.response.status === 400) {
                            // Handle other error responses
                            alert(error.response.data.message || " user with this email already exists.");
                        } else {
                            // Handle other error responses
                            console.log(error.response);
                            alert(error.response.data.message || " Server Error.");
                        }
                    } else if (error.request) {
                        // The request was made but no response was received
                        alert("Something went wrong. Please try again later.");
                    }
                }
                )
        )
    }
    return (
        <>
            {/* <HeaderSection
                heading={'Hello Rizwan'}
                subHeading={'Lets check your stats today!'}
            /> */}
            <div style={{ padding: 23, marginTop: 22 }}>
                <div style={{ paddingBottom: 22 }}>
                    <ActionButton
                        Icon={AiOutlinePlusCircle}
                        label="Ajouter un utilisateur"
                        onClick={openModal}
                    />
                </div>
                <div class="table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th scope="col">id</th>
                                <th scope="col">Email</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Prenom</th>
                                <th scope="col">Role</th>
                                <th scope="col">edit: </th>
                                <th scope="col">supprimer  : </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, key) => {
                                    console.log(user)
                                    return (
                                        user.role != 1 ?
                                            <tr key={key} >
                                                <td>{user.id}</td>
                                                <td>{user.email}</td>
                                                <td>{user.first_name}</td>
                                                <td>{user.last_name}</td>
                                                <td>{user.role == 2 ? "Techneicien" : "validateur"}</td>
                                                <td onClick={(e) => {
                                                    setSelectedUser(user)
                                                    setupdateModal(true)
                                                }}>Edit</td>
                                                <td onClick={(e) => { handleDeleteUser(user.id) }}><a href="#" style={{ color: "red" }}>Effacer</a></td>
                                            </tr> : <></>)
                                })
                            }


                        </tbody>
                    </table>
                </div>
                {modal ? (
                    <section className={"modal-bg"}>
                        <div className={"modal-container"}>
                            <div className={"modal-header"}>
                                <h3 className={"modal-heading"}>Ajouter un utilisateur</h3>
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
                                            <input {...register("nom", { required: true })} type="text" placeholder="" className="input" />
                                            <span>Nom</span>
                                            {errors.nom && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Nom requis</p>}

                                        </label>

                                        <label>
                                            <input {...register("prenom", { required: true })} type="text" placeholder="" className="input" />
                                            <span>Prénom</span>
                                            {errors.prenom && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Prénom requis</p>}

                                        </label>
                                    </div>
                                    <label>
                                        <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} type="email" placeholder="" className="input" />
                                        <span>Email</span>
                                        {errors.email && errors.email.type === "required" && (
                                            <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Email requis</p>
                                        )}
                                        {errors.email && errors.email.type === "pattern" && (
                                            <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Format d`email invalide</p>
                                        )}
                                    </label>


                                    <label>
                                        <input {...register("password", { required: true, minLength: 8 })} type="password" placeholder="" className="input" />
                                        <span>Mot de passe</span>
                                        {errors.password && errors.password.type === "required" && (
                                            <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Mot de passe requis</p>
                                        )}
                                        {errors.password && errors.password.type === "minLength" && (
                                            <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Le mot de passe doit comporter au moins 8 caractères</p>
                                        )}
                                    </label>


                                    <label>
                                        <input {...register("confirmPassword", { required: true })} type="password" placeholder="" className="input" />
                                        <span>Confirm Mot de pass</span>
                                        {confirmMdpError ? <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Le mot de passe ne correspond pas</p> : ""}
                                    </label>

                                    <div className="dropdown">
                                        <select className="dropbtn" value={selectedValue} onChange={handleChange}>
                                            <option value="" disabled selected hidden>Role :</option>
                                            <option value="2">Technecien</option>
                                            <option value="3">Validateur </option>
                                        </select>
                                    </div>
                                    {RoleError ? <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Vous devez selectionner un role pour l utilisateur</p> : ""}
                                    <button type="submit" className="submit">Submit</button>
                                </form>
                            </div>

                        </div>
                    </section>
                ) : null}
                {
                    updateModal ?
                        <section className={"modal-bg"}>
                            <div className={"modal-container"}>
                                <div className={"modal-header"}>
                                    <h3 className={"modal-heading"}>Modifier lutilisateur</h3>
                                    <button
                                        onClick={(e) => { setupdateModal(false) }}
                                        className={"close-btn"}
                                    >
                                        X
                                    </button>
                                </div>
                                <div className={"modal-body"}>
                                    <form className="form" onSubmit={(e) => handleSubmitUpdateModal(onSubmit)}>
                                        <div className="flex">
                                            <label>
                                                <input {...register("nom", { required: true })} type="text" placeholder={selectedUser.last_name} className="input" />
                                                <span>nom</span>
                                                {errors.nom && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Nom requis</p>}

                                            </label>

                                            <label>
                                                <input {...register("prenom", { required: true })} type="text" placeholder={selectedUser.first_name} className="input" />
                                                <span>prenom</span>
                                                {errors.prenom && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Prénom requis</p>}

                                            </label>
                                        </div>
                                        <label>
                                            <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} type="email" placeholder={selectedUser.email} className="input" />
                                            <span>email</span>
                                            {errors.email && errors.email.type === "required" && (
                                                <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Email requis</p>
                                            )}
                                            {errors.email && errors.email.type === "pattern" && (
                                                <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Format d`email invalide</p>
                                            )}
                                        </label>


                                        <label>
                                            <input {...register("password", { required: true, minLength: 8 })} type="password" placeholder="" className="input" />
                                            <span>Mot de passe</span>
                                            {errors.password && errors.password.type === "required" && (
                                                <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Mot de passe requis</p>
                                            )}
                                            {errors.password && errors.password.type === "minLength" && (
                                                <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Le mot de passe doit comporter au moins 8 caractères</p>
                                            )}
                                        </label>


                                        <label>
                                            <input {...register("confirmPassword", { required: true })} type="password" placeholder="" className="input" />
                                            <span>Confirm Mot de pass</span>
                                            {confirmMdpError ? <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Le mot de passe ne correspond pas</p> : ""}
                                        </label>

                                        <div className="dropdown">
                                            <select className="dropbtn" value={selectedValue} onChange={handleChange}>
                                                <option value="" disabled selected hidden>Role :</option>
                                                <option value="2">Technecien</option>
                                                <option value="3">Validateur </option>
                                            </select>
                                        </div>
                                        {RoleError ? <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }}>Vous devez selectionner un role pour l utilisateur</p> : ""}
                                        <button type="submit" className="submit">Submit</button>
                                    </form>
                                </div>

                            </div>
                        </section> : null

                }
            </div>
        </>


    );
}

export default Profile;