// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <h1>Home</h1>
      <p>Check out my <Link to="/about">About</Link> page</p>
    </Layout>
  );
};

export default Home;