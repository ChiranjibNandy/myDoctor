import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import DoctorsInfo from "./components/DoctorsInfo/DoctorsInfo";
import SlotBooking from "./components/SlotBooking/SlotBooking";
import DoctorDetails from "./components/DoctorDetails/DoctorDetails";
import Page from "../layout/Page/page";
import { useStyles } from "./styles";

const DoctorsDetailAndBooking = () => {
  const classes = useStyles();
  const [doctorInfos, setDoctorInfos] = React.useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/v1/doctordetailsandslots")
      .then((response) => response.json())
      .then((data) => setDoctorInfos(data.message[0]));
  }, []);

  if (doctorInfos == null) {
    return (
      <Page>
        <div>Loading...</div>
      </Page>
    );
  }

  return (
    <Page>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DoctorsInfo data={doctorInfos} />
          </Grid>
          <Grid item xs={6}>
            <SlotBooking data={doctorInfos} />
          </Grid>
          <Grid item xs={12}>
            <DoctorDetails data={doctorInfos} />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default DoctorsDetailAndBooking;
