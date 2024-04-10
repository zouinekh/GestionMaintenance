/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';
import InlineButton from '@aio/components/InlineButton';
import Modal from '@aio/components/Modal';
import Table from '@aio/components/Table';
import TextButton from '@aio/components/TextButton';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaCloudDownloadAlt } from 'react-icons/fa';


function ligne() {
    const [modal, setModal] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [assignedError, setAssignedError] = useState(false);

    const onSubmit = data => {

        console.log(data)

    };
    const handleClose = () => {
        //alert('closing');
        setModal(false);
    };

    const openModal = () => {
        setModal(true);
    };

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
                                <th scope="col">Assigné à : </th>
                                <th scope="col">edit: </th>
                                <th scope="col">supprimer  : </th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Apple MacBook Pro 17</td>
                                <td>Silver</td>
                                <td>Laptop</td>
                                <td>$2999</td>
                                <td><a href="#">Edit</a></td>
                                <td><a href="#">Edit</a></td>
                                <td><a href="#">Edit</a></td>

                            </tr>

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
                                            <option value="option1">Option 1</option>
                                            <option value="option2">Option 2</option>
                                            <option value="option3">Option 3</option>
                                        </select>
                                    </div>

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