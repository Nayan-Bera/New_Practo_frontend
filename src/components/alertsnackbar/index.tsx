import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { UNSET_ALERT } from "../../redux/types";
import type { IAlertState, IAppState } from "../../types";

// Main component
const CustomizedSnackbars: React.FC = () => {
  const dispatch = useDispatch();
  const alert = useSelector<IAppState, IAlertState>((state) => state.alert);

  useEffect(() => {
    const { message, type, duration } = alert || {};

    if (message && type) {
      // Map MUI alert types to Sonner toast types
      const toastType = type === 'error' ? 'error' : 
                       type === 'warning' ? 'warning' : 
                       type === 'info' ? 'info' : 'success';

      // Show toast with appropriate type
      toast[toastType](message, {
        duration: duration || 3000,
        onDismiss: () => {
          dispatch({ type: UNSET_ALERT, payload: {} });
        }
      });
    }
  }, [alert, dispatch]);

  return null; // Sonner handles the UI rendering
};

export default CustomizedSnackbars; 