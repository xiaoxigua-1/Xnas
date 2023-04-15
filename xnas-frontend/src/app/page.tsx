"use client";
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { baseInstance, Api } from './api';

const Home: NextPage = () => {
  useEffect(() => {
    (async () => {
      const request = await baseInstance.get<Api<boolean>>("first");
      if (request.data.data) {
        document.location = "/first";
      }
    })();
  }, []);

  return (
    <div>home</div>
  );
};

Home.getInitialProps = async () => {
}

export default Home;
