'use client';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { baseInstance, Api } from './api';
import { Box, Container, FormLabel, Input, Button } from '@chakra-ui/react';

const Home: NextPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });

  useEffect(() => {
    (async () => {
      const request = await baseInstance.get<Api<boolean>>("first");
      if (request.data.data) {
        document.location = "/first";
      }

      const token = localStorage.getItem("token");

      if (token) {
        document.location = "/app";
      }
    })();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const login = async() => {
    const form = new FormData();

    form.append("name", formData.name);
    form.append("password", formData.password);

    const request = await baseInstance.post<Api<{ token: string }>>("login", form);
    if (!request.data.error) {
      localStorage.setItem("token", request.data.data.token);
      document.location = "/app";
    } else {
      // todo error message
    }
  };

  return (
    <Box className="flex items-center w-full h-full bg-[url(/login/background)] bg-cover bg-center bg-no-repeat">
      <Container className="p-5 bg-white max-w-[400px] rounded-md">
        <FormLabel fontSize="xl" className="text-center">Login</FormLabel>
        <Input name="name" placeholder="Name" size="md" className="mt-5" onChange={handleChange} type="name"/>
        <Input name="password" placeholder="Password" size="md" className="mt-5" onChange={handleChange} type="password"/>
        <Box className="flex justify-end mt-5 h-10">
          <Button colorScheme="purple" size="md" onClick={() => { login() }} >
            Login 
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
