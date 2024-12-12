import { client } from "../shared/utils/client";
import { EntityTypes, WithId } from "../shared/types/types";
import { Amplify } from "aws-amplify";
import { useCallback, useEffect, useState } from 'react';
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

export const useEntityData = <T extends WithId>(entityType: EntityTypes, options?: never) => {
	const [entities, setEntities] = useState<T[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const filterById = (id: number | string): T[] => {
		return entities.filter(entity => entity.id === id);
	};

	const filterByField = (fieldName: keyof T, fieldId: number | string): T[] => {
		return entities.filter(entity => entity[fieldName] === fieldId && entity[fieldName] !== -1);
	};

	const fetchAllEntityData = async (fetchFunction: (options?: any) => Promise<any>) => {let allData: T[] = [];
		let nextToken: string | null | undefined = null;
		const fetchPromises: Promise<void>[] = [];

		const processFetchResponse = (response: any) => {
			console.log('Fetched Response:', response);
			allData = allData.concat(response.data.filter((entry: WithId) => entry.id != -1));
			nextToken = response.nextToken;
		};

		do {
			fetchPromises.push(
				fetchFunction({ limit: 1000, nextToken })
					.then(processFetchResponse)
					.catch(error => {
						console.error(`Error fetching data: ${error instanceof Error ? error.message : error}`);
						// Depending on your needs, handle the error:
						// Option 1: Continue fetching ignoring this error
						// Option 2: Adjust error recovery, fallback, or rethrow if needed
					})
			);
		} while (nextToken);

		await Promise.all(fetchPromises);

		console.log('All Entities Fetched:', allData);
		return allData;
	};

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
					return await fetchAllEntityData((opts) => client.models.workoutExercises.list(opts));
				case EntityTypes.Exercise:
					return await fetchAllEntityData((opts) => client.models.exercises.list(opts));
				case EntityTypes.SessionWorkout:
					return await fetchAllEntityData((opts) => client.models.sessionWorkouts.list(opts));
				case EntityTypes.SessionWorkoutExercise:
					return await fetchAllEntityData((opts) => client.models.sessionWorkoutExercises.list(opts));
				case EntityTypes.EntityRelationship:
					const fred = await fetchAllEntityData((opts) => client.models.entityRelationships.list(opts));
					console.log('Fred:', fred);
					return fred;
				default:
					throw new Error(`Unknown entity type: ${entity}`);
			}
		} catch (error) {
			throw new Error(`Error fetching data for model ${entity}: ${error instanceof Error ? error.message : 'unknown error'}`);
		}
	};

	const getNextId = useCallback((): number => {
		const maxId = entities.reduce((max, entity) => {
			const currentId = entity.id;
			return currentId > max ? currentId : max;
		}, 0);
		return maxId + 1;
	}, [entities]);

	const getEntityById = useCallback((id: number | string): T | null => {
		const numericId = (typeof id === 'string') ? Number(id) : id;
		return entities.find(entity => entity.id === numericId) || null;
	}, [entities]);

	useEffect(() => {
		const fetchEntities = async () => {
			try {
				setLoading(true);
				const responseData = await getResponseByModel(entityType);

				const validData = responseData.map((item) => {
					if (!item || !item.id) {
						throw new Error('API returned item without an id');
					}
					return item;
				});

				const filteredData = validData.filter((item) => item && item.id !== null);
				setEntities(filteredData);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError('An unknown error occurred');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchEntities();
	}, [entityType, options]);

	return { entities, entityType, setEntities, error, getEntityById, getNextId, loading, filterById, filterByField };
};