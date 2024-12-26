import React from "react";
import { useParams } from "react-router-dom";
import MuscleSelectionList from "@components/MuscleSelectionList";

const MuscleSelectionListWrapper: React.FC = () => {
  const { muscleId } = useParams<{ muscleId: string }>();

  // Ensure the muscleId is converted to a number
  const id = muscleId ? parseInt(muscleId, 10) : undefined;

  // Render only if muscleId is a valid number
  if (!id) {
    return <div>Invalid or missing muscle ID</div>;
  }

  return <MuscleSelectionList muscleId={id} />;
};

export default MuscleSelectionListWrapper;