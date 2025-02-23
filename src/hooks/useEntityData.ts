import { IEntityManager } from "@shared/types/IEntityManager";
import { client } from "../shared/utils/client";
import { EntityTypes, WithId } from "../shared/types/types";
import { Amplify } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import outputs from "../../amplify_outputs.json";

// Configure Amplify with predefined outputs
Amplify.configure(outputs);

// Hook to manage and provide entity data functionality for a given entity type
export const useEntityData = <T extends WithId,>(entityType: EntityTypes): IEntityManager<T> => {
	const [entities, setEntities] = useState<T[]>([]); // State to store the list of entities
	const [error, setError] = useState<string | null>(null); // State to store potential error messages
	const [loading, setLoading] = useState<boolean>(true); // State to manage loading state

	// Fetch all data for a given entity type, handling paginated responses
	const fetchAllEntityData = async (fetchFunction: (options?: any) => Promise<any>) => {
		let allData: T[] = []; // Array to accumulate all fetched entities
		let nextToken: string | null | undefined = null; // Token for pagination tracking

		// Loop to continue fetching data as long as there is a valid nextToken
		do {
			try {
				console.log(`Fetching data for ${entityType}...`); // Debug log for fetch initiation
				const response = await fetchFunction({ limit: 1000, nextToken }); // Fetch paginated data
				console.log(`Fetched response for ${entityType}:`, response); // Debug log for received response

				// Concatenate valid fetched entities to the accumulated list
				allData = allData.concat(response.data.filter((entry: WithId) => entry.id !== -1));

				// Update nextToken to proceed with fetching the next page
				nextToken = response.nextToken;
			} catch (err: any) {
				// Log and throw an error if fetching fails
				console.error(
					`Error fetching paginated data for ${entityType}:`,
					err.message || err
				);
				throw new Error(`Failed to fetch all data for ${entityType}`);
			}
		} while (nextToken); // Continue if there is more data to fetch

		return allData; // Return the aggregated data after completion
	};

	// Map a given entity type to its corresponding API fetcher
	const getResponseByModel = async (entity: EntityTypes): Promise<T[]> => {
		try {
			switch (entity) {
				case EntityTypes.Location:
					return await fetchAllEntityData((opts) => client.models.locations.list(opts));
				case EntityTypes.User:
					return await fetchAllEntityData((opts) => client.models.userDetails.list(opts));
				case EntityTypes.Machine:
					return await fetchAllEntityData((opts) => client.models.machines.list(opts));
				case EntityTypes.Muscle:
					return await fetchAllEntityData((opts) => client.models.muscles.list(opts));
				case EntityTypes.Setting:
					return await fetchAllEntityData((opts) => client.models.settings.list(opts));
				case EntityTypes.Workout:
					return await fetchAllEntityData((opts) => client.models.workouts.list(opts));
				case EntityTypes.WorkoutExercise:
					return await fetchAllEntityData((opts) =>
						client.models.workoutExercises.list(opts)
					);
				case EntityTypes.Exercise:
					return await fetchAllEntityData((opts) => client.models.exercises.list(opts));
				case EntityTypes.SessionWorkout:
					return await fetchAllEntityData((opts) =>
						client.models.sessionWorkouts.list(opts)
					);
				case EntityTypes.SessionWorkoutExercise:
					return await fetchAllEntityData((opts) =>
						client.models.sessionWorkoutExercises.list(opts)
					);
				case EntityTypes.EntityRelationship:
					return await fetchAllEntityData((opts) =>
						client.models.entityRelationships.list(opts)
					);
				default:
					// Throw an error if the provided entity type is not recognized
					throw new Error(`Unknown entity type: ${entity}`);
			}
		} catch (err: any) {
			console.error(`Error fetching data for ${entity}:`, err.message || err);
			throw new Error(err.message || "Error fetching data");
		}
	};

	// Update a given entity based on entity type
	const updateEntityByModel = async (entity: EntityTypes, updatedEntity: T): Promise<void> => {
		try {
			switch (entity) {
				case EntityTypes.Location:
					await client.models.locations.update(updatedEntity);
					break;
				case EntityTypes.User:
					await client.models.userDetails.update(updatedEntity);
					break;
				case EntityTypes.Machine:
					await client.models.machines.update(updatedEntity);
					break;
				case EntityTypes.Muscle:
					await client.models.muscles.update(updatedEntity);
					break;
				case EntityTypes.Setting:
					await client.models.settings.update(updatedEntity);
					break;
				case EntityTypes.Workout:
					await client.models.workouts.update(updatedEntity);
					break;
				case EntityTypes.WorkoutExercise:
					await client.models.workoutExercises.update(updatedEntity);
					break;
				case EntityTypes.Exercise:
					await client.models.exercises.update(updatedEntity);
					break;
				case EntityTypes.SessionWorkout:
					await client.models.sessionWorkouts.update(updatedEntity);
					break;
				case EntityTypes.SessionWorkoutExercise:
					await client.models.sessionWorkoutExercises.update(updatedEntity);
					break;
				case EntityTypes.EntityRelationship:
					await client.models.entityRelationships.update(updatedEntity);
					break;
				default:
					throw new Error(`Unknown entity type: ${entity}`);
			}
		} catch (err: any) {
			console.error(`Error updating entity for ${entity}:`, err.message || err);
			throw new Error(`Failed to update entity for ${entity}: ${err.message || "unknown error"}`);
		}
	};

	// Fetch entities and synchronize state
	const fetchEntities = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await getResponseByModel(entityType);
			setEntities(data);
		} catch (err: any) {
			setError(err.message || "Failed to fetch entities");
		} finally {
			setLoading(false);
		}
	}, [entityType]);

	// Refresh entities manually
	const refreshEntities = () => {
		fetchEntities();
	};

	// Filter entities by ID
	const filterById = (id: string | number): T[] => {
		return entities.filter((entity) => entity.id === id);
	};

	// Filter entities by a specific field
	const filterByField = (fieldName: keyof T, fieldValue: string | number): T[] => {
		return entities.filter((entity) => entity[fieldName] === fieldValue);
	};

	// Get the next available ID
	const getNextId = (): number => {
		if (!entities || entities.length === 0) return 1;
		return Math.max(...entities.map((entity) => Number(entity.id))) + 1;
	};

	// Get a single entity by ID
	const getEntityById = (id: string): T | null => {
		return entities.find((entity) => entity.id === Number(id)) || null;
	};

	// Update the entity
	const updateEntity = async (updatedEntity: T): Promise<void> => {
		try {
			await updateEntityByModel(entityType, updatedEntity); // Call the update logic

			// Update local state to reflect updated entity
			setEntities((prevEntities) =>
				prevEntities.map((entity) =>
					entity.id === updatedEntity.id ? { ...entity, ...updatedEntity } : entity
				)
			);
		} catch (err: any) {
			setError(err.message || "Failed to update entity");
			console.error(`Error in updateEntity: ${err.message || err}`);
		}
	};

	// Effect to fetch entities on mount
	useEffect(() => {
		fetchEntities();
	}, [fetchEntities]);

	// Return the entity manager object
	return {
		entities,
		setEntities,
		error,
		loading,
		refreshEntities,
		fetchEntities,
		filterById,
		filterByField,
		getNextId,
		getEntityById,
		updateEntity, // Expose updateEntity
	};
};