'use client';

import { Container, Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { AiOutlineArrowRight } from 'react-icons/ai';
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
      [event.target.name]: event.target.value,
    });
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const next = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("password", formData.password);
    
    const request = await baseInstance.post<Api<boolean>>("create_new_acc", form);
    if (!request.data.data) {
      document.location = "/";
    }
  }; 

  return (
    <Box className="w-full h-full flex items-center justify-center">
      <Particles url="/particles.json" init={particlesInit} className="w-full h-full absolute z-0"/>
      <Container className="p-10 shadow-md flex-col z-10 rounded-md relative max-w-[400px] bg-white" maxWidth="xs">
        <FormControl>
          <FormLabel fontSize="xl">Create Admin Account</FormLabel>
          <Input name="name" placeholder="Name" size="lg" className="mt-5" onChange={handleChange} type="name"/>
          <Input name="password" placeholder="Password" size="lg" className="mt-5" onChange={handleChange} type="password"/>
          <Box className="flex justify-end mt-5 h-10">
            <Button colorScheme="purple" size="md" onClick={() => { next() }} rightIcon={<AiOutlineArrowRight />}>
              Next 
            </Button>
          </Box>
        </FormControl>
      </Container> 
    </Box>
  );
};

