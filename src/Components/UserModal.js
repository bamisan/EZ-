import {
  Button,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Modal from "react-modal";

Modal.setAppElement("#root");

const UserModal = ({
  isOpen,
  onRequestClose,
  openAlert,
  userDataToUpdate,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Single");

  // errors
  const [Errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
  });

  const handleMaritalStatusChange = (event) => {
    setMaritalStatus(event.target.value);
  };

  const handleSave = async () => {
    // Reset errors
    setErrors({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
    });

    // Validate form fields
    let hasErrors = false;

    if (!firstName) {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: "Required" }));
      hasErrors = true;
    }
    if (!lastName) {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: "Required" }));
      hasErrors = true;
    }
    if (!dateOfBirth) {
      setErrors((prevErrors) => ({ ...prevErrors, dateOfBirth: "Required" }));
      hasErrors = true;
    }
    if (!address) {
      setErrors((prevErrors) => ({ ...prevErrors, address: "Required" }));
      hasErrors = true;
    }

    // If there are errors, stop the save process
    if (hasErrors) {
      return;
    }

    try {
      const endpoint = userDataToUpdate
        ? `YOUR_API_ENDPOINT/${userDataToUpdate.id}`
        : "YOUR_API_ENDPOINT";
      const method = userDataToUpdate ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          address,
          maritalStatus,
        }),
      });

      if (!response.ok) {
        console.error("API error:", response.statusText);
        return;
      }

      onRequestClose();
      openAlert(
        userDataToUpdate
          ? "User updated successfully"
          : "User saved successfully"
      );
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  useEffect(() => {
    setFirstName(userDataToUpdate?.firstName || "");
    setLastName(userDataToUpdate?.lastName || "");
    setDateOfBirth(userDataToUpdate?.dateOfBirth || "");
    setAddress(userDataToUpdate?.address || "");
    setMaritalStatus(userDataToUpdate?.maritalStatus || "Single");
    setErrors({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
    });
  }, [userDataToUpdate]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          position: "fixed",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "30vw",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div>
        {/* <h2>
          {Object.keys(userDataToUpdate).length > 0 ? "EDIT USER" : "ADD USER"}
        </h2> */}
        <TextField
          label="First Name"
          size="small"
          variant="outlined"
          margin="normal"
          fullWidth
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
          }}
          error={!!Errors.firstName}
          helperText={Errors.firstName}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />
        <TextField
          label="Last Name"
          size="small"
          variant="outlined"
          margin="normal"
          fullWidth
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
          }}
          error={!!Errors.lastName}
          helperText={Errors.lastName}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />
        <TextField
          label="Date of Birth"
          size="small"
          type="date"
          variant="outlined"
          margin="normal"
          fullWidth
          value={dateOfBirth}
          onChange={(e) => {
            setDateOfBirth(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, dateOfBirth: "" }));
          }}
          error={!!Errors.dateOfBirth}
          helperText={Errors.dateOfBirth}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />
        <TextField
          label="Address"
          size="small"
          variant="outlined"
          margin="normal"
          fullWidth
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, address: "" }));
          }}
          error={!!Errors.address}
          helperText={Errors.address}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />
        <RadioGroup
          aria-label="marital-status"
          name="marital-status"
          value={maritalStatus}
          onChange={handleMaritalStatusChange}
          style={{ marginTop: "5px" }}
        >
          <FormControlLabel value="Single" control={<Radio />} label="Single" />
          <FormControlLabel
            value="Married"
            control={<Radio />}
            label="Married"
          />
        </RadioGroup>
      </div>
      <div style={{ marginTop: "10%", marginLeft: "auto" }}>
        <Button onClick={onRequestClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="outlined"
          color="success"
          style={{ marginLeft: "8px" }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default UserModal;
