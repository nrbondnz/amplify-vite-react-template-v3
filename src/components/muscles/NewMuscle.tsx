import NewEntity from "@components/generic/NewEntity";
import withEntityData from "@components/generic/withEntityData";
import { client } from "@shared/utils/client";
import React from "react";
import { defaultMuscle, EntityTypes, IMuscle } from "@shared/types/types";
import { useNavigate } from "react-router-dom";

interface NewMuscleProps {
	entityManager: {
		entities: IMuscle[];
		getEntityById: (id: string) => IMuscle | null;
		getNextId: () => number;
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const NewMuscle: React.FC<NewMuscleProps> = ({ entityManager }) => {
	const navigate = useNavigate();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IMuscle) => {
		try {
			newEntity.id = entityManager.getNextId(); // Generate the next ID
			await client.models.muscles.create(newEntity); // Save the new muscle
			entityManager.refreshEntities(); // Refresh the muscle list after saving
			console.log("Saved entity:", newEntity);
			navigate("/muscles"); // Navigate back to muscles list
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};



	return (
		<NewEntity
			entity={defaultMuscle}
			entityName="muscles"
			onSave={handleSave}
			onCancel={() => "NEW"}
		/>
	);
};

export default withEntityData<IMuscle>(EntityTypes.Muscle)(NewMuscle);