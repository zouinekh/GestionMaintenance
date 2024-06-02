import { useEffect, useRef, useState } from "react";
import Card from "@aio/components/Card";
import Modal from "@aio/components/Modal";
import styles from "./Home.module.css";
import { baseUrl } from 'utils/baseUrl';
import DoughnutChartExample from "../../components/DoughnutChartExample";
import HeaderSection from "@aio/components/HeaderSection";
import DataCard from "@aio/components/DataCard";
import { SlCalender } from "react-icons/sl";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Section from "@aio/components/Section";

import BillingHistory from "../../components/BillingHistory";
import Paragraph from "../../components/Paragraph";
import BarChartExample from "../../components/BarChartExample";
import ActionButton from "@aio/components/ActionButton";
import Table from "@aio/components/Table";
import {
  FaCloudDownloadAlt,
  FaRegFilePdf,
  FaLongArrowAltDown,
} from "react-icons/fa";
import axios from 'axios';

export default function Dashboard() {
  const [modal, setModal] = useState(false);

    const downloadPdf = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Check token value
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob' // Set responseType to 'blob' to receive binary data
        };
        const response = await axios.get(`${baseUrl}/lignes/pdf`, config);
  
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });
  
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'lignes.pdf'); // Set the filename for download
        document.body.appendChild(link);
  
        // Trigger a click event to simulate download
        link.click();
  
        // Clean up: remove the link and revoke the temporary URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error fetching lignes:', error);
      }
    };

    const downloadPdfLigne = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Check token value
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob' // Set responseType to 'blob' to receive binary data
        };
        const response = await axios.get(`${baseUrl}/lignes/pdf/all`, config);
  
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });
  
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'lignesTest.pdf'); // Set the filename for download
        document.body.appendChild(link);
  
        // Trigger a click event to simulate download
        link.click();
  
        // Clean up: remove the link and revoke the temporary URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error fetching lignes:', error);
      }
    };

  const handleClose = () => {
    //alert('closing');
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  }

  const handleSubmit = () => {
    alert('Submit is working..!');
    handleClose();
  }
  const styles = {
    section: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '20px',
      padding: '20px',
    },
    card: {
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '45%',
    },
    label: {
      fontSize: '16px',
      marginBottom: '10px',
      display: 'block',
    },
  };

  return (
    <>
      <HeaderSection
        heading={"Dashboard"}
        subHeading={"Welcome to elyes dashboard"}
      // rightItem={() => (
      //   <ActionButton
      //     onClick={() => setModal(true)}
      //     Icon={AiOutlinePlusCircle}
      //     label="Add New User"
      //   />
      // )}
      />


      <Section>
        <DataCard
          label={"Total Lines"}
          value={"2320"}
          percentageValue={56.4}
          inverse={true}
        />
        <DataCard
          label={"Nombre des techniciens"}
          value={"45"}

        />
        <DataCard
          label={"Nombre des lines valider"}
          value={"43,54,111"}
          percentageValue={10.89}
        />
        
      </Section>
      <Section>
      <div style={styles.section}>
      <div style={styles.card}>
        <label style={styles.label}>Télécharger pdf de tous les lignes</label>
        <ActionButton onClick={downloadPdf} label="Download All" Icon={FaCloudDownloadAlt} />
      </div>
      <div style={styles.card}>
        <label style={styles.label}>Télécharger pdf de tous les lignes avec les test et les bancs</label>
        <ActionButton onClick={downloadPdfLigne} label="Download All" Icon={FaCloudDownloadAlt} />
      </div>
    </div>
        </Section>



      <Modal
        isOpen={modal}
        onClose={handleClose}
        heading={"AIO Dashboard"}
        positiveText={"Save Changes"}
        negativeText={"Cancel"}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      >
        <p>Welcome to ELyes dashboard</p>
      </Modal>
    </>
  );
}
