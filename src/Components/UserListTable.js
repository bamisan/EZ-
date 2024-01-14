import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { selectAllUsers, setAllUsers } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import UserModal from "./UserModal";

const UserListTable = ({ users }) => {
  const dispatch = useDispatch();
  const allUserData = useSelector(selectAllUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [userDataToUpdate, setUserDataToUpdate] = useState({});
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const headerCellStyle = { fontWeight: "bold" };
  const cardStyle = { width: "80%", margin: "auto", marginTop: "15vh" };

  const handleAddClick = () => {
    setUserDataToUpdate({});
    setIsModalOpen(true);
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      dispatch(setAllUsers(data));
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      openAlert("Error fetching user data");
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
  const handleDeleteClick = async (userId) => {
    setUserIdToDelete(userId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error("API error:", response.statusText);
        return;
      }

      getAllUsers();
      openAlert("User deleted successfully");
      setOpenDialog(false); // Close the dialog after successful deletion
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  // search
  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
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
  }, []);

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
              opacity: "0.7",
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
              {allUserData
                .filter((user) =>
                  user.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.maritalStatus}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="update"
                        onClick={() => handleUpdateClick(user.id)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="secondary"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(user.id)}
                      >
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

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogContent style={{ textAlign: "center" }}>
          ARE YOU SURE WANT TO DELETE THIS USER?
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="outlined"
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserListTable;
