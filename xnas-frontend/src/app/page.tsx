"use client";
import { NextPage } from 'next';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  useEffect(() => {
    document.location = "/first";
  }, []);

  return (
    <div>home</div>
  );
};

Home.getInitialProps = async () => {
}

export default Home;
