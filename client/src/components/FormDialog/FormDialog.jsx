import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { Formik, Form } from 'formik';

const FormDialog = ({
  open,
  onClose,
  title,
  initialValues,
  validationSchema,
  onSubmit,
  children,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Form>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>{children}</Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>{cancelButtonText}</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {submitButtonText}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default FormDialog; 