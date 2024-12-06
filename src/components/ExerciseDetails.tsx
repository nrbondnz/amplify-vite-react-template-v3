import React from 'react';
import { useParams } from 'react-router-dom';
import { useEntityData } from "@hooks/useEntityData";
import { EntityTypes, IEntityRelationship } from "@shared/types/types";

const ExerciseDetails: React.FC = () => {
	const { id } = useParams<Record<string, string | undefined>>();
	const { entities } = useEntityData<IEntityRelationship>(EntityTypes.EntityRelationship);

	if (!id || !entities) return <div>Loading...</div>;

	const exerciseId = parseInt(id, 10);

	// Create a map to ensure each muscle is only listed once per machine
	const machinesData = entities
		.filter(rel => rel.exerciseId === exerciseId)
		.reduce((acc, rel) => {
			const machineId = rel.machineId;
			if (!acc[machineId!]) {
				acc[machineId!] = new Set<number>();
			}
			acc[machineId!].add(rel.muscleId!);
			return acc;
		}, {} as Record<number, Set<number>>);

	return (
		<div>
			<h2>Details for Exercise ID: {exerciseId}</h2>
			{Object.entries(machinesData).map(([machineId, muscles], index) => (
				<div key={index}>
					<h3>Machine ID: {machineId}</h3>
					<ul>
						{[...muscles].map((muscleId, idx) => (
							<li key={idx}>Muscle ID: {muscleId}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default ExerciseDetails;