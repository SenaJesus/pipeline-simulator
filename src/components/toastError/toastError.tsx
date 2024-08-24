import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastError = styled(ToastContainer).attrs({
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    pauseOnFocusLoss: false,
  })`
    .Toastify__progress-bar {
      background: #330708;
    }
  `;

export default ToastError;