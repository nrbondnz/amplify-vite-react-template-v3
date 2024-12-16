// src/shared/types/entityManagerTypes.ts

import {
  IEntityRelationship,
  IExercise,
  ILocation, IMachine,
  IMuscle, ISetting, IUserDetails, IWorkout, IWorkoutExercise
} from "@shared/types/types";

export interface IEntityManager<T> {
  entities: T[];
  setEntities: React.Dispatch<React.SetStateAction<T[]>>;
  error: string | null;
  loading: boolean;
  refreshEntities: () => void;
  fetchEntities: () => Promise<void>;
  filterById: (id: string | number) => T[];
  filterByField: (fieldName: keyof T, fieldValue: string | number) => T[]; // Adjusted signature
  getNextId: () => number;
  getEntityById: (id: string) => T | null;
}

// This is now the manager type for IEntityRelationship
export type EntityRelationshipManager = IEntityManager<IEntityRelationship>
export type LocationManager = IEntityManager<ILocation>
export type MachineManager = IEntityManager<IMachine>
export type ExerciseManager = IEntityManager<IExercise>
export type MuscleManager = IEntityManager<IMuscle>
export type UserManager = IEntityManager<IUserDetails>
export type WorkoutManager = IEntityManager<IWorkout>
export type WorkoutExerciseManager = IEntityManager<IWorkoutExercise>
export type SettingsManager = IEntityManager<ISetting>