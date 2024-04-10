import { useEffect, useRef, useState } from "react";
import Card from "@aio/components/Card";
import Modal from "@aio/components/Modal";
import styles from "./Home.module.css";

import DoughnutChartExample from "../../components/DoughnutChartExample";
import HeaderSection from "@aio/components/HeaderSection";
import DataCard from "@aio/components/DataCard";
import { SlCalender } from "react-icons/sl";
import ActionButton from "@aio/components/ActionButton";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Section from "@aio/components/Section";

import BillingHistory from "../../components/BillingHistory";
import Paragraph from "../../components/Paragraph";
import BarChartExample from "../../components/BarChartExample";

export default function Dashboard() {
  const [modal, setModal] = useState(false);

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

  return (
    <>
      <HeaderSection
        heading={"Dashboard"}
        subHeading={"Welcome to aio dashboard"}
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

      {/* <Section>
        <Card
          heading="Bar Chart Example"
          subHeading="Lets see how data is ploting on chartjs"
        >
          <BarChartExample />
        </Card>
        <Card
          heading="Doughnut Chart Example"
          subHeading="Lets see how data is ploting on chartjs"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DoughnutChartExample />
          </div>
        </Card>
      </Section> */}

     /

      <BillingHistory />

      <Modal
        isOpen={modal}
        onClose={handleClose}
        heading={"AIO Dashboard"}
        positiveText={"Save Changes"}
        negativeText={"Cancel"}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      >
        <p>Welcome to aio dashboard</p>
      </Modal>
    </>
  );
}
