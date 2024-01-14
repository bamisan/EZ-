import {
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import UserModal from "./UserModal";

const UserListTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userDataToUpdate, setUserDataToUpdate] = useState({});
  const [allUserData, setAllUserData] = useState([]);

  const headerCellStyle = { fontWeight: "bold" };
  const cardStyle = { width: "80%", margin: "auto", marginTop: "15vh" };

  const handleAddClick = () => {
    setUserDataToUpdate({});
    setIsModalOpen(true);
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      console.log(data)
      setAllUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      openAlert('Error fetching user data');
    }
  };

  const handleUpdateClick = async () => {
    try {
      // const response = await fetch(`/api/users/1`);
      setIsModalOpen(true);
      setUserDataToUpdate({
        firstName:"bami",
        lastName: "bami",
        dateOfBirth: "2021-01-12",
        address: "test",
        maritalStatus:"Married"
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      openAlert("Error fetching user data");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openAlert = (message) => {
    setIsAlertOpen(true);
    setAlertMessage(message);
  };

  useEffect(() => {
    getAllUsers();
  }, [ getAllUsers]);

  return (
    <Card style={cardStyle}>
      <CardContent>
        <Snackbar
          open={isAlertOpen}
          autoHideDuration={6000}
          onClose={() => setIsAlertOpen(false)}
          message={alertMessage}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          ContentProps={{
            style: {
              justifyContent: "center",
              opacity: "0.7"
            },
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<AddIcon />}
              style={{ marginBottom: "5px" }}
              onClick={handleAddClick}
            >
              Add
            </Button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={headerCellStyle}>First Name</TableCell>
                <TableCell style={headerCellStyle}>Last Name</TableCell>
                <TableCell style={headerCellStyle}>Date of Birth</TableCell>
                <TableCell style={headerCellStyle}>Address</TableCell>
                <TableCell style={headerCellStyle}>Marital Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUserData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.dateOfBirth}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.maritalStatus}</TableCell>
                  <TableCell>
                    <IconButton color="primary" aria-label="update" onClick={handleUpdateClick}>
                      <EditIcon />
                    </IconButton>

                    <IconButton color="secondary" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <UserModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          openAlert={openAlert}
          userDataToUpdate={userDataToUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default UserListTable;
