// src/shared/types/entityManagerTypes.ts

import {
  IEntityRelationship,
  IExercise,
  ILocation, IMachine,
  IMuscle, IUser, IWorkout, IWorkoutExercise
} from "@shared/types/types";

export interface EntityManagerTypes<T> {
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
export type EntityRelationshipManager = EntityManagerTypes<IEntityRelationship>
export type LocationManager = EntityManagerTypes<ILocation>
export type MachineManager = EntityManagerTypes<IMachine>
export type ExerciseManager = EntityManagerTypes<IExercise>
export type MuscleManager = EntityManagerTypes<IMuscle>
export type UserManager = EntityManagerTypes<IUser>
export type WorkoutManager = EntityManagerTypes<IWorkout>
export type WorkoutExerciseManager = EntityManagerTypes<IWorkoutExercise>