import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';

export default function MockServer() {
  const [selectedTest, setSelectedTest] = useState('');
  const [port, setPort] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/v1/tests');
      if (!response?.ok) {
        throw new Error('Failed to fetch tests');
      }
      const data = await response.json();
      setTests(data);
      return data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const fetchMockServerStatus = async (testsTemp) => {
    try {
      const response = await fetch('/api/v1/mockServer');
      if (!response?.ok) {
        throw new Error('Failed to fetch mock server status');
      }
      const data = await response.json();
      if (data.port) {
        setPort(data.port);
        setIsRunning(true);
        setSelectedTest(data.testName);
      } else {
        setIsRunning(false);
      }

      return data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const loadInitialData = async () => {
    const testsTemp = await fetchTests();
    await fetchMockServerStatus(testsTemp);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleTestChange = (event) => {
    setSelectedTest(event.target.value);
  };

  const handlePortChange = (event) => {
    setPort(event.target.value);
  };

  const handleRun = () => {
    setIsRunning(true);
    // Create a POST request to /api/v1/mockServer
    fetch('/api/v1/mockServer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testName: selectedTest,
        port: parseInt(port, 10),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to start mock server');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Mock server started:', data);
        // You can add additional logic here, such as showing a success message
      })
      .catch((error) => {
        console.error('Error starting mock server:', error);
        setIsRunning(false);
        // You can add additional error handling here, such as showing an error message
      });
  };

  const handleStop = () => {
    setIsRunning(false);
    // Create a DELETE request to /api/v1/mockServer
    fetch('/api/v1/mockServer', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        port: parseInt(port, 10),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to stop mock server');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Mock server stopped:', data);
        // You can add additional logic here, such as showing a success message
      })
      .catch((error) => {
        console.error('Error stopping mock server:', error);
        // You can add additional error handling here, such as showing an error message
      });
  };

  return (
    <Box sx={{ width: '100%', p: 3, pt: 0 }}>
      <Box
        sx={{
          width: '100%',
          margin: 'auto',
          p: 3,
          pt: 0,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 0,
          border: 1,
          borderColor: 'divider',
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '50%',
            flexDirection: 'column',
            gap: 2,
            p: 3,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="test-select-label">Test</InputLabel>
            <Select
              labelId="test-select-label"
              id="test-select"
              value={selectedTest}
              label="Test"
              onChange={handleTestChange}
            >
              {tests.map((test) => (
                <MenuItem key={test.id} value={test.name}>
                  {test.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Port"
            variant="outlined"
            value={port}
            onChange={handlePortChange}
            type="number"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRun}
              disabled={isRunning}
            >
              Run
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleStop}
              disabled={!isRunning}
            >
              Stop
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
