import { IEntityManager } from "@shared/types/IEntityManager";
import { Amplify } from "aws-amplify";
import { client } from "@shared/utils/client";
import React, { useEffect, useMemo, useRef } from "react";
import { useEntityData } from "@hooks/useEntityData";
import {
	EntityTypes,
	IEntityRelationship,
	IExercise,
	ILocation,
	IMachine,
	IMuscle,
	IUser,
	IWorkout,
	IWorkoutExercise,
	ISetting,
} from "../shared/types/types";
import outputs from "../../amplify_outputs.json";

// Extend IEntityManager to include refreshEntities
interface IEntityManagerWithRefresh<T> extends IEntityManager<T> {
	refreshEntities: () => void;
}

// Define DataContextValue type
interface DataContextValue {
	eRM: IEntityManagerWithRefresh<IEntityRelationship>;
	lM: IEntityManagerWithRefresh<ILocation>;
	mM: IEntityManagerWithRefresh<IMachine>;
	eM: IEntityManagerWithRefresh<IExercise>;
	muM: IEntityManagerWithRefresh<IMuscle>;
	uM: IEntityManagerWithRefresh<IUser>;
	wM: IEntityManagerWithRefresh<IWorkout>;
	weM: IEntityManagerWithRefresh<IWorkoutExercise>;
	sM: IEntityManagerWithRefresh<ISetting>;

	// Method to retrieve an entity manager by type
	getManagerByType: (entityType: EntityTypes) => IEntityManagerWithRefresh<any> | undefined;
}

Amplify.configure(outputs);

// Create the DataContext
export const DataContext = React.createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Wrap IEntityManager with a refreshEntities capability
	const withRefresh = <T,>(
		manager: IEntityManager<T>,
		refreshEntities: () => void
	): IEntityManagerWithRefresh<T> => ({
		...manager,
		refreshEntities,
	});

	// Entity Managers setup
	const eRM = withRefresh(
		useEntityData<IEntityRelationship>(EntityTypes.EntityRelationship),
		() => console.log("Refreshing EntityRelationships")
	);
	const lM = withRefresh(
		useEntityData<ILocation>(EntityTypes.Location),
		() => console.log("Refreshing Locations")
	);
	const mM = withRefresh(
		useEntityData<IMachine>(EntityTypes.Machine),
		() => console.log("Refreshing Machines")
	);
	const eM = withRefresh(
		useEntityData<IExercise>(EntityTypes.Exercise),
		() => {
			console.log("Refreshing Exercises")
			eM.refreshEntities;
			console.log("Refresh complete. entities: ", eM.entities);
		}
	);
	const muM = withRefresh(
		useEntityData<IMuscle>(EntityTypes.Muscle),
		() => console.log("Refreshing Muscles")
	);
	const uM = withRefresh(
		useEntityData<IUser>(EntityTypes.User),
		() => console.log("Refreshing Users")
	);
	const wM = withRefresh(
		useEntityData<IWorkout>(EntityTypes.Workout),
		() => console.log("Refreshing Workouts")
	);
	const weM = withRefresh(
		useEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise),
		() => console.log("Refreshing WorkoutExercises")
	);
	const sM = withRefresh(
		useEntityData<ISetting>(EntityTypes.Setting),
		() => console.log("Refreshing Settings")
	);

	// Subscription management
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

	// Context API method: Retrieve manager by entity type
	const getManagerByType = (entityType: EntityTypes): IEntityManagerWithRefresh<any> | undefined => {
		switch (entityType) {
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
				return undefined; // Handle unsupported entity types
		}
	};

	// Context value
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
			getManagerByType,
		}),
		[eRM, lM, mM, eM, muM, uM, wM, weM, sM]
	);

	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// Hook to consume the context
export const useDataContext = () => {
	const context = React.useContext(DataContext);
	if (!context) {
		throw new Error("useDataContext must be used within a DataProvider");
	}
	return context;
};