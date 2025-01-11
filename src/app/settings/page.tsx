'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { exportData, importData, deleteAllData } from '@/lib/db';
import { SymptomEntry } from '@/types';

export default function Settings() {
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);
  const [importDialog, setImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hashimotos-bingo-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setNotification({
        message: 'Data exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Export failed:', error);
      setNotification({
        message: 'Failed to export data',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    await deleteAllData();
    setNotification({
      message: 'All data deleted successfully',
      severity: 'success'
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportDialog(true);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      const data = JSON.parse(text);

      // Validate the data structure
      if (!data.symptomEntries || !Array.isArray(data.symptomEntries)) {
        throw new Error('Invalid file format');
      }

      // Type check each entry
      data.symptomEntries.forEach((entry: Partial<SymptomEntry>) => {
        if (!entry.id || !entry.timestamp || typeof entry.symptoms !== 'object') {
          throw new Error('Invalid entry format');
        }
      });

      await importData(data as { symptomEntries: SymptomEntry[] }, true);
      setNotification({
        message: 'Data imported successfully',
        severity: 'success'
      });
      setImportDialog(false);
    } catch (error) {
      console.error('Import failed:', error);
      setNotification({
        message: 'Failed to import data: ' + (error as Error).message,
        severity: 'error'
      });
    }
    setSelectedFile(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Settings</Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Data Management</Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleExport}
          >
            Export Data
          </Button>

          <Button
            variant="contained"
            component="label"
          >
            Import Data
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleFileSelect}
            />
          </Button>

          <Button variant="contained" onClick={handleDelete} color="warning">Delete All Data</Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Export your data to create a backup, or import a previously exported file.
          Note that importing will replace all existing data.
        </Typography>
      </Paper>

      {/* Import Confirmation Dialog */}
      <Dialog
        open={importDialog}
        onClose={() => setImportDialog(false)}
      >
        <DialogTitle>Confirm Import</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will replace all existing data with the contents of {selectedFile?.name}.
            This action cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Cancel</Button>
          <Button onClick={handleImport} variant="contained" color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.severity}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 