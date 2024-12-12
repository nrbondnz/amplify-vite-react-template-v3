import { useDataContext } from "@context/DataContext";
import React from 'react';
import { useParams } from 'react-router-dom';
//import { useEntities } from "@components/utils/entityFetcher";
import { EntityTypes, IEntityRelationship } from "@shared/types/types";


const ComboDetails: React.FC = () => {
	const { type, id } = useParams<Record<string, string | undefined>>();
	const dataContext = useDataContext();
	const entities  = dataContext.eRM.entities

	if (!type || !id || !entities) {
		return <div>Loading...</div>;
	}

	const entityId = parseInt(id, 10);
	const filteredRelationships = entities.filter((relationship) => {
		switch (type) {
			case EntityTypes.Machine:
				return relationship.machineId === entityId;
			case EntityTypes.Exercise:
				return relationship.exerciseId === entityId;
			case EntityTypes.Muscle:
				return relationship.muscleId === entityId;
			default:
				return false;
		}
	});

	return (
		<div>
			<h2>Details for {type} with ID: {id}</h2>
			<ul>
				{filteredRelationships.map((relationship, index) => (
					<li key={index}>
						{type} relates to {getRelationEntityName(relationship, type)}
					</li>
				))}
			</ul>
		</div>
	);
};

// Helper function to fetch the related entity name based on relationship
const getRelationEntityName = (relationship: IEntityRelationship, currentType: string): string => {
	switch (currentType) {
		case EntityTypes.Machine:
			return `Exercise ID: ${relationship.exerciseId}, Muscle ID: ${relationship.muscleId}`;
		case EntityTypes.Exercise:
			return `Machine ID: ${relationship.machineId}, Muscle ID: ${relationship.muscleId}`;
		case EntityTypes.Muscle:
			return `Machine ID: ${relationship.machineId}, Exercise ID: ${relationship.exerciseId}`;
		default:
			return "Unknown relationship";
	}
};

export default ComboDetails;