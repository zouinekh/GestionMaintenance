/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiFillWarning, AiOutlinePlusCircle } from 'react-icons/ai';
import { baseUrl } from 'utils/baseUrl';
import Swal from 'sweetalert2'
import { GrValidate } from "react-icons/gr";
import { useRouter } from 'next/router';
import styles from './ModalStyles.module.css';

import { CiWarning } from "react-icons/ci";

export default function LigneAssigned() {
    const [storedToken, setStoredToken] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLigne, setSelectedLigne] = useState({});
    const [selectedTest, setSelectedTest] = useState({});
    const [updateModal, setUpdateModal] = useState(false)
    const [tests, setTests] = useState([]);
    const [bancs, setBancs] = useState([]);
    const [Filtredtests, setFiltredTests] = useState([]);
    const [Filtredbancs, setFiltredBancs] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [assignedError, setAssignedError] = useState(false);
    const [users, setUsers] = useState([]);
    const [Alllignes, setAllLignes] = useState([]);
    const [lignes, setLignes] = useState([]);
    const [ligneTests, setLigneTests] = useState([]);
    const [assignModal, setAssignModal] = useState(false); // Renamed from 'Modal' to 'assignModal'
    const router = useRouter();
    
    function confirmLigne(ligne) {
        Swal.fire({
            title: "Do you want to Valide this ligne?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const body = {
                    "title": ligne.title,
                    "status": "completed",  // Update the status
                }
                axios.put(`${baseUrl}/lignes/${ligne.id}`, body, config).then((res) => {
                    setLignes(prevLignes => prevLignes.filter(l => l.id !== ligne.id));
                    Swal.fire("Saved!", "", "success");
                })
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

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
    const getAllBancs = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${baseUrl}/lignes/bancs/`, config);
            setBancs(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };
    const checkIfLigneAssignedToTest = (ligneId) => {
        return ligneTests.some(lt => lt.ligne === ligneId);
    };
    const getAllLignes = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${baseUrl}/lignes/`, config);
            const lignes = response.data;
            setAllLignes(lignes);
            const filteredLignes = response.data.filter(ligne => ligne.status === 'en_cours');
            setLignes(filteredLignes);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }
    };
    const handleLigneClick = async (ligneId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch ligne tests associated with the selected ligne
            const ligneTestsResponse = await axios.get(`${baseUrl}/lignes/ligne/${ligneId}/`, config);
            const ligneTestsData = ligneTestsResponse.data;

            // Extract the test IDs associated with the ligneTestsData
            const testIds = ligneTestsData.map((ligneTest) => ligneTest.test);

            // Fetch all tests associated with these testIds
            const filteredTests = tests.filter((test) => testIds.includes(test.id));
            setFiltredTests(filteredTests);
            // for (const ligneTest of ligneTestsData) {
            //     const bancsResponse = await axios.get(`${baseUrl}/lignes/banc/ligne-tests/${ligneTest.id}/`, config);
            //     setFiltredBancs(bancsResponse.data);
            // }
            // 
            // setAssignModal(true);
        } catch (error) {
            console.error('Error fetching ligne tests, tests, and bancs:', error);
        }
    };

    const saveComment = async (comment, banc) => {
        const token = localStorage.getItem('token');
        const banc_id = localStorage.getItem('banc_id');
        const ligne_test = localStorage.getItem('ligne_test');
        const banc_name = localStorage.getItem('banc_name');
        const user = localStorage.getItem('id');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const currentDate = new Date();

        // Get year, month, and day
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const day = currentDate.getDate().toString().padStart(2, '0');

        // Format the date
        const formattedDate = `${year}-${month}-${day}`;
        const body = {
            "ligne_test": ligne_test,
            "banc_name": banc_name,
            "validated_by_validator": true,
            "validation_date": formattedDate,
            "comment": comment.comment,
            "test":selectedTest.id,
            "role":1,
            "technician":user
        };
        axios.put(`${baseUrl}/lignes/bancs/${banc_id}/`, body, config).then((res) => {
            setUpdateModal(false);
            Swal.fire("Saved!", "", "success");
        }).catch((error) => {
            console.error('Error saving comment:', error);
        });
    };


    const validateBanc = async (banc) => {
        Swal.fire({
            title: "Do you want to Valide this banc?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.isConfirmed) {
                saveComment("", banc);
            }
        });
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
            //const filteredUsers = response.data.filter(user => user.role === 1);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching lignes:', error);
        }

    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setStoredToken(token || '');
        }
        getAllLignes();
        getAllLigneTests();
        getAllTests();
        getAllBancs();
        getUsers();
    }, []);

    return (
        <>
            <div style={{ padding: 23, marginTop: 22 }}>
                <div className="table-container">
                    <table className="custom-table">
                        <colgroup>
                            <col style={{ width: "10%" }} /> {/* ID */}
                            <col style={{ width: "15%" }} /> {/* Titre de ligne */}
                            <col style={{ width: "12%" }} /> {/* Date de Realisation prev */}
                            <col style={{ width: "13%" }} /> {/* Date de creation */}
                            <col style={{ width: "12%" }} /> {/* Edit */}
                            <col style={{ width: "15%" }} /> {/* Assigné à */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Titre de ligne</th>
                                <th scope="col">Date de affectation</th>
                                <th scope="col">Status</th>
                                <th scope="col">SEMAINE</th>
                                <th scope="col">confirmed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lignes.length > 0 ? (
                                lignes.map((ligne, index) => (
                                    <tr key={index} style={{ backgroundColor: "#FFC55A", color: "black" }} >
                                        <td>{ligne.id}</td>
                                        <td onClick={() => {
                                            handleLigneClick(ligne.id);
                                            setAssignModal(true);
                                            localStorage.setItem("ligne_id", ligne.id);
                                        }}>{ligne.title}</td>
                                        <td>{new Date(ligne.datecreation).toLocaleDateString()}</td>
                                        <td>{ligne.status}</td>
                                        <td>{ligne.sem}</td>
                                        <td onClick={(e) => { e.stopPropagation(); confirmLigne(ligne) }}>
                                            <div style={{ fontWeight: "bold", cursor: 'pointer', fontSize: 13, color: "black" }}> confirm</div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No lignes Assigned</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {assignModal ? (
                <section className={styles['modal-bg']}>
                    <div className={styles['modal-container']}>
                        <div className={styles['modal-header']}>
                            <h3 className={styles['modal-heading']}>Liste des tests</h3>
                            <button onClick={() => setAssignModal(false)} className={"close-btn"}>X</button>
                        </div>
                        <div className={styles['modal-body']}>
                            <table className={styles['custom-table']}>
                                <thead>
                                    <tr>
                                        <th scope="col">Test</th>
                                        <th scope="col">Bancs</th>
                                        <th scope="col">Date Validation </th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Commentaire</th>
                                        <th scope="col">Techincien</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Filtredtests.map((test, index) => {
                                        const filtredBancsForTest = bancs.filter(banc => banc.test === test.id);
                                        console.log(test);
                                        console.log(index);
                                        console.log(filtredBancsForTest);

                                        return (
                                            <tr key={index}>
                                                <td style={{ padding: '5px' }}>{test.name}</td>
                                                <td style={{ padding: '5px' }}>
                                                    {filtredBancsForTest.map((banc, bIndex) => (
                                                        <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.banc_name}</div>
                                                    ))}
                                                </td>
                                                {/* Render relevant information for each banc */}
                                                <td style={{ padding: '5px' }}>
                                                    {filtredBancsForTest.map((banc, bIndex) => (
                                                        <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.validation_date}</div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '5px' }}>
                                                    {filtredBancsForTest.map((banc, bIndex) => (
                                                        <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.validated_by_technician ? "validated" : "not validated"}</div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '5px' }}>
                                                    {filtredBancsForTest.map((banc, bIndex) => (
                                                        <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.comment || "Pas de commentaire"}</div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '5px' }}>
                                                    {filtredBancsForTest.map((banc, bIndex) => (
                                                        <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.validated_by_technician ? (
                                                            <>
                                                              Validated by: {users.find(user => user.id === banc.technician)?.email || 'Unknown'}
                                                            </>
                                                          ) : (
                                                            "Not validated"
                                                          )}</div>
                                                    ))}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {/* Render buttons for each banc */}
                                                    {filtredBancsForTest.map((banc, bIndex) => (
                                                        <div key={bIndex} style={{ marginBottom: '5px' }}>
                                                            <button
                                                                onClick={(e) => {
                                                                    localStorage.setItem("banc_id", banc.id)
                                                                    localStorage.setItem("banc_name", banc.banc_name)
                                                                    localStorage.setItem("ligne_test", banc.ligne_test)
                                                                    setSelectedTest(test);
                                                                    setAssignModal(false);
                                                                    validateBanc(banc);
                                                                    //setUpdateModal(true);
                                                                }}
                                                                style={{
                                                                    backgroundColor: banc.validated_by_technician ? 'blue' : 'gray',
                                                                    color: 'white',
                                                                    padding: '5px 10px',
                                                                    borderRadius: '5px',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }}
                                                                disabled={!banc.validated_by_technician}
                                                            >
                                                                Valider
                                                            </button>
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
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
                            <form className="form" onSubmit={handleSubmit(saveComment)}>
                                <div className="flex">
                                    <label>
                                        <textarea
                                            {...register("comment")}
                                            placeholder=""
                                            type="text"
                                            className="input"
                                        />
                                    </label>
                                </div>
                                <button type="submit" className="submit">Submit</button>
                            </form>
                        </div>

                    </div>
                </section>
            ) : null}


        </>
    )
}

