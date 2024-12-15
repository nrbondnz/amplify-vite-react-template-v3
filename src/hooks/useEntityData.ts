import { client } from "../shared/utils/client";
import { EntityTypes, WithId } from "../shared/types/types";
import { Amplify } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

export const useEntityData = <T extends WithId>(entityType: EntityTypes) => {
	const [entities, setEntities] = useState<T[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Fetch all data in paginated manner
	const fetchAllEntityData = async (fetchFunction: (options?: any) => Promise<any>) => {
		let allData: T[] = [];
		let nextToken: string | null | undefined = null;

		// Paginated fetching
		do {
			try {
				const response = await fetchFunction({ limit: 1000, nextToken });
				console.log(`Fetched response for ${entityType}:`, response);
				allData = allData.concat(response.data.filter((entry: WithId) => entry.id !== -1));
				nextToken = response.nextToken;
			} catch (err: any) {
				console.error(
					`Error fetching paginated data for ${entityType}:`,
					err.message || err
				);
				throw new Error(`Failed to fetch all data for ${entityType}`);
			}
		} while (nextToken);

		return allData;
	};

	// Map entity type to API response fetchers
	const getResponseByModel = async (entity: EntityTypes): Promise<T[]> => {
		try {
			switch (entity) {
				case EntityTypes.Location:
					return await fetchAllEntityData((opts) => client.models.locations.list(opts));
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
					throw new Error(`Unknown entity type: ${entity}`);
			}
		} catch (err: any) {
			throw new Error(
				`Error fetching data for entity type ${entity}: ${err.message || "unknown error"}`
			);
		}
	};

	// Fetch entities (used for initial load or data refresh)
	const fetchEntities = async () => {
		try {
			setLoading(true);
			setEntities([]); // Clear entities to ensure React detects changes to the state
			const responseData = await getResponseByModel(entityType);

			// Ensure valid data
			const validData = responseData.map((item) => {
				if (!item?.id) {
					throw new Error("API returned item without an id");
				}
				return item;
			});

			setEntities(validData); // Update entities state
		} catch (err: any) {
			console.error(`Error during fetchEntities for ${entityType}:`, err.message || err);
			setError(err.message || "Unknown error occurred while fetching entities.");
		} finally {
			setLoading(false); // Ensure loading is off after fetch process
		}
	};

	// Refresh entity list by calling the fetchEntities method
	const refreshEntities = () => {
		console.log(`Refreshing entities for ${entityType}...`);
		fetchEntities();
	};

	// Filter entities by ID
	const filterById = (id: number | string): T[] => {
		const numericId = typeof id === "string" ? parseInt(id) : id;
		return entities.filter((entity) => entity.id === numericId);
	};

	// Filter entities by a specific field
	const filterByField = (fieldName: keyof T, fieldValue: number | string): T[] => {
		return entities.filter(
			(entity) => entity[fieldName] === fieldValue && entity[fieldName] !== -1
		);
	};

	// Retrieve a specific entity by ID
	const getEntityById = useCallback(
		(id: number | string): T | null => {
			const numericId = typeof id === "string" ? parseInt(id) : id;
			return entities.find((entity) => entity.id === numericId) || null;
		},
		[entities]
	);

	// Retrieve the next available ID (for new entities)
	const getNextId = useCallback((): number => {
		const maxId = entities.reduce((max, entity) => (entity.id > max ? entity.id : max), 0);
		return maxId + 1;
	}, [entities]);

	// Effect to fetch initial entities on hook call
	useEffect(() => {
		fetchEntities(); // Fetch entities when hook is initialized
	}, [entityType]);

	// Return hook values
	return {
		entities,
		setEntities,
		error,
		loading,
		refreshEntities,
		fetchEntities,
		filterById,
		filterByField,
		getEntityById,
		getNextId,
	};
};