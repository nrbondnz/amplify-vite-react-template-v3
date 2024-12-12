import { useDataContext } from "@context/DataContext";
import React from 'react';
import { useParams } from 'react-router-dom';

const MachineDetails: React.FC = () => {
    const { id } = useParams<Record<string, string | undefined>>();
    const dataContext = useDataContext();
    const entities = dataContext.eRM.entities;

    if (!id || !entities) return <div>Loading...</div>;

    const machineId = parseInt(id, 10);

    const exercises = entities
        .filter(rel => rel.machineId === machineId)
        .map(rel => ({
            exerciseId: rel.exerciseId,
            muscles: entities.filter(r => r.exerciseId === rel.exerciseId && r.machineId === machineId).map(r => r.muscleId)
        }));

    return (
        <div>
            <h2>Details for Machine ID: {id}</h2>
            {exercises.map((exercise, index) => (
                <div key={index}>
                    Exercise ID: {exercise.exerciseId}
                    <ul>
                        {exercise.muscles.map((muscleId, idx) => (
                            <li key={idx}>Muscle ID: {muscleId}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MachineDetails;