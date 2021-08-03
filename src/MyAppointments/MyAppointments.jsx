import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Page from "../layout/Page/page";
import { useHistory } from "react-router";
import { fetchAppointments } from "../state/appointment/slice";
import Store from "../state";
import i18n from "../translations/en/i18n.json";
import { Container, Paper, Card, Grid, Avatar, Button } from "@material-ui/core";
import { useStyles } from "./styles";
import EventIcon from '@material-ui/icons/Event';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';

const MyAppointments = () => {
  const history = useHistory();
  const userLoggedIn = useSelector((state) => {
    return state.user.loggedIn;
  });
  if (!userLoggedIn) {
    history.push("/login");
  }
  const userId = localStorage.getItem("user-id");
  if (userId === null) {
    console.error("Missing 'user-id' in the local storage. Redirecting to login ...");
    history.push("/login");
  }
  let initialData = useSelector((state) => {
    return state.appointment.appointments[userId];
  });
  initialData = (initialData && Array.isArray(initialData)) ? initialData : [];

  const [appointments, setAppointments] = React.useState(initialData);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (appointments.length === 0) {
      // Fetch Appointment Data
      dispatch(fetchAppointments({ userId }));
    }
  });

  Store.subscribe(() => {
    const appointmentState = Store.getState().appointment;
    const data = appointmentState.appointments[userId];
    // Caution: Do not call setAppointments when appointment data is not available or empty. It will lead to infinite rendering loop.
    if (data && Array.isArray(data) && !(appointments.length === 0 && data.length === 0)) {
      setAppointments(data);
    }
  });


  const classes = useStyles();
  return (
    <Page>
      <Container maxWidth="lg">
        <Paper elevation={1} className={classes.container}>
          <div className={classes.heading}>
            <EventIcon />
            <span>My Appointments</span>
          </div>
          <Grid container spacing={2}>
            {appointments.map((appointment) => (
              <Grid item xs={12}>
                <Card variant="outlined" className={classes.appointmentCard}>
                  <div className="left">
                    <Avatar className={classes.doctorAvatarLarge} alt={getDoctorName(appointment)} src={getDoctorProfileImageURL(appointment)} />
                    <div className="title">
                      {getDoctorName(appointment)}
                    </div>
                  </div>
                  <div className="middle">
                    <div className="details">
                      <div className="data">
                        <span className="label">{i18n['myAppointments']['labelDate']}: </span>
                        {getAppointmentDate(appointment)}
                      </div>
                      <div className="data">
                        <span className="label">{i18n['myAppointments']['labelPatient']}: </span>
                        {getPatientName(appointment)}
                      </div>
                      <div className="data">
                        <span className="label">{i18n['myAppointments']['labelTiming']}: </span>
                        {getAppointmentTiming(appointment)}
                      </div>

                      <div className="data">
                        <span className="label">{i18n['myAppointments']['labelStatus']}: </span>
                        {getAppointmentStatusComponent(appointment)}
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <Button variant="outlined" color="primary" disableElevation>
                      <ForumOutlinedIcon /> Consult
                    </Button>
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Page>
  );
};

export default MyAppointments;

const statusMapping = {
  "NOT_STARTED": {
    text: i18n["myAppointments"]["not_started"],
    cssClass: "status not-started",
  },
  "IN_PROGRESS": {
    text: i18n["myAppointments"]["in_progress"],
    cssClass: "status in-progress",
  },
  "COMPLETED": {
    text: i18n["myAppointments"]["completed"],
    cssClass: "status completed",
  },
};


function getDoctorName(appointmentData) {
  return `${i18n['myAppointments']['doctorSalutation']} ${appointmentData.doctorId.firstName} ${appointmentData.doctorId.lastName}`;
}

function getDoctorProfileImageURL(appointmentData) {
  return appointmentData.doctorId.imageUrl;
}

function getAppointmentStatusComponent(appointmentData) {
  return (
    <span className={statusMapping[appointmentData.appointmentStatus].cssClass}>
      {statusMapping[appointmentData.appointmentStatus].text}
    </span>
  );
}

function getPatientName(appointmentData) {
  const isSelf = !appointmentData.otherName;
  if (isSelf) {
    return i18n['myAppointments']['self'];
  }
  const otherName = appointmentData.otherName;
  const otherMobileNumber = appointmentData.otherMobileNumber ? `(${appointmentData.otherMobileNumber})` : "";
  return `${otherName} ${otherMobileNumber}`;
}

function getAppointmentDate(appointmentData) {
  const date = new Date(appointmentData.date);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function getAppointmentTiming(appointmentData) {
  const date = new Date();
  const startTime = [
    parseInt(appointmentData.startTime.slice(0, 2)),
    parseInt(appointmentData.startTime.slice(2))
  ];
  const endTime = [
    parseInt(appointmentData.endTime.slice(0, 2)),
    parseInt(appointmentData.endTime.slice(2))
  ];
  date.setHours(startTime[0], startTime[1]);
  const formattedStartTime = date.toLocaleTimeString('en-GB', { hour12: true, hour: '2-digit', minute: '2-digit' }).toUpperCase();
  date.setHours(endTime[0], endTime[1]);
  const formattedEndTime = date.toLocaleTimeString('en-GB', { hour12: true, hour: '2-digit', minute: '2-digit' }).toUpperCase();
  return `${formattedStartTime} - ${formattedEndTime}`;
}