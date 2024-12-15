import NewEntity from "@components/generic/NewEntity";
import withEntityData from "@components/generic/withEntityData";
import { client } from "@shared/utils/client";
import React from "react";
import { defaultExercise, EntityTypes, IExercise } from "@shared/types/types";
import { useNavigate } from "react-router-dom";

interface NewExerciseProps {
	entityManager: {
		entities: IExercise[];
		getEntityById: (id: string) => IExercise | null;
		getNextId: () => number;
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const NewExercise: React.FC<NewExerciseProps> = ({ entityManager }) => {
	const navigate = useNavigate();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IExercise) => {
		try {
			newEntity.id = entityManager.getNextId(); // Use `getNextId`
			await client.models.exercises.create(newEntity);
			console.log("Saving entity:", newEntity);
			entityManager.refreshEntities(); // Refresh after saving new entity
			navigate("/exercises"); // Navigate back after saving
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	return (
		<NewEntity
			entity={defaultExercise}
			entityName="Exercise"
			onSave={handleSave}
			onCancel={() => "NEW"}
		/>
	);
};

export default withEntityData<IExercise>(EntityTypes.Exercise)(NewExercise);