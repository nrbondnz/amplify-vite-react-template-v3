import React from "react";
import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, ILocation } from "@shared/types/types";

interface ListLocationProps {
	entityManager: {
		entities: ILocation[]; // List of entities
		getEntityById: (id: string) => ILocation | null; // Retrieve an entity by its ID
		getNextId: () => number; // Generate the next available ID
		refreshEntities: () => void; // Function to refresh entity data
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const ListLocation: React.FC<ListLocationProps> = ({ entityManager }) => {
	if (entityManager.loading) {
		return <div>Loading locations...</div>; // Loading feedback
	}

	if (entityManager.error) {
		return <div>Error loading locations: {entityManager.error}</div>; // Error feedback
	}

	if (!entityManager.entities || entityManager.entities.length === 0) {
		return <div>No locations found.</div>; // Handle empty state
	}

	return (
		<ListEntity
			title="Locations"
			entities={entityManager.entities} // List of locations
			entityDBName="locations" // Database name for the entity
		/>
	);
};

export default withEntityData<ILocation>(EntityTypes.Location)(ListLocation);