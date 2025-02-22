export const appstate_page = {
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
	WorkoutExercise = "workoutExercises",
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
	pageType?: string;
	entityData?: never;
	// Optional field for specific entity
	// Add other necessary fields as needed
}

export interface AppData {
	users: IUserDetails[];
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
	idUser: string;
	idWorkout: number;
	idMachine: number;
	idExercise: number;
	max: string;
	ordinal: number;
	setCount?: number;
	setDescription?: string;
	settings?: Record<string, number>;  // Optional
	// Removed ordinal field
}

export const defaultWorkoutExercise: IWorkoutExercise = {
	id: 0,
	entityName: 'default workout exercise',
	idUser: "",
	idWorkout: 0,
	idMachine: 0,
	idExercise: 0,
	max: 'Max not set',
	ordinal: 0,
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
	User = "userDetails",
	Workout = "workouts",
	WorkoutExercise = "workoutExercises",
	Exercise = "exercises",
	SessionWorkout = "sessionWorkouts",
	SessionWorkoutExercise = "sessionWorkoutExercises",
	ActionState = "actionStates",
	Session = "sessions",
	SessionExercise = "sessionExercises",
	EntityRelationship = "entityRelationships",
}



export const defaultUserWorkEx: IWorkoutExercise = {
	id: 0,
	entityName: '',
	idUser: "",
	idWorkout: 0,
	idMachine: 0,
	idExercise: 0,
	max: 'Max not set',
	ordinal: 0,
	settings: {},
};

export interface ISessionWorkout extends WithId {
	id: number;
	idUser: string;
	idWorkout: number;
	complete: boolean;
}

export const defaultSesionWorkout = {
	id: 0,
	idUser: "",
	idWorkout: 0,
	complete: false,
	entityName: 'default session workout',
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
	idUser: string | null;
	fame: number;
}

export const defaultExercise: IExercise = {
	id: 0,
	entityName: 'default exercise',
	idMachine: 0,
	displayNum: 0,
	description: 'default exercise description',
	idUser: "",
	fame: 10
};

export interface ISetting extends WithId {
	id: number;
	entityName: string;
	value: string | null;
	entityId: number | null;
	entityType: string | null;  // Updated to match schema
}

export interface IEntityRelationship extends WithId {
	exerciseId: number ;
	muscleId: number ;
	machineId: number ;
	extraDetails: string | null;
}

export const defaultEntityRelationship: IEntityRelationship = {
	id: 0,
	entityName: 'default ent rel',
	exerciseId: -1,
	muscleId: -1,
	machineId: -1,
	extraDetails: ''


}

export const doesFieldExist = <T extends object>(fieldName: keyof T, entity: T): boolean => {
	return fieldName in entity;
};

export const getFieldValue = (fieldName: string, entity: Record<string, never>): unknown => {
	return Object.prototype.hasOwnProperty.call(entity, fieldName) ? entity[fieldName] : undefined;
};

export enum SettingStatus {
	'new',
	'update',
	'delete',
	'unchanged'
}

export interface ISettingWithStatus extends ISetting {
	status?: SettingStatus;
}

export enum SettingKeys {
	add,
	remove,
	change,
	changeKey,
}

export interface IMachine extends WithIdAndDisplayNum {
	idLocation: number;
	description: string;

}

export const defaultMachine: IMachine = {
	id: 0,
	entityName: 'default Machine',
	displayNum: -1,
	idLocation: 0,
	description: 'default machine description'
};

export const defaultSetting: ISetting = {
	id: 0,
	entityName: "default setting",
	value: "no value",
	entityId: -1,
	entityType: "machine"
}


