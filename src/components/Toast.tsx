import { Alert, Snackbar } from '@mui/material';

export interface ToastProps {
  message: string;
  type: any;
  open: boolean;
  handleClose?: any;
}

const Toast: React.FC<ToastProps> = (props) => {
  const { open, handleClose, type } = props;
  return (
    <>
      {" "}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type}>
          {props.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Toast;
