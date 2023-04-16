'use client';

import { NextPage } from 'next';
import { useState, useEffect, cache } from 'react';
import { baseInstance, Api } from './api';
import { Box, Container, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';

const Home: NextPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });
  const toast = useToast();

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
    try {
      const request = await baseInstance.post<Api<{ token: string }>>("login", form);
      localStorage.setItem("token", request.data.data.token);
      document.location = "/app";
    } catch (err) {
      // toast error message
      const error = err as AxiosError<Api<{ token: string }>>;
      toast({
        title: "Login error.",
        description: error.response?.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="flex items-center w-full h-full bg-[url(/login/background)] bg-cover bg-center bg-no-repeat">
      <Container className="p-5 bg-white max-w-[400px] rounded-md">
        <FormLabel fontSize="xl" className="text-center">Login</FormLabel>
        <Input name="name" placeholder="Name" size="md" className="mt-5" onChange={handleChange} type="name"/>
        <Input name="password" placeholder="Password" size="md" className="mt-5" onChange={handleChange} type="password"/>
        <Box className="flex justify-end mt-5 h-10">
          <Button colorScheme="purple" size="md" onClick={() => { login() }} type="submit">
            Login 
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
