import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: grey[100],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
  }),
}));

const StyledBox = styled("div")(({ theme, open }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
  visibility: open ? "visible" : "hidden",
  transition: "visibility 0.3s ease-in-out",
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [viewNote, setViewNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [isAddingNote, setIsAddingNote] = useState(false); // Added state for the new note box visibility
  const token = Cookies.get("tokenEmployer");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleAddNoteToggle = () => {
    setIsAddingNote((prevState) => !prevState); // Toggle visibility of the add note box
    setNewNote({ title: "", description: "" }); // Clear input fields
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `${BaseAPI}/admin/user/noteadd`,
        {
          user_type: "employer",
          title: newNote.title,
          description: newNote.description,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      setNotes([...notes, response.data.response.note]);
      setIsAddingNote(false); // Hide the add note box after adding
      setNewNote({ title: "", description: "" }); // Reset the note fields
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingNote(false); // Hide the add note box
    setNewNote({ title: "", description: "" }); // Reset the note fields
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (open) {
        try {
          setLoading(true);
          const response = await axios.post(
            `${BaseAPI}/admin/user/notelisting`,
            { user_type: "employer" },
            {
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${props.token}`,
              },
            }
          );
          setLoading(false);
          setNotes(response.data.response.notes);
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      }
    };
    fetchNotes();
  }, [open, BaseAPI, token]);

  const handleEdit = (note) => {
    setEditingNote(note.id);
    setEditedContent({
      title: note.note_title,
      description: note.note_description,
    });
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.post(
        `${BaseAPI}/admin/user/notedelete/${noteId}`,
        { user_type: "employer" },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSave = async (noteId) => {
    try {
      await axios.put(
        `${BaseAPI}/admin/user/updatenote`,
        { id: noteId, ...editedContent },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      setNotes(
        notes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                note_title: editedContent.title,
                note_description: editedContent.description,
              }
            : note
        )
      );
      setEditingNote(null);
      setEditedContent({});
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleView = (note) => {
    setViewNote(note);
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <Fab color="secondary" aria-label="edit" onClick={toggleDrawer(true)}>
        <EditIcon />
      </Fab>
      <SwipeableDrawer
        container={
          window !== undefined ? () => window().document.body : undefined
        }
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{ keepMounted: true }}
      >
        <StyledBox
          open={open}
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: "text.secondary", fontSize: "27px" }}>
            Notes
          </Typography>
        </StyledBox>
        <StyledBox sx={{ p: 2 }}>
          <StyledBox
            sx={{
              height: "100%",
              overflow: "auto",
              backgroundColor: "#dddddd",
              borderRadius: "10px",
              minHeight: "300px",
              display: "flex",
            }}
            open={open}
          >
            {loading ? (
              <Skeleton variant="rectangular" height="100%" />
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  {notes.map((note) => (
                    <Box
                      key={note.id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: grey[300],
                        borderRadius: 2,
                        backgroundColor: grey[50],
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        width: "230px",
                        height: "200px",
                      }}
                    >
                      {editingNote === note.id ? (
                        <>
                          <input
                            type="text"
                            value={editedContent.title}
                            onChange={(e) =>
                              setEditedContent({
                                ...editedContent,
                                title: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              marginBottom: "10px",
                              padding: "10px",
                              border: "1px solid grey",
                              borderRadius: "5px",
                            }}
                          />
                          <textarea
                            value={editedContent.description}
                            onChange={(e) =>
                              setEditedContent({
                                ...editedContent,
                                description: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              height: "70px",
                              padding: "10px",
                              border: "1px solid grey",
                              borderRadius: "5px",
                            }}
                          />
                          <Tooltip title="Save">
                            <Fab
                              color="primary"
                              size="small"
                              onClick={() => handleSave(note.id)}
                              sx={{ mr: 1, mt: 2 }}
                            >
                              <SaveIcon />
                            </Fab>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <Fab
                              color="secondary"
                              size="small"
                              onClick={() => setEditingNote(null)}
                              sx={{ mr: 1, mt: 2 }}
                            >
                              <ArrowBackIcon />
                            </Fab>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="h3"
                            sx={{
                              fontWeight: "bold",
                              color: "black",
                              fontSize: "25px",
                              mb: 1,
                            }}
                          >
                            {note.note_title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ minHeight: "40px" }}
                          >
                            {note.note_description}
                          </Typography>
                          <Tooltip title="Edit">
                            <Fab
                              color="primary"
                              size="small"
                              onClick={() => handleEdit(note)}
                              sx={{ mr: 1, mt: 2 }}
                            >
                              <EditIcon />
                            </Fab>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Fab
                              color="secondary"
                              size="small"
                              onClick={() => handleDelete(note.id)}
                              sx={{ mr: 1, mt: 2 }}
                            >
                              <DeleteIcon />
                            </Fab>
                          </Tooltip>
                          <Tooltip title="View">
                            <Fab
                              color="default"
                              size="small"
                              onClick={() => handleView(note)}
                              sx={{ mt: 2 }}
                            >
                              <VisibilityIcon />
                            </Fab>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  ))}

                  {/* New Note Box */}
                  {newNote && (
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: grey[300],
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        width: "230px",
                        height: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Title"
                        value={newNote.title}
                        onChange={(e) =>
                          setNewNote({ ...newNote, title: e.target.value })
                        }
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          padding: "10px",
                          border: "1px solid grey",
                          borderRadius: "5px",
                        }}
                      />
                      <textarea
                        placeholder="Description"
                        value={newNote.description}
                        onChange={(e) =>
                          setNewNote({
                            ...newNote,
                            description: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          height: "70px",
                          padding: "10px",
                          border: "1px solid grey",
                          borderRadius: "5px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAdd}
                          sx={{ flexGrow: 1, mr: 1 }}
                        >
                          Add
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() =>
                            setNewNote({ title: "", description: "" })
                          }
                          sx={{ flexGrow: 1 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </StyledBox>

          {isAddingNote && (
            <Box
              sx={{
                p: 2,
                m: 1,
                border: "1px solid",
                borderColor: grey[300],
                borderRadius: 2,
                backgroundColor: grey[50],
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                width: "230px",
                height: "auto",
              }}
            >
              <input
                type="text"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                placeholder="Title"
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "10px 10px 10px 10px",
                  height: "30px",
                  border: "1px solid grey",
                  borderRadius: "5px",
                }}
              />
              <textarea
                value={newNote.description}
                onChange={(e) =>
                  setNewNote({ ...newNote, description: e.target.value })
                }
                placeholder="Description"
                style={{
                  width: "100%",
                  height: "60px",
                  padding: "0px 10px 0 10px",
                  height: "70px",
                  border: "1px solid grey",
                  borderRadius: "5px",
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Tooltip title="Add">
                  <Fab
                    color="primary"
                    size="small"
                    onClick={handleAdd}
                    sx={{ mr: 1 }}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
                <Tooltip title="Cancel">
                  <Fab
                    color="secondary"
                    size="small"
                    onClick={handleCancelAdd}
                    sx={{ mr: 1 }}
                  >
                    <ArrowBackIcon />
                  </Fab>
                </Tooltip>
              </Box>
            </Box>
          )}
        </StyledBox>
      </SwipeableDrawer>

      {open && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999,
          }}
          onClick={handleAddNoteToggle} // Show/Hide Add note box
        >
          <AddIcon />
        </Fab>
      )}

      <Modal
        open={!!viewNote}
        onClose={() => setViewNote(null)}
        aria-labelledby="view-note-title"
        aria-describedby="view-note-description"
      >
        <Box sx={modalStyle}>
          <Typography id="view-note-title" variant="h3" component="h2">
            {viewNote?.note_title}
          </Typography>
          <Typography id="view-note-description" sx={{ mt: 2 }}>
            {viewNote?.note_description}
          </Typography>
        </Box>
      </Modal>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
