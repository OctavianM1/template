import React from "react";
import { ActivityValues } from "../pages/Activities";

function Activity({ activity }: { activity: ActivityValues }) {
  return (
    <div>
      Id: {activity.id}, name: {activity.name}
    </div>
  );
}

export default Activity;
