import { client } from "@shared/utils/client";
import React from "react";
import { useParams } from "react-router-dom";
import EditEntity from "@components/generic/EditEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IWorkout } from "@shared/types/types";

interface EditWorkoutProps {
	entityManager: {
		entities: IWorkout[]; // List of entities
		getEntityById: (id: string) => IWorkout | null; // Retrieve an entity by its ID
		getNextId: () => number; // Generate the next ID (not required, but part of the injected type)
		refreshEntities: () => void; // Function to refresh entities
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const EditWorkout: React.FC<EditWorkoutProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const entity = entityManager.getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: IWorkout) => {
		try {
			await client.models.workouts.update(updatedEntity);
			console.log("Saving entity:", updatedEntity);
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleDelete = async (updatedEntity: IWorkout) => {
		try {
			await client.models.workouts.delete({ id: updatedEntity.id });
			console.log("Deleting entity:", updatedEntity);
		} catch (error) {
			console.error("Failed to delete the entity:", error);
		}
	};

	const handleCancel = () => {
		console.log("Canceling changes...");
		return "cancelled";
	};

	return (
		<EditEntity
			pEntity={entity}
			pEntityName="workouts"
			onSave={handleSave}
			onDelete={handleDelete}
			onCancel={handleCancel}
		/>
	);
};

export default withEntityData<IWorkout>(EntityTypes.Workout)(EditWorkout);