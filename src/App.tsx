import { useState } from "react";
import {
  Box,
  Modal,
  Backdrop,
  Fade,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import Toast from "./components/Toast";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface book {
  id: number;
  title: string;
  author: string;
  ISBN: string;
  status: string;
}

function App() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", maxWidth: 80 },
    {
      field: "title",
      type: "string",
      headerName: "Title",
      editable: true,
      minWidth: 300,
    },
    {
      field: "author",
      type: "string",
      headerName: "Author",
      editable: true,
      minWidth: 200,
    },
    {
      field: "ISBN",
      type: "string",
      headerName: "ISBN",
      editable: true,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: ["Unread", "In Progress", "Finished"],
      minWidth: 150,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={(e) => handleDeleteBook(params)}
        />,
      ],
    },
  ];

  const rows = [
    { id: 1, author: "Benjamin Frisch", title: "The Fun Family", ISBN: "978-1-60309-344-6", status: "Unread" },
    {
      id: 2,
      author: "Edmund White",
      title: "Edmund White’s A Boy’s Own Story: The Graphic Novel",
      ISBN: "978-1-60309-508-2",
      status: "In Progress"
    },
    {
      id: 3,
      author: "Eddie Campbell",
      title: "From Hell: Master Edition -- HARDCOVER",
      ISBN: "978-1-60309-469-6",
      status: "Finished"
    },
  ];

  const apiRef = useGridApiRef();
  const [booklist, setBooklist] = useState(rows);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [saveBookOpen, setSaveBookOpen] = useState(false);
  const [importBookOpen, setImportBookOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [status, setStatus] = useState("Unread");

  const [pantryId, setPantryId] = useState("");
  const [basketName, setBasketName] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
    open: false,
    handleClose: () => {
      setToast((prev) => ({ ...prev, open: false }));
    },
  });

  const handleOpen = () => {
    setAddBookOpen(true);
  };
  const handleClose = () => {
    setAddBookOpen(false);
  };

  const handleOpenSaveModal = () => {
    setSaveBookOpen(true);
  };

  const handleSaveClose = () => {
    setSaveBookOpen(false);
  };

  const handleOpenImportModal = () => {
    setImportBookOpen(true);
  }

  const handleImportClose = () => {
    setImportBookOpen(false);
  }

  function handleAddBook(event: any) {
    event.preventDefault();
    const count = booklist.length + 1;
    let tempList: book[] = [];
    booklist.map((item, index) => {
      const number = index + 1;
      tempList.push({
        id: number,
        title: item.title,
        author: item.author,
        ISBN: item.ISBN,
        status: item.status,
      });
      return null;
    });
    tempList.push({
      id: count,
      title: title,
      author: author,
      ISBN: ISBN,
      status: status,
    });
    setTitle("");
    setAuthor("");
    setISBN("");
    setStatus("");
    setBooklist(tempList);
    setToast({
      ...toast,
      open: true,
      type: "success",
      message: "Added new book successfully!",
    });
    setAddBookOpen(false);
  }

  function handleDeleteBook(params: any) {
    const id = params.id;
    let tempList: book[] = [];
    let count = 1;
    booklist.map((item, index) => {
      const number = index + 1;
      if (number !== id) {
        tempList.push({
          id: count,
          title: item.title,
          author: item.author,
          ISBN: item.ISBN,
          status: item.status,
        });
        count++;
      }
      return null;
    });
    setBooklist(tempList);
    setToast({
      ...toast,
      open: true,
      type: "success",
      message: "Deleted a book successfully!",
    });
  }

  function handleDeleteBooks() {
    const selectedRows = apiRef.current.getSelectedRows();
    if (selectedRows.size !== 0) {
      let count = 1;
      let tempList: book[] = [];
      booklist.map((item, index) => {
        const number = index + 1;
        if (!selectedRows.has(number)) {
          tempList.push({
            id: count,
            title: item.title,
            author: item.author,
            ISBN: item.ISBN,
            status: item.status,
          });
          count++;
        }
        return null;
      });
      setBooklist(tempList);
      setToast({
        ...toast,
        open: true,
        type: "success",
        message: "Deleted books successfully!",
      });
      apiRef.current.setRowSelectionModel([-1]);
    } else {
      setToast({
        ...toast,
        open: true,
        type: "success",
        message: "There is no any selected book.",
      });
    }
  }

  function handleCellEdit(params: any) {
    const rowId = params.id;
    const field = params.field;
    const updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, field);
    const { id, author, title, ISBN, status } = updatedRow;
    let tempList: book[] = [];
    booklist.map((item, index) => {
      const number = index + 1;
      if (number === id) {
        tempList.push({
          id: number,
          title: title,
          author: author,
          ISBN: ISBN,
          status: status,
        });
      } else {
        tempList.push({
          id: number,
          title: item.title,
          author: item.author,
          ISBN: item.ISBN,
          status: item.status,
        });
      }
      return null;
    });
    setBooklist(tempList);
  }

  function handleExportToYAML() {
    let output = "---Booklist\n\n";
    booklist.map((item) => {
      output = `${output} - Book ${item.id} \n`;
      output = `${output} \t title: ${item.title} \n`;
      output = `${output} \t author: ${item.author} \n`;
      output = `${output} \t ISBN: ${item.ISBN} \n`;
      output = `${output} \t Status: ${item.status} \n`;
      return null;
    });
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "booklist.yaml";
    link.href = url;
    link.click();
    setToast({
      ...toast,
      open: true,
      type: "success",
      message: "Exported Booklist Successfully!",
    });
  }

  const handleSaveBook = async (event: any) => {
    event.preventDefault();
    let data = JSON.stringify(booklist);
    data = '{"booklist":' + data + "}";
    try {
      await fetch(
        "https://getpantry.cloud/apiv1/pantry/" +
          pantryId +
          "/basket/" +
          basketName,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      ).then(function (response) {
        if (response.status >= 300 || response.status < 200) {
          setToast({
            ...toast,
            open: true,
            type: "error",
            message: response.statusText,
          });
        } else {
          setToast({
            ...toast,
            open: true,
            type: "success",
            message: "Saved Booklist Successfully!",
          });
        }
      });
    } catch (e) {
      setToast({
        ...toast,
        open: true,
        type: "error",
        message: "Server Error!",
      });
    }
    setSaveBookOpen(false);
  };

  const handleImportBooklist = async (event:any) => {
    event.preventDefault();
    try {
      await fetch(
        "https://getpantry.cloud/apiv1/pantry/" +
          pantryId +
          "/basket/" +
          basketName,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }
      ).then(function (response) {
        if (response.status >= 300 || response.status < 200) {
          setToast({
            ...toast,
            open: true,
            type: "error",
            message: response.statusText,
          });
        } else {
          return response.json();
        }
      }).then(function(data){
        setBooklist(data.booklist)
        setToast({
          ...toast,
          open: true,
          type: "success",
          message: "Imported Booklist Successfully!",
        });
      });
    } catch (e) {
      setToast({
        ...toast,
        open: true,
        type: "error",
        message: "Server Error!",
      });
    }
    setImportBookOpen(false);
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12} lg={2}></Grid>
      <Grid
        item
        sx={{ justifyContent: "center", mx: 1, pr: 2, mt: 5 }}
        xs={12}
        lg={8}
      >
        <Toast {...toast} />
        <Typography variant="h3" component="h3" textAlign="center">
          Kargo Booklist
        </Typography>
        <Box textAlign="right" sx={{ my: 1 }}>
          <Button
            sx={{ ml: { sm: 0.5 }, mb: 0.5, width: { sm: "auto" } }}
            variant="contained"
            color="primary"
            onClick={handleOpen}
            fullWidth
          >
            Add Book
          </Button>
          <Button
            sx={{ ml: { sm: 0.5 }, mb: 0.5, width: { sm: "auto" } }}
            variant="contained"
            color="error"
            onClick={handleDeleteBooks}
            fullWidth
          >
            Delete Books
          </Button>
          <Button
            sx={{ ml: { sm: 0.5 }, mb: 0.5, width: { sm: "auto" } }}
            variant="contained"
            color="success"
            onClick={handleExportToYAML}
            fullWidth
          >
            Export to YAML
          </Button>
          <Button
            sx={{ ml: { sm: 0.5 }, mb: 0.5, width: { sm: "auto" } }}
            variant="contained"
            color="success"
            onClick={handleOpenSaveModal}
            fullWidth
          >
            Save To Pantry
          </Button>
          <Button
            sx={{ ml: { sm: 0.5 }, mb: 0.5, width: { sm: "auto" } }}
            variant="contained"
            color="success"
            onClick={handleOpenImportModal}
            fullWidth
          >
            Import From Pantry
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={booklist}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            onCellEditStop={(params) => handleCellEdit(params)}
          />
        </Box>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={addBookOpen}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={addBookOpen}>
            <Box sx={style}>
              <h2>Add Book Form</h2>
              <form onSubmit={handleAddBook}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Author"
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="ISBN"
                  onChange={(e) => setISBN(e.target.value)}
                  value={ISBN}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="simple-select-label">Status</InputLabel>
                  <Select
                    labelId="simple-select-label"
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Unread">Unread</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Finished">Finished</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" type="submit">
                  Add Book
                </Button>
              </form>
            </Box>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={saveBookOpen}
          onClose={handleSaveClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={saveBookOpen}>
            <Box sx={style}>
              <h2>Save Data Into Pantry</h2>
              <form onSubmit={handleSaveBook}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Pantry ID"
                  onChange={(e) => setPantryId(e.target.value)}
                  value={pantryId}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Basket Name"
                  onChange={(e) => setBasketName(e.target.value)}
                  value={basketName}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <Typography sx={{mb:0.5}}>NOTE: Sometimes this may take tens of seconds or longer due to pantry server 's issues.</Typography>
                <Button variant="contained" color="primary" type="submit">
                  Save BookList
                </Button>
              </form>
            </Box>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={importBookOpen}
          onClose={handleImportClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={importBookOpen}>
            <Box sx={style}>
              <h2>Import Booklist From Pantry</h2>
              <form onSubmit={handleImportBooklist}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Pantry ID"
                  onChange={(e) => setPantryId(e.target.value)}
                  value={pantryId}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Basket Name"
                  onChange={(e) => setBasketName(e.target.value)}
                  value={basketName}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <Typography sx={{mb:0.5}}>NOTE: Sometimes this may take tens of seconds or longer due to pantry server 's issues.</Typography>
                <Button variant="contained" color="primary" type="submit">
                  Import Booklist
                </Button>
              </form>
            </Box>
          </Fade>
        </Modal>
      </Grid>
      <Grid item xs={12} lg={2}></Grid>
    </Grid>
  );
}

export default App;
