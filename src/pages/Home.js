import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../App.css";
import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { EnergyProvider } from "../context/EnergyContext";


const tele = window.Telegram.WebApp;
const Home = () => {

    useEffect(() => {
        tele.ready();
        tele.expand();
        
        window.Telegram.WebApp.setHeaderColor('#191b33'); // Set header color to red

              // Haptic feedback
      if (tele.HapticFeedback) {
        tele.HapticFeedback.impactOccurred("medium");
      }


    }, []);

    const ConditionalEnergyProvider = ({ children }) => {
      const location = useLocation();
      const isTaskRoute = location.pathname === "/task";
      
      if (isTaskRoute) {
        return children; // Do not wrap with EnergyProvider
      }
    
      return <EnergyProvider>{children}</EnergyProvider>; // Wrap with EnergyProvider
    };
    

  return (
<>

<div className="w-full flex justify-center">
        <div className="w-full flex justify-center">
          <div className="flex flex-col pt-8 space-y-3 w-full">


            

      
          <ConditionalEnergyProvider>
            <AnimatePresence mode="wait">
            <Outlet />
            </AnimatePresence>
            </ConditionalEnergyProvider>
          
          



            <div id="footermain" className={`flex flex-col bg-[#1a1f2e] space-y-6 fixed bottom-0 py-6 left-0 right-0 justify-center items-center px-5`}>


           <Footer/>
           </div>
           </div>
           </div>
           </div>
           </>
  );
};

export default Home;
