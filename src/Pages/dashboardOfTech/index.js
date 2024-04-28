import { useState } from "react";
import Modal from "@aio/components/Modal";

import HeaderSection from "@aio/components/HeaderSection";
import DataCard from "@aio/components/DataCard";

import Section from "@aio/components/Section";

import BillingHistory from "../../components/BillingHistory";


export default function Dashboard() {
  const [modal, setModal] = useState(false);

  const handleClose = () => {
    //alert('closing');
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  }
    ;
  const handleSubmit = () => {
    alert('Submit is working..!');
    handleClose();
  }

  return (
    <>
      <HeaderSection
        heading={"Dashboard"}
        subHeading={"Welcome to aio dashboard"}
        role={2}
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
