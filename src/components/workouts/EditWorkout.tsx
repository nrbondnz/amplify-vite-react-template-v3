import ListEntity from "@components/generic/ListEntity";
import { useDataContext } from "@context/DataContext";
import { client } from "@shared/utils/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditEntity from "@components/generic/EditEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IWorkout } from "@shared/types/types";

interface EditWorkoutProps {
	entityManager: {
		entities: IWorkout[]; // List of entities
		setEntities: (entities: IWorkout[]) => void;
		getEntityById: (id: string) => IWorkout | null; // Retrieve an entity by its ID
		getNextId: () => number; // Generate the next ID (not required, but part of the injected type)
		refreshEntities: () => void; // Function to refresh entities
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const EditWorkout: React.FC<EditWorkoutProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();
	const { weM } = useDataContext();

	// State to hold the workout entity and its exercises
	const [workoutExercises, setWorkoutExercises] = useState<any[]>([]); // Change the type based on your exercise structure
	const [loadingExercises, setLoadingExercises] = useState(true);
	const [error, setError] = useState<null | string>(null);

	// Fetch exercises for the selected workout
	useEffect(() => {
		const fetchWorkoutExercises = async () => {
			try {
				setLoadingExercises(true);
				setError(null);

				// Fetch exercises for the workout using `weM`
				const exercisesArray = weM
					.filterByField("idWorkout", +id!);

				// Convert the iterator into an array
				//const exercises = Array.from(exercisesArray);

				// Set the exercises in state
				setWorkoutExercises(exercisesArray);
				console.log("Workout exercises:", exercisesArray);
			} catch (error) {
				console.error("Failed to load workout exercises:", error);
				setError("Failed to load workout exercises.");
			} finally {
				setLoadingExercises(false);
			}
		};

		fetchWorkoutExercises();
	}, [id, weM]);

	// If entity manager is loading, show a loading indicator
	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	// Try to get the entity by ID
	const entity = entityManager.getEntityById(id!);

	// If the entity is not found, show an error message
	if (!entity) {
		return <div>Entity not found</div>;
	}

	// Event handlers for save, delete, and cancel actions
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

	// Render workout edit form and exercises list
	return (
		<div>
			{/* Workout Edit Form */}
			<EditEntity
				pEntity={entity}
				pEntityName="workouts"
				onSave={handleSave}
				onDelete={handleDelete}
				onCancel={handleCancel}
			/>

			{/* Display Loading, Error, or the ListEntity */}
			{loadingExercises ? (
				<div>Loading workout exercises...</div>
			) : error ? (
				<div className="error">{error}</div>
			) : (
				<ListEntity
					title={`Workout Exercises for ${entity.entityName}`}
					entities={workoutExercises} // Pass fetched data
					entityDBName="workoutExercises"
					sortable={true}
				/>
			)}
		</div>
	);
};

export default withEntityData<IWorkout>(EntityTypes.Workout)(EditWorkout);