export const getEntityDefault = <T extends WithId>(
	entityType: EntityTypes
): { defaultEntity: T; entityDBName: string } => {
	switch (entityType) {
		case EntityTypes.Machine:
			return { defaultEntity: defaultMachine as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.Exercise:
			return { defaultEntity: defaultExercise as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.Setting:
			return { defaultEntity: defaultSetting as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.User:
			return { defaultEntity: defaultUser as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.Workout:
			return { defaultEntity: defaultWorkout as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.WorkoutExercise:
			return { defaultEntity: defaultWorkoutExercise as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.Muscle:
			return { defaultEntity: defaultMuscle as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.Location:
			return { defaultEntity: defaultLocation as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.SessionWorkout:
			return { defaultEntity: defaultSesionWorkout as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.SessionWorkoutExercise:
			return { defaultEntity: defaultSessionWorkoutExercise as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.SessionExercise:
			return { defaultEntity: defaultSessionExercise as unknown as T, entityDBName: entityType.toString() };
		case EntityTypes.EntityRelationship:
			return { defaultEntity: defaultEntityRelationship as unknown as T, entityDBName: entityType.toString() };
		default:
			throw new Error(`Unhandled entity type: ${entityType}`);
	}
};

export const requiredFieldsMap: { [key in EntityTypes]?: (keyof never)[] } = {
	[EntityTypes.User]: ['email', 'entityName', 'idLocation'],
	[EntityTypes.Machine]: ['entityName', 'displayNum', 'idLocation', 'description'],
	[EntityTypes.Exercise]: ['entityName', 'idMachine', 'description'],
	[EntityTypes.Workout]: ['entityName', 'idUser','description'],
	[EntityTypes.Location]: ['entityName', 'description'],
	[EntityTypes.Muscle]: ['entityName', 'description'],
	[EntityTypes.Setting]: ['entityName', 'value'],
	[EntityTypes.WorkoutExercise]: ['entityName', 'idUser', 'idWorkout', 'idExercise']
};

// Define required fields and their display names for each entity type
export const requiredDisplayNamesMap: {
	[key in EntityTypes]?: { [field: string]: { displayName: string, type?: string } }
} = {
	[EntityTypes.User]: {
		email: {
			displayName: 'Email'
		},
		entityName: {
			displayName: 'Name'
		},
		idLocation: {
			displayName: 'Location ID'
		}
	},
	[EntityTypes.Machine]: {
		entityName: {
			displayName: 'Name'
		},
		displayNum: {
			displayName: 'Display Number'
		},
		idLocation: {
			displayName: 'Location ID'
		},
		description: {
			displayName: 'Description',
			type: 'textarea'
		}
	},
	[EntityTypes.Exercise]: {
		entityName: {
			displayName: 'Name'
		},
		idMachine: {
			displayName: 'Machine ID'
		},
		description: {
			displayName: 'Description',
			type: 'textarea'
		}
	},
	[EntityTypes.Workout]: {
		entityName: {
			displayName: 'Name'
		},
		idUser: {
			displayName: 'User'
		},
		description: {
			displayName: 'Description',
			type: 'textarea'
		}
	},
	[EntityTypes.Location]: {
		entityName: {
			displayName: 'Location Town'
		},
		description: {
			displayName: 'Getting Here',
			type: 'textarea'
		}
	},
	[EntityTypes.Muscle]: {
		entityName: {
			displayName: 'Name'
		},
		description: {
			displayName: 'Description',
			type: 'textarea'
		},
		muscleFunction: {
			displayName: 'Muscle Function',
			type: 'textarea'
		},
		idParent: {
			displayName: 'Parent ID'
		}
	},
	[EntityTypes.Setting]: {
		entityName: {
			displayName: 'Name'
		},
		value: {
			displayName: 'Value'
		}
	},
	[EntityTypes.WorkoutExercise]: {
		entityName: {
			displayName: 'Name'
		},
		idUser: {
			displayName: 'User ID'
		},
		idWorkout: {
			displayName: 'Workout ID'
		},
		idExercise: {
			displayName: 'Exercise ID'
		}
	}
};
export interface ILocation extends WithId {
	id: number;
	entityName: string;
	description: string;
}

export const defaultLocation: ILocation = {
	id: 0,
	entityName: 'default Location',
	description: 'default location description'
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
	idUser: string;
	entityName: string;
}

export interface IUserDetails extends WithId {
	email: string;
	phoneNumber?: string | null;  // Optional
	idLocation: number;  // Assuming it’s a JSON array
}

export const defaultUser: IUserDetails = {
	id: -1,
	entityName: 'default',
	email: 'default@example.com',
	phoneNumber: '0275560006',
	idLocation: 1,
};

export const defaultUserInfo: IUserDetails = {
	id: -1,
	entityName: 'default',
	email: 'default@example.com',
	phoneNumber: '0275560006',
	idLocation: 1,
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
	idUser: "",
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
		idUser: string;
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
		idUser: string;
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