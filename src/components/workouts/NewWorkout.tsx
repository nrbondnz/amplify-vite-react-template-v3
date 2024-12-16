import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import React from "react";
import withEntityData from "@components/generic/withEntityData";
import { defaultWorkout, EntityTypes, IWorkout } from "@shared/types/types";
import { useNavigate } from "react-router-dom";

interface NewWorkoutProps {
	entityManager: {
		entities: IWorkout[]; // List of entities
		setEntities: (entities: IWorkout[]) => void;
		getEntityById: (id: string) => IWorkout | null; // Retrieve an entity by its ID
		getNextId: () => number; // Generate the next available ID
		refreshEntities: () => void; // Refresh list of entities
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const NewWorkout: React.FC<NewWorkoutProps> = ({ entityManager }) => {
	const navigate = useNavigate();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IWorkout) => {
		try {
			newEntity.id = entityManager.getNextId(); // Assign the next available ID
			const res = await client.models.workouts.create(newEntity);
			console.log("Save response:", res);
			console.log("Saved entity:", newEntity);
			entityManager.refreshEntities(); // Refresh list after saving
			navigate("/workouts"); // Navigate to workouts page
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleCancel = (): string => {
		console.log("Canceling new entity creation...");
		return "cancelled"; // Return a string for compatibility
	};

	return (
		<NewEntity
			entity={defaultWorkout}
			entityName="workouts"
			onSave={handleSave}
			onCancel={handleCancel}
		/>
	);
};

export default withEntityData<IWorkout>(EntityTypes.Workout)(NewWorkout);