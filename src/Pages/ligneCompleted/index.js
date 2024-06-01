/* eslint-disable react-hooks/rules-of-hooks */
import ActionButton from '@aio/components/ActionButton';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiFillWarning, AiOutlinePlusCircle } from 'react-icons/ai';
import { baseUrl } from 'utils/baseUrl';
import Swal from 'sweetalert2'
import { useRouter } from 'next/router';
import styles from './ModalStyles.module.css';
import { CiWarning } from "react-icons/ci";

export default function LigneAssigned() {
    const [storedToken, setStoredToken] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLigne, setSelectedLigne] = useState({});
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

            for (const ligneTest of ligneTestsData) {
                const bancsResponse = await axios.get(`${baseUrl}/lignes/banc/ligne-tests/${ligneTest.id}/`, config);
                setFiltredBancs(bancsResponse.data);
            }

            setFiltredTests(filteredTests);
            setAssignModal(true);
        } catch (error) {
            console.error('Error fetching ligne tests, tests, and bancs:', error);
        }
    };


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setStoredToken(token || '');
            console.log(storedToken);
        }
        getAllLignes();
        getAllLigneTests();
        getAllTests();
        getAllBancs();
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
                                            <td onClick={() => {
                                            handleLigneClick(ligne.id);
                                            setAssignModal(true);
                                        }}>{ligne.title}</td>
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
                                        <th scope="col">Date réalisation </th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Commentaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Filtredtests.map((test, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '5px' }}>{test.name}</td>
                                            <td style={{ padding: '5px' }}>
                                                {/* Map through bancs array for each test */}
                                                {Filtredbancs.map((banc, bIndex) => (
                                                    <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.banc_name}</div>
                                                ))}
                                            </td>
                                            {/* Render relevant information for each banc */}
                                            <td style={{ padding: '5px' }}>
                                                {Filtredbancs.map((banc, bIndex) => (
                                                    <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.validation_date}</div>
                                                ))}
                                            </td>
                                            <td style={{ padding: '5px' }}>
                                                {Filtredbancs.map((banc, bIndex) => (
                                                    <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.validated_by_technician ? "validated" : "not validated"}</div>
                                                ))}
                                            </td>
                                            <td style={{ padding: '5px' }}>
                                                {Filtredbancs.map((banc, bIndex) => (
                                                    <div key={bIndex} style={{ marginBottom: '5px' }}>{banc.comment || "Pas de commentaire"}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    )
}

