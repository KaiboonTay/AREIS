// src/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      <h1>About</h1>
      <p>Check out my <Link to="/">Home</Link> page</p>
    </Layout>
  );
};

export default About;