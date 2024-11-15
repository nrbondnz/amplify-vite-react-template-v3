﻿export const appstate_page = {
	ADMIN_OVERVIEW_PAGE: "ADMIN_OVERVIEW_PAGE",
	LOGIN_PAGE: "LOGIN_PAGE",
	LIST_USERS_PAGE: "LIST_USERS_PAGE",
	LIST_EXERCISES_PAGE: "LIST_EXERCISES_PAGE",
	LIST_MACHINES_PAGE: "LIST_MACHINES_PAGE",
	LIST_WORKOUTS_PAGE: "LIST_WORKOUTS_PAGE",
	LIST_US_WK_EXS_PAGE: "LIST_US_WK_EXS_PAGE",
	LIST_MUSCLES_PAGE: "LIST_MUSCLES_PAGE",
	EDIT_USER_PAGE: "EDIT_USER_PAGE",
	EDIT_EXERCISE_PAGE: "EDIT_EXERCISE_PAGE",
	EDIT_MACHINE_PAGE: "EDIT_MACHINE_PAGE",
	NEW_USER_PAGE: "NEW_USER_PAGE",
	NEW_MACHINE_PAGE: "NEW_MACHINE_PAGE",
	NEW_EXERCISE_PAGE: "NEW_EXERCISE_PAGE",
	EDIT_WORKOUT_PAGE: "EDIT_WORKOUT_PAGE",
	NEW_WORKOUT_PAGE: "NEW_WORKOUT_PAGE",
	NEW_MUSCLE_PAGE: "NEW_MUSCLE_PAGE",
	EDIT_MUSCLE_PAGE: "EDIT_MUSCLE_PAGE",
	DEBUG_DASHBOARD: "DEBUG_DASHBOARD",
	NO_PAGE: "NO_PAGE"
} as const;

export enum AppStatePage {
	Machine = "machines",
	User = "user_details",
	Exercise = "exercises",
	Workout = "workouts",
	Muscle = "muscles",
	Location = "locations",
	WorkoutExercise = "workout_exercises",
	Settings = "settings"
	
}

export type AppstatePage = typeof appstate_page[keyof typeof appstate_page];

export const appstate_command = {
	DELETE_GENERIC_ENTITY: "DELETE_GENERIC_ENTITY",
	EDIT_GENERIC_ENTITY: "EDIT_GENERIC_ENTITY",
	SET_ACTION_STATES: "SET_ACTION_STATES",
	NEW_USER: "NEW_USER",
	NEW_MACHINE: "NEW_MACHINE",
	NEW_MUSCLE: "NEW_MUSCLE",
	NEW_EXERCISE: "NEW_EXERCISE",
	NEW_WORKOUT: "NEW_WORKOUT",
	ADD_EXERCISE_TO_WORKOUT: "ADD_EXERCISE_TO_WORKOUT",
	SET_DATA: "SET_DATA",
	SET_LOADING: "SET_LOADING",
	EDIT_ACTION_STATE: "EDIT_ACTION_STATE",
	EDIT_USER: "EDIT_USER",
	EDIT_EXERCISE: "EDIT_EXERCISE",
	EDIT_MACHINE: "EDIT_MACHINE",
	EDIT_MUSCLE: "EDIT_MUSCLE",
	EDIT_US_WK_EX: "EDIT_US_WK_EX",
	DELETE_MACHINE: "DELETE_MACHINE",
	DELETE_EXERCISE: "DELETE_EXERCISE",
	DELETE_WORKOUT: "DELETE_WORKOUT",
	DELETE_USER: "DELETE_USER",
	DELETE_US_WK_EX: "DELETE_US_WK_EX",
	DELETE_MUSCLE: "DELETE_MUSCLE",
	NO_COMMAND: "NO_COMMAND"
} as const;

export type AppstateCommand = typeof appstate_command[keyof typeof appstate_command];

export interface AppEvent {
	entity: string;
	actionType: string;
	entityId: number;
	entityData: any;
	// Optional field for specific entity
	// Add other necessary fields as needed
}

export interface AppData {
	users: IUser[];
	exercises: IExercise[];
	locations: ILocation[];
	machines: IMachine[];
	muscles: IMuscle[];
	workoutExercises: IWorkoutExercise[];
	workouts: IWorkout[];
	actionStates: IActionState[];
	sessionWorkouts: ISessionWorkout[];
	sessionWorkoutExercises: ISessionWorkoutExercise[];
}

export const initialState: AppData = {
	users: [],
	exercises: [],
	locations: [],
	machines: [],
	muscles: [],
	workouts: [],
	workoutExercises: [],
	actionStates: [],
	sessionWorkouts: [],
	sessionWorkoutExercises: [],
};

export interface WithId { id: number; entityName: string }

export interface WithIdAndDisplayNum extends WithId {
	displayNum: number;
}

export interface IWorkoutExercise extends WithId {
	id: number;
	entityName: string;
	idUser: number;
	idWorkout: number;
	idMachine: number;
	idExercise: number;
	max: string;
	settings?: Record<string, number>;  // Optional
	// Removed ordinal field
}

