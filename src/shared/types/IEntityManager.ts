// src/shared/types/entityManagerTypes.ts

import {
  IEntityRelationship,
  IExercise,
  ILocation, IMachine,
  IMuscle, ISetting, IUser, IWorkout, IWorkoutExercise
} from "@shared/types/types";

export interface IEntityManager<T> {
  entities: T[]; // Array of entities
  setEntities: React.Dispatch<React.SetStateAction<T[]>>; // Function to manage state
  error: string | null; // Error state
  loading: boolean; // Loading state
  filterById: (id: number | string) => T[]; // Filter entities by ID
  filterByField: (fieldName: keyof T, fieldId: number | string) => T[]; // Filter entities by a field
  getNextId: () => number; // Get the next available entity ID
  getEntityById: (id: number | string) => T | null; // Get an entity by ID
}

// This is now the manager type for IEntityRelationship
export type EntityRelationshipManager = IEntityManager<IEntityRelationship>
export type LocationManager = IEntityManager<ILocation>
export type MachineManager = IEntityManager<IMachine>
export type ExerciseManager = IEntityManager<IExercise>
export type MuscleManager = IEntityManager<IMuscle>
export type UserManager = IEntityManager<IUser>
export type WorkoutManager = IEntityManager<IWorkout>
export type WorkoutExerciseManager = IEntityManager<IWorkoutExercise>
export type SettingsManager = IEntityManager<ISetting>