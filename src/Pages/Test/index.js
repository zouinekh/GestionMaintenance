/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { baseUrl } from 'utils/baseUrl';
import Swal from 'sweetalert2'
import { BsCheckLg } from 'react-icons/bs';


function Test() {

    const [storedToken, setStoredToken] = useState('');
    const [modal, setModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [updateBanc, setUpdateBanc] = useState(false);
    const [assignModal, setAssignModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState({});
    const [selectedLigne, setSelectedLigne] = useState({});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [lignes, setLignes] = useState([]);
    const [ligneTests, setLigneTests] = useState([]);
    const [tests, setTests] = useState([]);
    const [Filtredligne, setFiltredligne] = useState([]);
    const [selectedLigneBanc, setSelectedLigneBancs] = useState({});

    const setSelectedLigneBanc = (event) => {
        const selectedLigneId = event.target.value;
        setSelectedLigneBancs(selectedLigneId);
      };
    const onSubmit = async (data) => {
        let newTest = {
            name: data.name
        };

        let Assign = {
            ligne: "",
            test: ""
        };

        if (data.ligne !== "") {
            Assign.ligne = data.ligne;
        }

        try {
            // Send the request to create a new Test object
            const response = await axios.post(`${baseUrl}/lignes/tests/`, newTest, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });

            if (response.status === 201 || response.status === 200) {
                const TestId = response.data.id;
                Assign.test = TestId;
                setTests([...tests, { ...newTest, id: TestId }]);
                Swal.fire({
                    icon: "success",
                    title: "Test created successfully",
                    text: "Test created successfully"
                });

                if (Assign.ligne !== "") {
                    const responseAssign = await axios.post(`${baseUrl}/lignes/ligne-tests/`, Assign, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });

                    if (responseAssign.status === 201 || responseAssign.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "Test Assigned to ligne successfully",
                            text: "Test Assigned to ligne successfully"
                        });
                        window.location.reload();
                    } else {
                        throw new Error('Error assigning test to ligne');
                    }
                }
            } else {
                throw new Error('Error creating test');
            }

        } catch (error) {
            // Handle errors
            console.error('Error creating test:', error);
            Swal.fire({
                icon: "error",
                title: "Error creating test...",
                text: error.message || error
            });
        } finally {
            handleClose();
        }
    };
    async function updateTest(data) {
        let newTest = {
            name: data.name,
        }
        try {
            const response = await axios.put(`${baseUrl}/lignes/tests/${selectedTest.id}/`, newTest, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
            if (response.status === 200) {
                // Update lignes state with the updated ligne
                setUpdateModal(false);
                setSelectedTest({});
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating Test:', error);
            Swal.fire({
                icon: "error",
                title: "Error updating Test...",
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
    const checkIfLigneAssignedToTest = (testId) => {
        return ligneTests.some(lt => lt.test === testId);
    };
    const handleDeletTest = async (id) => {
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
                        .delete(`${baseUrl}/lignes/tests/${id}/`, {
                            headers: { Authorization: `Bearer ${storedToken}` },
                        })
                        .then(() => {
                            setTests(tests.filter((test) => test.id !== id));
                            Swal.fire({
                                title: "Deleted!",
                                text: "Test has been deleted.",
                                icon: "success",
                            });
                        });
                }
            });
        } catch (err) {
            console.error('Error deleting Test:', err);
            Swal.fire({
                icon: "error",
                title: "Error deleting Test...",
                text: err,
            });
        }

    }
    const assignToTest = async (data) => {
        const assign = {
            "ligne": data.ligne,
            "test": selectedTest.id,

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
                window.location.reload();
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
    const handleTestSelect = (test) => {
        setSelectedTest(test);
        console.log(test);

        // Find the corresponding ligneTest
        const ligneTest = ligneTests.find(lt => lt.test === test.id);
        console.log(ligneTest);

        if (ligneTest) {
            // Find the associated ligne
            const ligne = lignes.find(ligne => ligne.id === ligneTest.ligne);
            console.log(ligne);

            if (ligne) {
                setSelectedLigne(ligne); // Set the selected ligne here
            } else {
                console.log("No corresponding ligne found");
            }
        } else {
            console.log("No ligneTest found for the test");
        }
    };

    const AddBanc = async (data) => {
        try {
            console.log('Selected Test ID:', selectedTest.id);
            console.log('Selected Ligne ID for Banc:', selectedLigneBanc);
            const test = Number(localStorage.getItem('test'));
            // Find the corresponding ligneTest
            const ligneTest = ligneTests.find(lt => lt.test === selectedTest.id && lt.ligne === Number(selectedLigneBanc));
            console.log('Ligne Test for Banc:', ligneTest);
            if (!ligneTest) {
                throw new Error('LigneTest not found for the selected test and ligne');
            }
            const ligneTestId = ligneTest.id;
    
            const newBanc = {
                ligne_test: ligneTestId,
                banc_name: data.banc_name,
                validation_date: data.validation_date,
                test:test
            };
    
            const response = await axios.post(`${baseUrl}/lignes/bancs/`, newBanc, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
    
            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Banc created successfully",
                    text: "Banc created successfully"
                });
                //window.location.reload();
            } else {
                throw new Error('Error creating banc');
            }
        } catch (error) {
            console.error('Error creating banc:', error);
            Swal.fire({
                icon: "error",
                title: "Error creating banc...",
                text: error.message || error
            });
        } finally {
            setUpdateBanc(false);
        }
    };
    const getAllLignesWithTest = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

        const responseLigneTests = await axios.get(`${baseUrl}/lignes/ligne-tests/test/${id}/`, config);
        const ligneTestsData = responseLigneTests.data;
        console.log(ligneTestsData);

        // Extract unique ligne IDs from ligneTestsData
        const ligneIds = [...new Set(ligneTestsData.map(ligneTest => ligneTest.ligne))];
        console.log(ligneIds);
        // Fetch all lignes data
        const responseLignes = await axios.get(`${baseUrl}/lignes/`, config);
        const lignesData = responseLignes.data;
        console.log(lignesData);
        // Filter lignes based on the extracted ligne IDs
        const filtredLignes = lignesData.filter(ligne => ligneIds.includes(ligne.id));
        console.log(filtredLignes);
        // Set the filtered lignes to state
        setFiltredligne(filtredLignes);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }
    
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setStoredToken(token || '');
            console.log(storedToken);
        }
        getAllLignes();
        getAllLigneTests();
        getAllTests();
        const filtered = lignes.filter(ligne =>
            ligneTests.some(ligneTest => ligneTest.ligne === ligne.id)
        );
        setFiltredligne(filtered);
    }, []);
    return (

        <>
            <div style={{ padding: 23, marginTop: 22 }}>
                <div style={{ paddingBottom: 22 }}>
                    <ActionButton
                        Icon={AiOutlinePlusCircle}
                        label="Ajouter nouveau test"
                        onClick={openModal}

                    />
                </div>
                <div class="table-container">
                    <table class="custom-table">
                        <colgroup>
                            <col style={{ width: "5%" }} /> {/* ID */}
                            <col style={{ width: "15%" }} /> {/* Titre de ligne */}
                            <col style={{ width: "10%" }} /> {/* Date de Realisation prev */}
                            <col style={{ width: "10%" }} /> {/* Edit */}
                            <col style={{ width: "10%" }} /> {/* Assigné à */}
                            <col style={{ width: "10%" }} /> {/* Assigné à */}
                            <col style={{ width: "10%" }} /> {/* Supprimer */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nom du test</th>
                                <th scope="col">Nombre du banc</th>
                                <th scope="col">edit: </th>
                                <th scope="col">Assigné à  </th>
                                <th scope="col"> bancs </th>
                                <th scope="col">supprimer   </th>

                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test, index) => (
                                <tr key={index}>
                                    <td>{test.id}</td>
                                    <td>{test.name}</td>
                                    <td>{test.nbr_banc}</td>
                                    <td onClick={(e) => {
                                        setSelectedTest(test);
                                        setUpdateModal(true);
                                    }}>Edit</td>
                                    <td onClick={() => {
                                        setSelectedTest(test);
                                        setAssignModal(true);
                                    }}>
                                        {checkIfLigneAssignedToTest(test.id) ? 'Assigned' : 'Not Assigned'}
                                    </td>
                                    <td onClick={(e) => {
                                        if (checkIfLigneAssignedToTest(test.id)) {
                                            setSelectedTest(test);
                                            handleTestSelect(test);
                                            localStorage.setItem("test", test.id);
                                            getAllLignesWithTest(test.id);
                                            setUpdateBanc(true);
                                        } else {
                                            Swal.fire({
                                                icon: "error",
                                                title: "Impossible",
                                                text: "Vous ne pouvez pas ajouter des bancs si le test n'est pas assigné.",
                                            });
                                        }
                                    }}>Ajouter des bancs</td>
                                    <td onClick={(e) => handleDeletTest(test.id)}>Supprimer</td>
                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div>
                {modal ? (
                    <section className={"modal-bg"}>
                        <div className={"modal-container"}>
                            <div className={"modal-header"}>
                                <h3 className={"modal-heading"}>Ajouter une nouvelle test</h3>
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
                                            {...register("name", { required: true })}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                        <span>nom du test</span>
                                        {errors.name && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">nom du test requis</p>}
                                    </label>

                                    <div className="dropdown">
                                        <select {...register("ligne")} className="dropbtn">
                                            <option value="" disabled selected hidden>Assigné à :</option>
                                            <option value=""  >aucun ligne</option>
                                            {
                                                lignes.map((ligne, key) => {
                                                    return (
                                                        <option key={key} value={ligne.id}>{`${ligne.title + " " + ligne.sem}`}</option>

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
                                <h3 className={"modal-heading"}>Modifier Test</h3>
                                <button
                                    onClick={(e) => setUpdateModal(false)}
                                    className={"close-btn"}
                                >
                                    X
                                </button>
                            </div>
                            <div className={"modal-body"}>
                                <form className="form" onSubmit={handleSubmit(updateTest)}>
                                    <div className="flex">
                                        <label>
                                            <input
                                                {...register("id")}
                                                placeholder=""
                                                type="text"
                                                className="input"
                                                disabled
                                            />
                                            <span>{selectedTest.id}</span>
                                        </label>
                                    </div>

                                    <label>
                                        <input
                                            {...register("name", { required: true })}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                        <span>{selectedTest.name}</span>
                                        {errors.name && <p style={{ color: "red", padding: 3, fontSize: 14, fontWeight: "400" }} className="error-message">name requis</p>}
                                    </label>

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
                                        <input
                                            {...register("test")}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                            disabled
                                        />
                                        <span>{selectedTest.name}</span>
                                    </label>
                                    <label>
                                        <input
                                            {...register("periodicity", { required: true })}
                                            placeholder="Periodicity ( Hebdo ou annuelle )"
                                            type="text"
                                            className="input"
                                        />
                                        <span>Periodicity</span>
                                        {errors.periodicity && <p className="error-message">Periodicity requis</p>}
                                    </label>
                                    { }
                                    <button type="submit" className="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : null}
                {updateBanc ? (
                    <section className={"modal-bg"}>
                        <div className={"modal-container"}>
                            <div className={"modal-header"}>
                                <h3 className={"modal-heading"}>Ajouter un nouveau banc</h3>
                                <button
                                    onClick={(e) => setUpdateBanc(false)}
                                    className={"close-btn"}
                                >
                                    X
                                </button>
                            </div>
                            <div className={"modal-body"}>
                                <style>
                                    {`
                                    .flex-row {
                                        display: flex;
                                        flex-direction: row;
                                        gap: 20px; /* Adjust gap as needed */
                                    }
                                    .error-message {
                                        color: red;
                                        padding: 3px;
                                        font-size: 14px;
                                        font-weight: 400;
                                    }
                                    `}
                                </style>
                                <form className="form" onSubmit={handleSubmit(AddBanc)}>
                                    <div className="flex-row">
                                        <label>
                                            <input
                                                value={selectedTest.name}
                                                placeholder=""
                                                type="text"
                                                className="input"
                                                disabled
                                            />
                                        </label>
                                        <label>
                                            <select {...register("ligne", { required: true })} className="input" onChange={setSelectedLigneBanc}>
                                                {Filtredligne.map((ligne, key) => (
                                                    <option key={key} value={ligne.id}>{ligne.title}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                    <label>
                                        <input
                                            {...register("banc_name", { required: true })}
                                            placeholder="Nom du banc"
                                            type="text"
                                            className="input"
                                        />
                                        <span>Nom du Banc</span>
                                        {errors.banc_name && <p className="error-message">Nom du banc requis</p>}
                                    </label>
                                    <label>
                                        <input
                                            {...register("validation_date", { required: true })}
                                            placeholder="Date de validation"
                                            type="date"
                                            className="input"
                                        />
                                        <span>Date de Realisation préventif</span>
                                        {errors.validation_date && <p className="error-message">Date de validation requise</p>}
                                    </label>
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

export default Test;