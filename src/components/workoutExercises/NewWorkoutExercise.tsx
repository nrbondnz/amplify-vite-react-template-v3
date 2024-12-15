import NewEntity from "@components/generic/NewEntity";
import withEntityData from "@components/generic/withEntityData";
import { client } from "@shared/utils/client";
import React from "react";
import { defaultWorkoutExercise, EntityTypes, IWorkoutExercise } from "@shared/types/types";
import { useNavigate } from "react-router-dom";

interface NewWorkoutExerciseProps {
	entityManager: {
		entities: IWorkoutExercise[];
		getEntityById: (id: string) => IWorkoutExercise | null;
		getNextId: () => number;
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const NewWorkoutExercise: React.FC<NewWorkoutExerciseProps> = ({ entityManager }) => {
	const navigate = useNavigate();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IWorkoutExercise) => {
		try {
			newEntity.id = entityManager.getNextId(); // Use `getNextId` to assign ID
			await client.models.workoutExercises.create(newEntity); // Save new entity
			entityManager.refreshEntities(); // Refresh data after saving
			console.log("Saving entity:", newEntity);
			navigate("/workoutExercises"); // Navigate back after saving
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	return (
		<NewEntity
			entity={defaultWorkoutExercise} // Default workout exercise entity
			entityName="Workout Exercise"
			onSave={handleSave}
			onCancel={() => "NEW"}
		/>
	);
};

export default withEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise)(NewWorkoutExercise);