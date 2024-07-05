import React, { useEffect, useState } from 'react'
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import coinsmall from "../images/coinsmall.webp";
import taskbook from "../images/taskbook.webp";
import bronze from "../images/bronze.webp";
import silver from "../images/sliver.webp";
import gold from "../images/gold.webp";
import ref from "../images/ref.webp";
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Spinner from '../Components/Spinner';
import TaskOne from '../Components/TaskOne';
import ClaimLeveler from '../Components/ClaimLeveler';
import Levels from '../Components/Levels';
import { IoCheckmarkSharp } from "react-icons/io5";
import TaskTwo from '../Components/TaskTwo';
import congrats from "../images/celebrate.gif";


const Tasks = () => {

    const levels = {
        bronze: {
            name: 'Bronze',
            minCount: 0,
            nextLevel: 'silver',
            claimCount: 10000,
        },
        silver: {
            name: 'Silver',
            minCount: 400000,
            nextLevel: 'gold',
            claimCount: 200000,
        },
        gold: {
            name: 'Gold',
            minCount: 600000,
            nextLevel: 'platinum',
            claimCount: 30000,
        },
        platinum: {
            name: 'Plattinum',
            minCount: 800000,
            nextLevel: null,
            claimCount: 50000,
        },
    };
    


    const [count, setCount] = useState(0);
    // eslint-disable-next-line
    const [username, setUsername] = useState("");
    // eslint-disable-next-line
    const [idme, setIdme] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [level, setLevel] = useState('bronze');
    const [levelTwo, setLevelTwo] = useState('silver');
    const [levelThree, setLevelThree] = useState('gold');
    const [claimLevel, setClaimLevel] = useState(false);
    const [showLevels, setShowLevels] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskCompleted2, setTaskCompleted2] = useState(false);
    // eslint-disable-next-line
    const [message, setMessage] = useState("");
    const taskID = "task_3100"; // Assign a unique ID to this task
    const taskID2 = "task_406"; // Assign a unique ID to this task


  const [activeIndex, setActiveIndex] = useState(1);

  

  const handleMenu = (index) => {
    setActiveIndex(index);
  };


const taskOne = () => {
    setShowModal(true)
    document.getElementById("footermain").style.zIndex = "50";
}

const taskTwo = () => {
    setShowModal2(true)
    document.getElementById("footermain").style.zIndex = "50";
}

  
  useEffect(() => {

  const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
  const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

  if (telegramUsername) {
    setUsername(telegramUsername);
  }
  if (telegramUserid) {
    setIdme(telegramUserid);
  }

  checkTaskCompletion(telegramUserid, taskID).then((completed) => {
    setTaskCompleted(completed);
    if (completed) {
        setMessage("");
    }
});
  checkTaskCompletion(telegramUserid, taskID2).then((completed) => {
    setTaskCompleted2(completed);
    if (completed) {
        setMessage("");
    }
});


      // Fetch count from Firestore when component mounts
      if (telegramUserid) {
        const userRef = collection(db, 'telegramUsers');
        const q = query(userRef, where('userId', '==', telegramUserid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setCount(data.count);
                setLevel(data.level || 'bronze');
                setLevelTwo(data.level || 'silver');
                setLevelThree(data.level || 'gold');
                setLoading(false);
            });
        }, (error) => {
            console.error('Error fetching document: ', error);
            setLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    } else {
        setLoading(false);
    }

      
}, []);

const checkTaskCompletion = async (userid, taskId, taskId2) => {
    try {
        const userTaskDocRef = doc(db, 'userTasks', `${userid}_${taskId}`);
        const userTaskDocRef2 = doc(db, 'userTasks', `${userid}_${taskId2}`);
        const docSnap = await getDoc(userTaskDocRef, userTaskDocRef2);
        if (docSnap.exists()) {
            return docSnap.data().completed;
        } else {
            return false;
        }
    } catch (e) {
        console.error('Error checking task completion: ', e);
        return false;
    }
};


const levelsAction = () => {

    setShowLevels(true);

    document.getElementById("footermain").style.zIndex = "50";

  }


// useEffect(() => {


//     // Get count from local storage when component mounts
//     const storedCount = localStorage.getItem('count');
//     if (storedCount) {
//       setCount(parseInt(storedCount)); // Parse stored count as integer and set it in state
//     }
//   }, []);

//   const fetchCountFromFirestore = async (userid) => {
//     try {
//       const userRef = collection(db, 'telegramUsers');
//       const querySnapshot = await getDocs(userRef);
//       let userCount = 0;
//       querySnapshot.forEach((doc) => {
//         if (doc.data().userId === userid) {
//           userCount = doc.data().count;
//         }
//       });
//       return userCount;
//     } catch (e) {
//       console.error('Error fetching document: ', e);
//       return 0;
//     }
//   };

