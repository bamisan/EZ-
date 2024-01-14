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
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import UserModal from "./UserModal";
import { setAllUsers, setSearchTerm, selectAllUsers, selectSearchTerm } from '../store/userSlice';

const UserListTable = ({ users }) => {
  const dispatch = useDispatch();
  const allUserData = useSelector(selectAllUsers);
  const searchTerm = useSelector(selectSearchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userDataToUpdate, setUserDataToUpdate] = useState({});

  const headerCellStyle = { fontWeight: "bold" };
  const cardStyle = { width: "80%", margin: "auto", marginTop: "15vh" };

  const handleAddClick = () => {
    setUserDataToUpdate({});
    setIsModalOpen(true);
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users?firstName=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      dispatch(setAllUsers(data));
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      openAlert('Error fetching user data');
    }
  };

  // Get user data by user Id
  const handleUpdateClick = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`);

      const data = await response.json();
      // console.log(data,444)
      setIsModalOpen(true);
      setUserDataToUpdate(data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      openAlert("Error fetching user data");
    }
  };

  // Delete Users
  const handleDeleteClick = async (userId) =>{
    try{
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error("API error:", response.statusText);
      return;
    }
    getAllUsers();
    openAlert("User deleted successfully");
  } catch (error) {
    console.error("Error during API call:", error);
  }
};

const handleSearchTermChange = (value) => {
  dispatch(setSearchTerm(value)); 
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
  }, [searchTerm]);

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
              onChange={(e) => handleSearchTermChange(e.target.value)}
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
                    <IconButton color="primary" aria-label="update" onClick={() => handleUpdateClick(user.id)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteClick(user.id)}>
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
          getAllUsers={getAllUsers}
        />
      </CardContent>
    </Card>
  );
};

export default UserListTable;
