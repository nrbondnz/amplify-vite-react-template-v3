import { useEntityData } from "@hooks/useEntityData";
import {
	EntityRelationshipManager,
	ExerciseManager,
	LocationManager,
	MachineManager,
	MuscleManager,
	UserManager,
	WorkoutExerciseManager,
	WorkoutManager,
	SettingsManager
} from "@shared/types/IEntityManager";
import {
	EntityTypes,
	IEntityRelationship,
	IExercise,
	ILocation,
	IMachine,
	IMuscle,
	ISetting,
	IUser,
	IWorkout,
	IWorkoutExercise
} from "@shared/types/types";
import React, { createContext, useContext, useMemo } from "react";

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
	sM: SettingsManager; // SettingsManager as `sM`

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
		| SettingsManager
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
	const sM = useEntityData<ISetting>(EntityTypes.Setting);

	// Map entity types to their respective managers
	const managers = useMemo(() => {
		const map: Partial<Record<EntityTypes, any>> = {
			[EntityTypes.EntityRelationship]: eRM,
			[EntityTypes.Location]: lM,
			[EntityTypes.Machine]: mM,
			[EntityTypes.Exercise]: eM,
			[EntityTypes.Muscle]: muM,
			[EntityTypes.User]: uM,
			[EntityTypes.Workout]: wM,
			[EntityTypes.WorkoutExercise]: weM,
			[EntityTypes.Setting]: sM, // Added SettingsManager here
		};

		// Ensure every EntityType is defined in the map
		Object.values(EntityTypes).forEach((type) => {
			if (!(type in map)) {
				map[type] = null;
			}
		});

		return map as Record<EntityTypes, any>;
	}, [eRM, lM, mM, eM, muM, uM, wM, weM, sM]);

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
		| SettingsManager
		| undefined => {
		// Safely cast here to avoid type error
		return managers[entityType] as
			| EntityRelationshipManager
			| LocationManager
			| MachineManager
			| ExerciseManager
			| MuscleManager
			| UserManager
			| WorkoutManager
			| WorkoutExerciseManager
			| SettingsManager
			| undefined;
	};

	// Context value memo
	const contextValue: DataContextValue = useMemo(
		() => ({
			getManagerByType,
		eRM,
		lM,
		mM,
		eM,
		muM,
		uM,
		wM,
		weM,
		sM,
		}),
		[eRM, lM, mM, eM, muM, uM, wM, weM, sM]
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