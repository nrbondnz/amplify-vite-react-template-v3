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
// This interface describes the structure of the context value passed throughout the application.
interface DataContextValue {
	eRM: IEntityManager<IEntityRelationship>; // Entity Relationship Manager
	lM: IEntityManager<ILocation>;            // Location Manager
	mM: IEntityManager<IMachine>;            // Machine Manager
	eM: IEntityManager<IExercise>;           // Exercise Manager
	muM: IEntityManager<IMuscle>;            // Muscle Manager
	uM: IEntityManager<IUserDetails>;        // User Details Manager
	wM: IEntityManager<IWorkout>;            // Workout Manager
	weM: IEntityManager<IWorkoutExercise>;   // Workout Exercise Manager
	sM: IEntityManager<ISetting>;            // Setting Manager

	// Function to retrieve a specific entity manager by entity type
	getManagerByType: (type: EntityTypes) => IEntityManager<any> | undefined;
}

// Create the DataContext
// This React context will be used to provide and consume entity management functionality across components.
export const DataContext = React.createContext<DataContextValue | undefined>(undefined);

// Add the DataProvider
// This is the context provider component that wraps parts of the app and
// shares the entity managers via the context.
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Initialize managers for each entity type with `useEntityData` custom hook
	const eRM = useEntityData<IEntityRelationship>(EntityTypes.EntityRelationship); // Entity Relationships
	const lM = useEntityData<ILocation>(EntityTypes.Location); // Locations
	const mM = useEntityData<IMachine>(EntityTypes.Machine); // Machines
	const eM = useEntityData<IExercise>(EntityTypes.Exercise); // Exercises
	const muM = useEntityData<IMuscle>(EntityTypes.Muscle); // Muscles
	const uM = useEntityData<IUserDetails>(EntityTypes.User); // User Details
	const wM = useEntityData<IWorkout>(EntityTypes.Workout); // Workouts
	const weM = useEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise); // Workout Exercises
	const sM = useEntityData<ISetting>(EntityTypes.Setting); // Settings


	// Memoize the context value to avoid unnecessary re-renders
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
						return eRM; // Return Entity Relationships Manager
					case EntityTypes.Location:
						return lM; // Return Locations Manager
					case EntityTypes.Machine:
						return mM; // Return Machines Manager
					case EntityTypes.Exercise:
						return eM; // Return Exercises Manager
					case EntityTypes.Muscle:
						return muM; // Return Muscles Manager
					case EntityTypes.User:
						return uM; // Return User Details Manager
					case EntityTypes.Workout:
						return wM; // Return Workouts Manager
					case EntityTypes.WorkoutExercise:
						return weM; // Return Workout Exercises Manager
					case EntityTypes.Setting:
						return sM; // Return Settings Manager
					default:
						return undefined; // Return `undefined` if no matching manager exists
				}
			},
		}),
		[eRM, lM, mM, eM, muM, uM, wM, weM, sM] // Dependencies to ensure
		// the memoized value updates correctly
	);

	// Track active subscriptions using a ref
	const subscriptions = useRef<any[]>([]); // Mutable reference for array of subscriptions

	// Effect for managing subscriptions
	useEffect(() => {
		// Unsubscribe from all active subscriptions to avoid duplicates
		subscriptions.current.forEach((sub) => sub.unsubscribe());
		subscriptions.current = []; // Clear the array after unsubscribing

		// Function to create subscriptions for a model and its corresponding entity manager
		const createSubscription = (
			model: any,
			manager: { refreshEntities: () => void }
		) => {
			// Subscribe to model's onUpdate hook
			subscriptions.current.push(
				model.onUpdate().subscribe({
					next: () => {
						console.log(`${model.name} updated, refreshing data...`);
						manager.refreshEntities(); // Refresh manager's data
						console.log(`${model.name} update complete.`);
					},
					error: (err: any) =>
						console.error(`Subscription error (onUpdate - ${model.name}):`, err),
				})
			);

			// Subscribe to model's onCreate hook
			subscriptions.current.push(
				model.onCreate().subscribe({
					next: () => {
						console.log(`${model.name} created, refreshing data...`);
						manager.refreshEntities(); // Refresh manager's data
					},
					error: (err: any) =>
						console.error(`Subscription error (onCreate - ${model.name}):`, err),
				})
			);

			// Subscribe to model's onDelete hook
			subscriptions.current.push(
				model.onDelete().subscribe({
					next: () => {
						console.log(`${model.name} deleted, refreshing data...`);
						manager.refreshEntities(); // Refresh manager's data
					},
					error: (err: any) =>
						console.error(`Subscription error (onDelete - ${model.name}):`, err),
				})
			);
		};

		// Create subscriptions for all entity models
		createSubscription(client.models.entityRelationships, eRM);
		createSubscription(client.models.locations, lM);
		createSubscription(client.models.machines, mM);
		createSubscription(client.models.exercises, eM);
		createSubscription(client.models.muscles, muM);
		createSubscription(client.models.userDetails, uM); // User details subscription
		createSubscription(client.models.workouts, wM);
		createSubscription(client.models.workoutExercises, weM);
		createSubscription(client.models.settings, sM);

		// Cleanup function: Unsubscribe from all active subscriptions when component unmounts
		return () => subscriptions.current.forEach((sub) => sub.unsubscribe());
	}, []); // Empty dependency array ensures this effect runs only once on mount

	// Provide the context value and wrap children in the context provider
	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// Custom hook to use DataContext in child components
export const useDataContext = (): DataContextValue => {
	const context = useContext(DataContext); // Access the data context
	if (!context) {
		// Throw an error if `useDataContext` is called outside DataProvider
		throw new Error("useDataContext must be used within a DataProvider");
	}
	return context; // Return the context value
};