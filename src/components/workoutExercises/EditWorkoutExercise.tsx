import React, { useRef } from "react";
import withEntityData from "@components/generic/withEntityData";
import { client } from "@shared/utils/client";
import { useParams, useNavigate } from "react-router-dom";
import EditEntity from "@components/generic/EditEntity";
import { EntityTypes, IWorkoutExercise } from "@shared/types/types";

interface EditWorkoutExerciseProps {
	entityManager: {
		entities: IWorkoutExercise[];
		setEntities: (entities: IWorkoutExercise[]) => void;
		getEntityById: (id: string) => IWorkoutExercise | null;
		getNextId: () => number;
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const EditWorkoutExercise: React.FC<EditWorkoutExerciseProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Manage relationships if needed in the future
	const manageRelationshipsRef = useRef<{ saveRelationships: () => void; cancelRelationships: () => void }>(null);

	// Handle loading state
	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	// Handle invalid or undefined ID
	if (!id) {
		return <div>Invalid entity ID</div>;
	}

	// Retrieve the workout exercise by ID
	const entity = entityManager.getEntityById(id);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: IWorkoutExercise) => {
		try {
			await client.models.workoutExercises.update(updatedEntity); // Save updated entity
			entityManager.refreshEntities(); // Refresh entities afterward
			manageRelationshipsRef.current?.saveRelationships(); // Save any relationships if applicable
			console.log("Saving entity:", updatedEntity);
			navigate("/workoutExercises"); // Navigate back to the list
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleDelete = async (updatedEntity: IWorkoutExercise) => {
		try {
			await client.models.workoutExercises.delete(updatedEntity); // Delete the entity
			entityManager.refreshEntities(); // Refresh data after deletion
			console.log("Deleting entity:", updatedEntity);
			navigate("/workoutExercises"); // Navigate back to the list
		} catch (error) {
			console.error("Failed to delete the entity:", error);
		}
	};

	const handleCancel = () => {
		manageRelationshipsRef.current?.cancelRelationships(); // Cancel relationships if applicable
		navigate("/workoutExercises"); // Navigate back to the list
	};

	return (
		<EditEntity
			pEntity={entity}
			pEntityName="Workout Exercise"
			onSave={handleSave}
			onDelete={handleDelete}
			onCancel={handleCancel}
		/>
	);
};

export default withEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise)(EditWorkoutExercise);