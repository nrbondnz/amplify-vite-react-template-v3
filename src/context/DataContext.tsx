import React, { createContext, useContext, useMemo } from "react";
import { useEntityData } from "@hooks/useEntityData";
import {
	EntityRelationshipManager,
	LocationManager,
	MachineManager,
	ExerciseManager,
	MuscleManager,
	UserManager,
	WorkoutManager,
	WorkoutExerciseManager,
} from "@shared/types/entityManagerTypes";
import {
	EntityTypes,
	IEntityRelationship, IExercise,
	ILocation, IMachine, IMuscle, IUser, IWorkout, IWorkoutExercise
} from "@shared/types/types";

// Extend the DataContext to expose shortened manager names
interface DataContextValue {
	eRM: EntityRelationshipManager; // EntityRelationshipManager as `eRM`
	lM: LocationManager; // LocationManager as `lM`
	mM: MachineManager; // MachineManager as `mM`
	eM: ExerciseManager; // ExerciseManager as `eM`
	muM: MuscleManager; // MuscleManager as `muM`
	uM: UserManager; // UserManager as `uM`
	wM: WorkoutManager; // WorkoutManager as `wM`
	weM: WorkoutExerciseManager; // WorkoutExerciseManager as `weM`
	getManagerByType: (
		entityType: EntityTypes
	) =>
		| EntityRelationshipManager
		| LocationManager
		| MachineManager
		| ExerciseManager
		| MuscleManager
		| UserManager
		| WorkoutManager
		| WorkoutExerciseManager
		| undefined; // Function to fetch the correct manager dynamically
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Initialize managers for all entity types
	const eRM = useEntityData<IEntityRelationship>(EntityTypes.EntityRelationship);
	const lM = useEntityData<ILocation>(EntityTypes.Location);
	const mM = useEntityData<IMachine>(EntityTypes.Machine);
	const eM = useEntityData<IExercise>(EntityTypes.Exercise);
	const muM = useEntityData<IMuscle>(EntityTypes.Muscle);
	const uM = useEntityData<IUser>(EntityTypes.User);
	const wM = useEntityData<IWorkout>(EntityTypes.Workout);
	const weM = useEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise);

	// Map entity types to their respective managers
	// Define a proper type for the managers object
	const managers = useMemo(() => {
		// Initialize the managers map with either a manager or null for unhandled types
		const map: Partial<Record<EntityTypes, any>> = {
			[EntityTypes.EntityRelationship]: eRM,
			[EntityTypes.Location]: lM,
			[EntityTypes.Machine]: mM,
			[EntityTypes.Exercise]: eM,
			[EntityTypes.Muscle]: muM,
			[EntityTypes.User]: uM,
			[EntityTypes.Workout]: wM,
			[EntityTypes.WorkoutExercise]: weM,
		};

		// Fill in missing EntityTypes with null values
		Object.values(EntityTypes).forEach((type) => {
			if (!(type in map)) {
				map[type] = null;
			}
		});

		return map as Record<EntityTypes, any>;
	}, [eRM, lM, mM, eM, muM, uM, wM, weM]);

	const getManagerByType = (
		entityType: EntityTypes
	):
		| EntityRelationshipManager
		| LocationManager
		| MachineManager
		| ExerciseManager
		| MuscleManager
		| UserManager
		| WorkoutManager
		| WorkoutExerciseManager
		| undefined => {
		return managers[entityType]; // Fetch the manager dynamically
	};

	const contextValue = useMemo(
		() => ({
			eRM,
			lM,
			mM,
			eM,
			muM,
			uM,
			wM,
			weM,
			getManagerByType,
		}),
		[eRM, lM, mM, eM, muM, uM, wM, weM, getManagerByType]
	);

	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// Custom hook for accessing the DataContext
export const useDataContext = (): DataContextValue => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useDataContext must be used within a DataProvider");
	}
	return context;
};