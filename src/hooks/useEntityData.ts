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

	const getResponseByModel = async (entity: EntityTypes): Promise<T[]> => {
		let data: T[] = [];

		try {
			switch (entity) {
				case EntityTypes.Location:
					data = (await client.models.locations.list()).data as T[];
					break;
				/*case EntityTypes.User:
					data = (await client.models.user_details.list()).data as T[];
					break;*/
				case EntityTypes.Machine:
					data = (await client.models.machines.list()).data as unknown as T[];
					break;
				case EntityTypes.Muscle:
					data = (await client.models.muscles.list()).data as unknown as T[];
					break;
				case EntityTypes.Setting:
					data = (await client.models.settings.list()).data as unknown as T[];
					break;
				case EntityTypes.Workout:
					data = (await client.models.workouts.list()).data  as unknown as T[];
					break;
				case EntityTypes.WorkoutExercise:
					data = (await client.models.workout_exercises.list()).data  as unknown as T[];
					break;
				case EntityTypes.Exercise:
					data = (await client.models.exercises.list()).data  as unknown as T[];
					break;
				case EntityTypes.SessionWorkout:
					data = (await client.models.session_workouts.list()).data  as unknown as T[];
					break;
				case EntityTypes.SessionWorkoutExercise:
					data = (await client.models.session_workout_exercises.list()).data  as unknown as T[];
					break;
				default:
					throw new Error(`Unknown entity type: ${entity}`);
			}

			if (!data) {
				throw new Error(`No data returned for entity type: ${entity}`);
			}

			return data;
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

	return { entities, setEntities, error, getEntityById, getNextId, loading, filterById};
};