import NewEntity from "@components/generic/NewEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, ILocation, getEntityDefault } from "@shared/types/types";
import { client } from "@shared/utils/client";
import React from "react";
import { useNavigate } from "react-router-dom";

interface NewLocationProps {
	entityManager: {
		entities: ILocation[]; // List of locations
		getEntityById: (id: string) => ILocation | null; // Retrieve location by ID
		getNextId: () => number; // Generate the next location ID
		refreshEntities: () => void; // Refresh the locations list
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const NewLocation: React.FC<NewLocationProps> = ({ entityManager }) => {
	const navigate = useNavigate();

	// Handle loading state
	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: ILocation) => {
		try {
			newEntity.id = entityManager.getNextId(); // Assign the next ID
			const savedLocation = await client.models.locations.create(newEntity);
			console.log("Saving location:", savedLocation);

			entityManager.refreshEntities(); // Refresh list after saving
			navigate("/locations"); // Navigate back to the locations list
		} catch (error) {
			console.error("Failed to save the location:", error);
		}
	};

	const handleCancel = (): string => {
		navigate("/locations");
		return "cancelled";
	};

	return (
		<NewEntity
			entity={getEntityDefault<ILocation>(EntityTypes.Location).defaultEntity}
			entityName="locations"
			onSave={handleSave}
			onCancel={handleCancel}
		/>
	);
};

// Always export the default as the HOC-wrapped component
export default withEntityData<ILocation>(EntityTypes.Location)(NewLocation);