export const defaultWorkoutExercise: IWorkoutExercise = {
	id: 0,
	entityName: 'default workout exercise',
	idUser: 0,
	idWorkout: 0,
	idMachine: 0,
	idExercise: 0,
	max: 'Max not set',
	settings: {},
};

export interface IEntity {
	id: number;
	name: string;
}

export interface IEntityData<T> {
	entities: T[];
}

export enum EntityTypes {
	Machine = "machines",
	Location = "locations",
	Muscle = "muscles",
	Setting = 'settings',
	User = "users",
	Workout = "workouts",
	WorkoutExercise = "workout_exercises",
	Exercise = "exercises",
	SessionWorkout = "session_workouts",
	SessionWorkoutExercise = "session_workout_exercises",
	ActionState = "action_states",
	Session = "sessions",
	SessionExercise = "session_exercises",
	EntityRelationship = "entity_relationships",
	
}

export const defaultUserWorkEx: IWorkoutExercise = {
	id: 0,
	entityName: '',
	idUser: 0,
	idWorkout: 0,
	idMachine: 0,
	idExercise: 0,
	max: 'Max not set',
	settings: {},
};

export interface ISessionWorkout extends WithId {
	id: number;
	idUser: number;
	idWorkout: number;
	complete: boolean;
}

export const defaultSesionWorkout = {
	id: 0,
	idUser: 0,
	idWorkout: 0,
	complete: false
}

export const defaultSessionWorkoutExercise = {
	id: 0,
	idSessionWorkout: 0,
	idExercise: 0,
	notes: '',
}

export const defaultSessionExercise = {
	id: 0,
	idSession: 0,
	idExercise: 0,
}

export interface ISessionWorkoutExercise extends WithId {
	id: number;
	idSessionWorkout: number;  // Renamed from idSession
	idExercise: number;
	notes: string;
	complete: boolean;
}

export interface IExercise extends WithIdAndDisplayNum {
	id: number;
	entityName: string;
	idMachine: number;
	displayNum: number;
	description: string;
	idUser: number | null;  // Nullable field
}

export const defaultExercise: IExercise = {
	id: 0,
	entityName: 'default exercise',
	idMachine: 0,
	displayNum: 0,
	description: 'default exercise description',
	idUser: null
};

export interface ISetting extends WithId {
	id: number;
	entityName: string;
	value: string | null;
	entityId: number | null;
	entityType: string | null;  // Updated to match schema
}

export interface IEntityRelationship extends WithId {
	exerciseId: number | null;
	muscleId: number | null;
	machineId: number | null;
}

export const defaultEntityRelationship: IEntityRelationship = {
	id: 0,
	entityName: 'default exercise',
	exerciseId: null,
	muscleId: null,
	machineId: null

}

export interface ISettingWithStatus extends ISetting {
	status?: 'new' | 'update' | 'delete';
}

export enum SettingKeys {
	add,
	remove,
	change,
	changeKey,
}

export interface IMachine extends WithIdAndDisplayNum {
	id: number;           // Reflects the auto-incremented primary key
	entityName: string;
	displayNum: number;
	idLocation: number;

}

export const defaultMachine: IMachine = {
	id: 0,
	entityName: 'default Machine',
	displayNum: -1,
	idLocation: 0,
};

export const defaultSetting: ISetting = {
	id: 0,
	entityName: "default setting",
	value: "no value",
	entityId: -1,
	entityType: "machine"
}

export const getEntityDefault = <T>(entityType: EntityTypes): T => {
	switch (entityType) {
		case EntityTypes.Machine:
			return defaultMachine as T;
		case EntityTypes.Exercise:
			return defaultExercise as T;
		case EntityTypes.Setting:
			return defaultSetting as T;
		case EntityTypes.User:
			return defaultUser as T;
		case EntityTypes.Workout:
			return defaultWorkout as T;
		case EntityTypes.WorkoutExercise:
			return defaultWorkoutExercise as T;
		case EntityTypes.Muscle:
			return defaultMuscle as T;
		case EntityTypes.Location:
			return defaultLocation as T;
		case EntityTypes.SessionWorkout:
			return defaultSesionWorkout as T;
		case EntityTypes.SessionWorkoutExercise as T:
			return defaultSessionWorkoutExercise as T;
		case EntityTypes.SessionExercise:
			return defaultSessionExercise as T;
		case EntityTypes.EntityRelationship:
			return defaultEntityRelationship as T;
					
		default:
			throw new Error(`Unhandled entity type: ${entityType}`);
	}
};

export const requiredFieldsMap: { [key in EntityTypes]?: (keyof any)[] } = {
	[EntityTypes.User]: ['email', 'entityName', 'idLocation'],
	[EntityTypes.Machine]: ['entityName', 'displayNum', 'idLocation'],
	[EntityTypes.Exercise]: ['entityName', 'idMachine', 'description'],
	[EntityTypes.Workout]: ['entityName', 'idUser'],
	[EntityTypes.Location]: ['entityName'],
	[EntityTypes.Muscle]: ['entityName', 'description'],
	[EntityTypes.Setting]: ['entityName', 'value'],
	[EntityTypes.WorkoutExercise]: ['entityName', 'idUser', 'idWorkout', 'idExercise']
};

