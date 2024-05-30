import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseUrl } from 'utils/baseUrl';

const TestTechnicien = () => {
    const router = useRouter();
    const { id } = router.query;
    const [ligne, setLigne] = useState(null);
    const [tests, setTests] = useState([]);
    const [bancs, setBancs] = useState([]);

    useEffect(() => {
        if (id) {
            fetchLigneDetails(id);
        }
    }, [id]);

    const fetchLigneDetails = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const ligneResponse = await axios.get(`${baseUrl}/lignes/${id}`, config);
            setLigne(ligneResponse.data);

            const testsResponse = await axios.get(`${baseUrl}/tests/?ligne=${id}`, config);
            setTests(testsResponse.data);

            const bancsResponse = await axios.get(`${baseUrl}/bancs/?ligne=${id}`, config);
            setBancs(bancsResponse.data);
        } catch (error) {
            console.error('Error fetching ligne details:', error);
        }
    };

    if (!ligne) return <div>Loading...</div>;

    return (
        <div>
            <h1>{ligne.title}</h1>
            <h2>Tests</h2>
            <ul>
                {tests.map((test) => (
                    <li key={test.id}>{test.name}</li>
                ))}
            </ul>
            <h2>Bancs</h2>
            <ul>
                {bancs.map((banc) => (
                    <li key={banc.id}>{banc.banc_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TestTechnicien;
