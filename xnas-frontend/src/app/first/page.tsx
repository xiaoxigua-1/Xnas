'use client';

import { Box, FormControl, Container, TextField, Typography } from '@mui/material';
import Particles from 'react-particles';
import type { Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { useState, useCallback } from 'react';

export default function First() {
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

  return (
    <Box className="w-full h-full flex items-center justify-center">
      <Particles url="particles.json" init={particlesInit} className="w-full h-full absolute z-0"/>
      <Container className="p-10 shadow-md flex flex-col z-10 rounded-md" maxWidth="xs">
        <FormControl>
          <Typography variant="h5" gutterBottom>Create Admin Account</Typography>
          <TextField id="name" label="name" variant="outlined" className="mt-5" onChange={handleChange} type="name" />
          <TextField id="password" label="password" variant="outlined" className="mt-5" onChange={handleChange} type="password"/>
        </FormControl>
      </Container> 
    </Box>
  );
};

