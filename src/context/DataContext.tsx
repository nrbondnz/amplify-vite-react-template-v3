import { client } from "@shared/utils/client";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useEntityData } from "@hooks/useEntityData";
import { IEntityManager } from "@shared/types/IEntityManager";
import {
	EntityTypes,
	IEntityRelationship,
	IExercise,
	ILocation,
	IMachine,
	IMuscle,
	ISetting,
	IUserDetails,
	IWorkout,
	IWorkoutExercise
} from "@shared/types/types";

// Define the DataContextValue interface
interface DataContextValue {
	eRM: IEntityManager<IEntityRelationship>;
	lM: IEntityManager<ILocation>;
	mM: IEntityManager<IMachine>;
	eM: IEntityManager<IExercise>;
	muM: IEntityManager<IMuscle>;
	uM: IEntityManager<IUserDetails>;
	wM: IEntityManager<IWorkout>;
	weM: IEntityManager<IWorkoutExercise>;
	sM: IEntityManager<ISetting>;
	getManagerByType: (type: EntityTypes) => IEntityManager<any> | undefined;
}

// Create the DataContext
export const DataContext = React.createContext<DataContextValue | undefined>(undefined);

// Add the DataProvider
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const eRM = useEntityData<IEntityRelationship>(EntityTypes.EntityRelationship);
	const lM = useEntityData<ILocation>(EntityTypes.Location);
	const mM = useEntityData<IMachine>(EntityTypes.Machine);
	const eM = useEntityData<IExercise>(EntityTypes.Exercise);
	const muM = useEntityData<IMuscle>(EntityTypes.Muscle);
	const uM = useEntityData<IUserDetails>(EntityTypes.User);
	const wM = useEntityData<IWorkout>(EntityTypes.Workout);
	const weM = useEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise);
	const sM = useEntityData<ISetting>(EntityTypes.Setting);

	const contextValue: DataContextValue = useMemo(
		() => ({
			eRM,
			lM,
			mM,
			eM,
			muM,
			uM,
			wM,
			weM,
			sM,
			getManagerByType: (type: EntityTypes) => {
				switch (type) {
					case EntityTypes.EntityRelationship:
						return eRM;
					case EntityTypes.Location:
						return lM;
					case EntityTypes.Machine:
						return mM;
					case EntityTypes.Exercise:
						return eM;
					case EntityTypes.Muscle:
						return muM;
					case EntityTypes.User:
						return uM;
					case EntityTypes.Workout:
						return wM;
					case EntityTypes.WorkoutExercise:
						return weM;
					case EntityTypes.Setting:
						return sM;
					default:
						return undefined;
				}
			},
		}),
		[eRM, lM, mM, eM, muM, uM, wM, weM, sM]
	);

	const subscriptions = useRef<any[]>([]); // Track active subscriptions

	useEffect(() => {
		// Clear existing subscriptions to ensure no duplicates
		subscriptions.current.forEach((sub) => sub.unsubscribe());
		subscriptions.current = []; // Reset subscriptions array

		const createSubscription = (
			model: any,
			manager: { refreshEntities: () => void }
		) => {
			// Subscribe to updates
			subscriptions.current.push(
				model.onUpdate().subscribe({
					next: () => {
						console.log(`${model.name} updated, refreshing data...`);
						manager.refreshEntities();
						console.log(`${model.name} updated, refresh complete. entities: `, manager);
					},
					error: (err: any) =>
						console.error(`Subscription error (onUpdate - ${model.name}):`, err),
				})
			);

			// Subscribe to creations
			subscriptions.current.push(
				model.onCreate().subscribe({
					next: () => {
						console.log(`${model.name} created, refreshing data...`);
						manager.refreshEntities();
					},
					error: (err: any) =>
						console.error(`Subscription error (onCreate - ${model.name}):`, err),
				})
			);

			// Subscribe to deletions
			subscriptions.current.push(
				model.onDelete().subscribe({
					next: () => {
						console.log(`${model.name} deleted, refreshing data...`);
						manager.refreshEntities();
					},
					error: (err: any) =>
						console.error(`Subscription error (onDelete - ${model.name}):`, err),
				})
			);
		};

		// Subscribe each entity type to changes with a single instance of subscriptions
		createSubscription(client.models.entityRelationships, eRM);
		createSubscription(client.models.locations, lM);
		createSubscription(client.models.machines, mM);
		createSubscription(client.models.exercises, eM);
		createSubscription(client.models.muscles, muM);
		createSubscription(client.models.userDetails, uM);
		createSubscription(client.models.workouts, wM);
		createSubscription(client.models.workoutExercises, weM);
		createSubscription(client.models.settings, sM);

		// Cleanup when component unmounts
		return () => subscriptions.current.forEach((sub) => sub.unsubscribe());
	}, []); // Empty dependency array ensures subscriptions are created only ONCE


	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// Add useDataContext hook
export const useDataContext = (): DataContextValue => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useDataContext must be used within a DataProvider");
	}
	return context;
};