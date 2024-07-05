import React, { createContext, useState, useEffect } from "react";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const EnergyContext = createContext();

const refillTime = 2 * 60 * 1000; // 2 minutes in milliseconds

const EnergyProvider = ({ children }) => {
  const [energy, setEnergy] = useState(500);
  const [displayEnergy, setDisplayEnergy] = useState(500);
  const [idme, setIdme] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (energy < 500) {
        setEnergy((prevEnergy) => {
          const newEnergy = Math.min(prevEnergy + 2, 500);
          setDisplayEnergy(newEnergy); // Update display energy when refilling
          if (idme) {
            updateUserStatsInFirestore(idme, count, newEnergy); // Update Firestore with new energy level
          }
          return newEnergy;
        });
      }
    }, refillTime / 100);
    return () => clearInterval(interval);
  }, [energy, count, idme]);

  const updateUserStatsInFirestore = async (userid, newCount, newEnergy) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userid) {
          updateDoc(doc.ref, { count: newCount, energy: newEnergy, lastInteraction: new Date() });
        }
      });
      console.log("User stats updated:", { newCount, newEnergy });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };
  

  return (
    <EnergyContext.Provider
      value={{
        energy,
        setEnergy,
        displayEnergy,
        setDisplayEnergy,
        idme,
        setIdme,
        count,
        setCount,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export { EnergyContext, EnergyProvider };