// Define required fields and their display names for each entity type
export const requiredDisplayNamesMap: {
	[key in EntityTypes]?: { [field: string]: string }
} = {
	[EntityTypes.User]: { email: 'Email', entityName: 'Name', idLocation: 'Location ID' },
	[EntityTypes.Machine]: { entityName: 'Name', displayNum: 'Display Number', idLocation: 'Location ID' },
	[EntityTypes.Exercise]: { entityName: 'Name', idMachine: 'Machine ID', description: 'Description' },
	[EntityTypes.Workout]: { entityName: 'Name', idUser: 'User ID' },
	[EntityTypes.Location]: { entityName: 'Location Town' },
	[EntityTypes.Muscle]: { entityName: 'Name', description: 'Description' },
	[EntityTypes.Setting]: { entityName: 'Name', value: 'Value' },
	[EntityTypes.WorkoutExercise]: { entityName: 'Name', idUser: 'User ID', idWorkout: 'Workout ID', idExercise: 'Exercise ID' }
};
export interface ILocation extends WithId {
	id: number;
	entityName: string;
}

export const defaultLocation: ILocation = {
	id: 0,
	entityName: 'default Location'
};

// amplify/data/types.ts
export type CreateEntityInput = {
	id?: number;
	content?: string;
	isDone?: boolean;
};

export type Entity = {
	id: number;
	content: string;
	isDone: boolean;
};

export interface IWorkout extends WithId {
	id: number;
	idUser: number;
	entityName: string;
}

export interface IUser extends WithId {
	email: string;
	phoneNumber?: string | null;  // Optional
	idLocation: number;
	roles: string[];  // Assuming it’s a JSON array
}

export const defaultUser: IUser = {
	id: -1,
	entityName: 'default',
	email: 'default@example.com',
	phoneNumber: '0275560006',
	idLocation: 1,
	roles: ['user']
};

export const defaultUserInfo: IUser = {
	id: -1,
	entityName: 'default',
	email: 'default@example.com',
	phoneNumber: '0275560006',
	idLocation: 1,
	roles: ['user']
};

export interface IMuscle extends WithIdAndDisplayNum {
	entityName: string;
	description: string;
	muscleFunction?: string | null;  // Made optional or nullable as per the updated DB schema
	idParent?: number | null;
	parentName?: string | null;  // Additional type-nullable check for consistency
}

export const defaultMuscle: IMuscle = {
	id: 0,
	entityName: 'default Muscle',
	displayNum: 0,
	description: 'default muscle description',
	idParent: null,
	parentName: "",
	muscleFunction: ""
};

export interface IActionState extends WithId {
	LOADED: string;  // New field added
	appPage: string;
	appCommand: string;
	entityId?: number | null;
	parentId?: number | null;
	parentName?: string | null;
}

export const defaultWorkout: IWorkout = {
	id: 0,
	idUser: 0,
	entityName: 'default workout',
};

export const defaultActionState: IActionState = {
	id: 1,
	LOADED: "",  // Default value for new field
	appPage: appstate_page.ADMIN_OVERVIEW_PAGE,
	appCommand: appstate_command.NO_COMMAND,
	entityId: -1,
	entityName: "",
	parentId: -1,
	parentName: ""
};

// Types for different function props
export interface NewMachineProps {
	type: "NEW_MACHINE";
}

export interface EditMachineProps {
	machine: IMachine;
}

interface ExerciseSelectorProps {
	type: "EXERCISE_SELECTOR";
	payload: {
		workout: IWorkout;
	};
}

export interface ListWorkoutsProps {
	type: string;
	payload: {
		name: string;
		id: number;
		value: object;
	};
}

export interface NewWorkoutProps {
	type: string;
	payload: {
		idUser: number;
	};
}

// Union type for function props
export type FunctionProps =
	NewMachineProps
	| EditMachineProps
	| ListWorkoutsProps
	| NewWorkoutProps
	| ExerciseSelectorProps;

// Optional props
export interface CompProps {
	props?: FunctionProps;
}

// Define various props interfaces for different actions
export interface NewMachineProps {
	type: "NEW_MACHINE";
}

export interface EditMachineProps {
	machine: IMachine;
}

interface ExerciseSelectorProps {
	type: "EXERCISE_SELECTOR";
	payload: {
		workout: IWorkout;
	};
}

export interface ListWorkoutsProps {
	type: string;
	payload: {
		name: string;
		id: number;
		value: object;
	};
}

export interface NewWorkoutProps {
	type: string;
	payload: {
		idUser: number;
	};
}

// Optional props
export interface CompProps {
	props?: FunctionProps;
}

// Example action creation functions for various entity types
export interface DeleteUsWkExProps {
	id: number;
	// Add other properties as needed
}