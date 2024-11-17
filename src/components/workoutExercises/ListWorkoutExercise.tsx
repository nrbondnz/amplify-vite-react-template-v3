// src/components/workouts/ListWorkout.tsx
import ListEntity from '@components/generic/ListEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IWorkoutExercise } from "@shared/types/types";
//import { EntityTypes, IWorkout } from '@shared/types/types';

// Provide the right endpoint and props
const ListWorkoutExercise = withEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise)(({ entities }) => (
	<ListEntity title="Workout Exercises" entities={entities} entityDBName={EntityTypes.WorkoutExercise} />
));
export default ListWorkoutExercise;