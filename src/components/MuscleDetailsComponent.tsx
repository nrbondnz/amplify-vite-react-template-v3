import { useDataContext } from "@context/DataContext";
import React from 'react';
import { useParams } from 'react-router-dom';

const MuscleDetails: React.FC = () => {
    const { id } = useParams<Record<string, string | undefined>>();
    const dataContext = useDataContext();
    const entities  = dataContext.eRM.entities;

    if (!id || !entities) return <div>Loading...</div>;

    const muscleId = parseInt(id, 10);

    const machines = entities
        .filter(rel => rel.muscleId === muscleId)
        .map(rel => ({
            machineId: rel.machineId,
            exercises: entities.filter(r => r.machineId === rel.machineId && r.muscleId === muscleId).map(r => r.exerciseId)
        }));

    return (
        <div>
            <h2>Details for Muscle ID: {id}</h2>
            {machines.map((machine, index) => (
                <div key={index}>
                    Machine ID: {machine.machineId}
                    <ul>
                        {machine.exercises.map((exerciseId, idx) => (
                            <li key={idx}>Exercise ID: {exerciseId}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MuscleDetails;