import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]); // Ensure resumeList is initialized as an empty array

  useEffect(() => {
    if (user) {
      GetResumesList(); // Fetch resume list when user is available
    }
  }, [user]);

  /**
   * Fetches the list of resumes for the logged-in user
   */
  const GetResumesList = () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GlobalApi.GetUserResumes(user.primaryEmailAddress.emailAddress)
        .then((resp) => {
          // Check if the response contains valid data and if it's an array
          const resumes = resp?.data?.data;
          if (Array.isArray(resumes)) {
            setResumeList(resumes); // Set the resume list if data is valid
          } else {
            setResumeList([]); // Set an empty array if data is not valid
          }
        })
        .catch((error) => {
          console.error('Error fetching resumes:', error);
          setResumeList([]); // Set an empty array in case of an error
        });
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start Creating AI resume for your next Job role</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <AddResume />
        {resumeList && resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={index}
              refreshData={GetResumesList}
            />
          ))
        ) : (
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
