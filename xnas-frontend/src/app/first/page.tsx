'use client';

import { Box, FormControl, Container, TextField, Typography, IconButton } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import Particles from 'react-particles';
import type { Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { useState, useCallback, useEffect } from 'react';
import { Api, baseInstance } from '../api';

export default function First() {
  useEffect(() => {
    (async () => {
      const request = await baseInstance.get<Api<boolean>>("first");
      if (!request.data.data) {
        document.location = "/";
      }
    })();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    password: '' 
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const next = useCallback(async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("password", formData.password);
    
    const request = await baseInstance.post<Api<boolean>>("create_new_acc", form);
    if (request.data.data) {
      document.location = "/";
    }
  }, [formData]); 

  return (
    <Box className="w-full h-full flex items-center justify-center">
      <Particles url="particles.json" init={particlesInit} className="w-full h-full absolute z-0"/>
      <Container className="p-10 shadow-md flex-col z-10 rounded-md relative" maxWidth="xs" style={{ display: 'flex' }}>
        <FormControl>
          <Typography variant="h5" gutterBottom>Create Admin Account</Typography>
          <TextField id="name" label="name" variant="outlined" className="mt-5" onChange={handleChange} type="name" style={{ marginTop: '20px' }}/>
          <TextField id="password" label="password" variant="outlined" onChange={handleChange} type="password" style={{ marginTop: '20px' }} />
          <Box className="flex justify-end" style={{ marginTop: '20px' }}>
            <IconButton aria-label="Next" title="Next" color="secondary" size="large" onClick={next}>
              <EastIcon fontSize="inherit"/> 
            </IconButton>
          </Box>
        </FormControl>
      </Container> 
    </Box>
  );
};