const claimSilverLevel = () => {
setClaimLevel(true);
};

const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, " ");
const currentLevel = levels[level];
const level2 = levels[levelTwo];
const level3 = levels[levelThree];
const nextLevel = currentLevel.nextLevel ? levels[currentLevel.nextLevel] : null;
const nextLevel2 = currentLevel.nextLevel ? levels[level2.nextLevel] : null;
const nextLevel3 = currentLevel.nextLevel ? levels[level3.nextLevel] : null;

const progress = nextLevel ? ((count - currentLevel.minCount) / (nextLevel.minCount - currentLevel.minCount)) * 100 : 100;
const progress2 = nextLevel2 ? ((count - currentLevel.minCount) / (nextLevel2.minCount - currentLevel.minCount)) * 100 : 100;
const progress3 = nextLevel3 ? ((count - currentLevel.minCount) / (nextLevel3.minCount - currentLevel.minCount)) * 100 : 100;


  return (

    <>

    {loading ? (
        <Spinner />
      ) : (
    <Animate>
 <div className='w-full justify-center flex-col space-y-3 px-5'>



<div className='fixed top-0 left-0 right-0 pt-8 px-5'>


    <div className="flex space-x-2 justify-center items-center relative">
    <div id="congrat" className='opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all'>
        <img src={congrats} alt="congrats" className="w-full"/>
        </div>
        {/* <Congratulations showCongrats={showCongrats} setShowCongrats={setShowCongrats} /> */}
              <div className="w-[50px] h-[50px]">
                <img src={coinsmall} className="w-full" alt="coin"/>
              </div>
              <h1 className="text-[#fff] text-[42px] font-extrabold">
              {formattedCount}
              </h1>
            </div>
            {/* <div className="w-full flex space-x-1 items-center justify-center">
              <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze"/>
              <h2 className="text-[#9d99a9] text-[20px] font-medium">Wood</h2>
              <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]"/>
            </div> */}

            <div onClick={levelsAction} className="w-full flex ml-[6px] space-x-1 items-center justify-center">
                                <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze" />
                                <h2 className="text-[#9d99a9] text-[20px] font-medium">{currentLevel.name}</h2>
                                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
                            </div>


            <div className='bg-borders w-full px-5 h-[1px] !mt-5 !mb-5'></div>
            
            <div className='w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center'>

                
                <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                    Special
                </div>

                <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                    Leagues
                </div>

                <div onClick={() => handleMenu(3)} className={`${activeIndex === 3 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                    Ref Tasks
                </div>

            </div>

            </div>


            <div className='!mt-[204px] w-full h-[60vh] flex flex-col'>

            <div className={`${activeIndex === 1 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>

                <div onClick={taskOne} className='bg-cards rounded-[10px] p-[14px] flex justify-between items-center'>

                    <div className='flex flex-1 items-center space-x-2'>

                        <div className=''>
                            <img src={taskbook} alt="tasks" className='w-[50px]'/>
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <span className='font-semibold'>
                                Join Our Socials
                            </span>
                            <div className='flex items-center space-x-1'>
                            <span className="w-[20px] h-[20px]">
                <img src={coinsmall} className="w-full" alt="coin"/>
              </span>
              <span className='font-medium'>
                50 000
              </span>
                            </div>
                        </div>

                    </div>

                    {/*  */}

                    <div className=''>
                    {taskCompleted ? (
                                    <>

                    <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]"/>
                                    </>
                                    ) : (
                                    
                                    <>
                      
                    <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]"/>
                                    </>
                                    )}

                                    
                    </div>

                </div>

                {/*  */}

                <div onClick={taskTwo} className='bg-cards rounded-[10px] p-[14px] flex justify-between items-center'>

<div className='flex flex-1 items-center space-x-2'>

    <div className=''>
        <img src={taskbook} alt="taskbook" className='w-[50px]'/>
    </div>
    <div className='flex flex-col space-y-1'>
        <span className='font-semibold'>
            Subscribe To Community
        </span>
        <div className='flex items-center space-x-1'>
        <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
100 000
</span>
        </div>
    </div>

</div>

{/*  */}

<div className=''>
{taskCompleted2 ? (
                                    <>

                    <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]"/>
                                    </>
                                    ) : (
                                    
                                    <>
                      
                    <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]"/>
                                    </>
                                    )}
</div>

</div>



            </div>



{/*  */}


            <div className={`${activeIndex === 2 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>
{/*  */}
{/* {nextLevel && (
                                <div className='w-full flex flex-col items-center'>
                                    <div className='border-borders w-full px-5 h-[1px] !mt-5 !mb-5'></div>
                                    <div className='w-full border-[1px] border-[#39314f] rounded-[10px] p-1 flex items-center'>
                                        <div className='w-full h-[8px] rounded-[8px] bg-energybar'>
                                            <div className='h-full bg-btn rounded-[8px]' style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                            {/* {nextLevel && count >= nextLevel.minCount && (
                                <button onClick={claimSilver} className='bg-[#39314f] rounded-[8px] font-semibold py-2 px-3 text-[#fff6] mt-2'>
                                    Claim {nextLevel.claimCount} Coins
                                </button>
                            )} */}
<div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={bronze} alt="bronze" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
                Bronze
            </span>
            <div className='flex items-center space-x-1'>
            <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
10 000
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
    {nextLevel && count < nextLevel.minCount && (
   <span className='bg-btn2 rounded-[8px] font-semibold py-2 px-3 text-[#fff6]'>
    Claim
   </span>
    )}
    {nextLevel && count >= nextLevel.minCount && (
   <button onClick={() => claimSilverLevel(true)} className='bg-btn relative rounded-[8px] font-semibold py-2 px-3 text-[#fff]'>
    Claim
   </button>
    )}


    </div>
    <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>

    {nextLevel && ( 
        
         <div className='h-[8px] rounded-[8px] bg-btn' style={{ width: `${progress}%` }}> 
         </div>

         )}
   

 

    </div>

</div>
{/*  */}

<div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={silver} alt="silver" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
              Silver
            </span>
            <div className='flex items-center space-x-1'>
            <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
20 000
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
    {nextLevel2 && count < nextLevel2.minCount && (
   <span className='bg-btn2 rounded-[8px] font-semibold py-2 px-3 text-[#fff6]'>
    Claim
   </span>
    )}
    {nextLevel2 && count >= nextLevel2.minCount && (
   <button onClick={() => claimSilverLevel(true)} className='bg-btn relative rounded-[8px] font-semibold py-2 px-3 text-[#fff]'>
    Claim
   </button>
    )}


    </div>
    <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>

    {nextLevel2 && ( 
        
         <div className='h-[8px] rounded-[8px] bg-btn' style={{ width: `${progress2}%` }}> 
         </div>

         )}
   

 

    </div>

</div>


{/*  */}

<div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={gold} alt="gold" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
                Gold
            </span>
            <div className='flex items-center space-x-1'>
            <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
30 000
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
    {nextLevel3 && count < nextLevel3.minCount && (
   <span className='bg-btn2 rounded-[8px] font-semibold py-2 px-3 text-[#fff6]'>
    Claim
   </span>
    )}
    {nextLevel3 && count >= nextLevel3.minCount && (
   <button onClick={() => claimSilverLevel(true)} className='bg-btn relative rounded-[8px] font-semibold py-2 px-3 text-[#fff]'>
    Claim
   </button>
    )}


    </div>
    <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>

    {nextLevel && ( 
        
         <div className='h-[8px] rounded-[8px] bg-btn' style={{ width: `${progress3}%` }}> 
         </div>

         )}
   

 

    </div>

</div>






</div>


{/*  */}


            <div className={`${activeIndex === 3 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>
{/*  */}

<div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={ref} alt="ref" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
            Invite 50 Friends
            </span>
            <div className='flex items-center space-x-1'>
            <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
200 000
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
   
   <span className='bg-btn2 rounded-[8px] font-semibold py-2 px-3 text-[#fff6]'>
    Claim
   </span>
   
 


    </div>
    <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>

    {nextLevel && ( 
        
        <div className='h-[8px] rounded-[8px] bg-btn w-0'> 
         </div>

         )}
   

 

    </div>

</div>
{/*  */}

<div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={ref} alt="ref" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
             Invite 100 Friends
            </span>
            <div className='flex items-center space-x-1'>
            <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
500 000
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
   
   <span className='bg-btn2 rounded-[8px] font-semibold py-2 px-3 text-[#fff6]'>
    Claim
   </span>
   
 


    </div>
    <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>

    {nextLevel && ( 
        
        <div className='h-[8px] rounded-[8px] bg-btn w-0'> 
         </div>

         )}
   

 

    </div>

</div>


{/*  */}

<div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={ref} alt="ref" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
            Invite 500 Friends
            </span>
            <div className='flex items-center space-x-1'>
            <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
2 000 000
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
   
   <span className='bg-btn2 rounded-[8px] font-semibold py-2 px-3 text-[#fff6]'>
    Claim
   </span>
   
 


    </div>
    <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>

    {nextLevel && ( 
        
         <div className='h-[8px] rounded-[8px] bg-btn w-0'> 
         </div>

         )}
   

 

    </div>

</div>







</div>

</div>




<TaskOne showModal={showModal} setShowModal={setShowModal} />
<TaskTwo showModal2={showModal2} setShowModal2={setShowModal2} />
<ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
<Levels showLevels={showLevels} setShowLevels={setShowLevels} />



    </div>
    <Outlet />
    </Animate>
      )}
      </>
  )
}

export default Tasks