import coinsmall from "../images/coinsmall.webp";
import claim from "../images/claim.webp";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { EnergyContext } from "../context/EnergyContext";

const TaskOne = ({ showModal, setShowModal }) => {
  const { count, setCount } = useContext(EnergyContext);
  const [idme, setIdme] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [message, setMessage] = useState("");
  const [showTaskButton, setShowTaskButton] = useState(true);
  const [counter, setCounter] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const taskID = "task_3100"; // Assign a unique ID to this task
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  const [isMissionButtonDisabled, setIsMissionButtonDisabled] = useState(true);


  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowModal(false);
      document.getElementById("footermain").style.zIndex = "";
    };
  
    if (showModal) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }
  
    // Cleanup handler when component unmounts
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showModal, setShowModal]);
  



  useEffect(() => {
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (telegramUserid) {
      setIdme(telegramUserid);
    }

    if (telegramUserid) {
      fetchCountFromFirestore(telegramUserid).then((userCount) => {
        setCount(userCount);
    
      });

      checkTaskCompletion(telegramUserid, taskID).then((completed) => {
        setTaskCompleted(completed);
        if (completed) {
          setMessage("");
          setIsMissionButtonDisabled(false);
        }
      });
    }
    // eslint-disable-next-line
  }, []);
  


  const handleTaskLinkClick = () => {
    window.open("https://t.me/plutotapofficial");

    setTimeout(() => {
      setShowTaskButton(false);
    }, 2000);
    setTimeout(() => {
      setShowCheckButton(true);
    }, 2000);
  };

  const handleVerify = async () => {
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    const response = await fetch(
      `https://api.telegram.org/bot7327868388:AAH89ye-KeNy0TcsWFe-ixgXFXKOSRwYDj8/getChatMember?chat_id=-1002244181550&user_id=${idme}`
    );
    const data = await response.json();

    if (data.ok && data.result.status === "member") {
      setIsVerified(true);
      setCounter(15);
      setTimeout(() => {
        setShowDoneButton(true);
      }, 3000);
      setTimeout(() => {
        setShowCheckButton(false);
        setMessage("");
        setIsMissionButtonDisabled(false);
      }, 3000);
    } else {
      setTimeout(() => {
        setMessage(
          "Please join the Telegram channel first before you can claim this task bonus."
        );
      }, 1000);
      setCounter(15);
      const newIntervalId = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter === 1) {
            clearInterval(newIntervalId);
            setShowCheckButton(false);
            setShowTaskButton(true);
            setCounter(null);
          }
          return prevCounter - 1;
        });
      }, 2000);
      setIntervalId(newIntervalId);
    }
  };

  const fetchCountFromFirestore = async (userid) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userCount = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userid) {
          userCount = doc.data().count;
        }
      });
      return userCount;
    } catch (e) {
      console.error("Error fetching document: ", e);
      return 0;
    }
  };


  const updateUserCountInFirestore = async (userid, newCount ) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userDocId = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userid) {
          userDocId = doc.id;
        }
      });

      if (userDocId) {
        const userDocRef = doc(db, "telegramUsers", userDocId);
        await updateDoc(userDocRef, { count: newCount });
        // console.log('User count updated in Firestore.');
      } else {
        console.error("User document not found.");
      }
    } catch (e) {
      console.error("Error updating user count in Firestore: ", e);
    }
  };

  const finishMission = async () => {
    setShowModal(false);
    setOpenComplete(false);
    document.getElementById("congrat").style.opacity = "1";
    document.getElementById("congrat").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("congrat").style.opacity = "0";
      document.getElementById("congrat").style.visibility = "invisible";
    }, 2000);

    if (isVerified) {
      const newCount = count + 50000;
      setCount(newCount);
      setMessage("");
      setIsMissionButtonDisabled(true); // Optionally disable the button again after mission completion
      await saveTaskCompletionToFirestore(idme, taskID, true);
      // Update the user's count in Firestore
      await updateUserCountInFirestore(idme, newCount);

      setTaskCompleted(true);
    } else {
      setMessage("Please verify the task first.");
    }
  };


  return (
    <>
      {showModal ? (
        <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">
          <div className={`w-full flex flex-col items-center justify-start`}>
            <div className="w-full flex justify-start py-2">
              {/* <button
                                className="text-[#e4e4e4] pb-2 transition-colors duration-300 flex items-center space-x-1"
                                onClick={closeTask}
                            >
                                <IoIosArrowBack size={20} className='' /> <span className='text-[18px] font-medium '>Back</span>
                            </button> */}
            </div>
            <div className="flex w-full flex-col">
              <h1 className="text-[20px] font-semibold">Join Our Socials</h1>
              <p className="text-[#9a96a6] text-[16px] font-medium pt-1 pb-10">
                Join our social page to get regular updates about this airdrop
                bot and its great potentials
              </p>

              <p className="w-full text-center text-[14px] font-semibold text-[#49ee49] pb-4">
                {taskCompleted ? "Task is Completed" : ""}
              </p>
              <div className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="">
                    <img src={coinsmall} className="w-[50px]" alt="Coin Icon" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Reward</span>
                    <div className="flex items-center">
                      <span className="font-medium">50 000</span>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-[20px] font-semibold pt-6 pb-4 px-2">
                Your Tasks
              </h1>
              <div className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">
                      Join the Telegram Channel
                    </span>

                    {message && (
                      <span className="text-[#ea5b48] text-[12px] pr-8">
                        {message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="">
                  {taskCompleted ? (
                    <></>
                  ) : (
                    <>
                      {showTaskButton && (
                        <button
                          onClick={handleTaskLinkClick}
                          className={`flex font-medium bg-btn hover:bg-[#1e3356] ease-in duration-300 py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]`}
                        >
                          Go
                        </button>
                      )}
                    </>
                  )}

                  {showCheckButton && (
                    <button
                      onClick={handleVerify}
                      className="flex font-medium bg-btn py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]"
                    >
                      <span> Check</span>
                      <span className="text-[#b0b0b0] pointer-events-none select-none">
                        {counter !== null && (
                          <>
                            <span className="text-[#fff]">ing</span>
                            {` ${counter}s`}
                          </>
                        )}
                      </span>
                    </button>
                  )}
                  {showDoneButton && (
                    <button
                      id="done"
                      className="text-[#7cf47c] font-medium py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]"
                    >
                      Done
                    </button>
                  )}

                  {taskCompleted && <></>}
                </div>
              </div>
              {taskCompleted ? (
                <>
                  <button
                    className={`my-6 w-full py-5 px-3 flex items-center rounded-[12px] justify-center text-center text-[20px] font-medium text-[#6a6978] bg-btn2`}
                  >
                    Mission Completed
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleComplete(true)}
                    disabled={isMissionButtonDisabled}
                    className={`my-6 w-full py-5 px-3 flex items-center rounded-[12px] justify-center text-center text-[20px] font-medium 
                                    ${
                                      isMissionButtonDisabled
                                        ? "text-[#6a6978] bg-btn2"
                                        : "text-[#f4f4f4] bg-btn"
                                    }`}
                  >
                    Finish Mission
                  </button>
                </>
              )}
            </div>

            <div
              className={`${
                openComplete === true ? "visible" : "invisible"
              } absolute bottom-0 left-0 right-0 h-[76vh] bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5`}
            >
              <div className="w-full flex flex-col justify-between py-8">
                <div className="w-full flex justify-center flex-col items-center">
                  <div className="w-[120px] h-[120px] rounded-[14px] bg-[#252e57] flex items-center justify-center">
                    <img alt="claim" src={claim} className="" />
                  </div>
                  <h3 className="font-semibold text-[28px] py-4">
                    Congratulations
                  </h3>
                  <p className="pb-6 text-[#9a96a6] text-[16px]">
                    You have successfully completed the mission
                  </p>

                  <div className="flex flex-1 items-center space-x-2">
                    <div className="">
                      <img
                        src={coinsmall}
                        className="w-[25px]"
                        alt="Coin Icon"
                      />
                    </div>
                    <div className="font-bold text-[20px]">50 000</div>
                  </div>
                </div>

                <div className="w-full flex justify-center pb-12">
                  <button
                    onClick={finishMission}
                    className="bg-gradient-to-b gradient from-[#ffba4c] to-[#aa6900] w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TaskOne;