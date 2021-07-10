import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { Avatar, Menu } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/PersonOutline";
import AppointmentsIcon from "@material-ui/icons/CalendarToday";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { useDispatch } from "react-redux";
import { logout } from "../../state/user/slice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function ProfileSection() {
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutClick = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <div>
        <Avatar
          src="/broken-image.jpg"
          className={classes.avatar}
          ref={anchorRef}
          aria-haspopup="true"
          onClick={handleClick}
        />
        <Menu
          id="simple-menu"
          onClose={handleClose}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
        >
          <MenuItem onClick={handleClose}>
            <SearchIcon style={{ marginRight: "8px" }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <AppointmentsIcon style={{ marginRight: "8px" }} /> My Appointments
          </MenuItem>
          <MenuItem onClick={onLogoutClick}>
            <LogoutIcon style={{ marginRight: "8px" }} /> Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
