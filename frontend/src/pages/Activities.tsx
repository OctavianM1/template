import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../auth/UserProvider";
import "../App.css";
import { useHistory } from "react-router-dom";
import Activity from "../components/Activity";

export interface ActivityValues {
  id: string;
  name: string;
} 

function Activities() {
  const [activities, setActivities] = useState<ActivityValues[] | null>(null);
  const userContext = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:5000/activity/", {
      headers: {
        Authorization: `Bearer ${userContext.user?.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            history.push("/unauthorized");
            return;
          }
          console.log(response.status);
        }
      })
      .then((ac) => {
        setActivities(ac);
      });
  }, [userContext.user?.token, history]);

  useEffect(() => {

  }, []);

  return (
    <div className="form">
      {activities &&
        activities.map((a) => <Activity key={a.id} activity={a} />)}



        
    </div>
  );
}

export default Activities;
