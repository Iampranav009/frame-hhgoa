import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AssetGenerator from './components/AssetGenerator';
import EventDetails from './components/EventDetails';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <AssetGenerator />
      <EventDetails />
      <FAQ />
      <Footer />
    </>
  );
}
