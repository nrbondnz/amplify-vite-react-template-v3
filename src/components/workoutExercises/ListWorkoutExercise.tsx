import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IWorkoutExercise } from "@shared/types/types";

const ListWorkoutExercise = withEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise)(({ entityManager }) => (
	<ListEntity
		title="Workout Exercises"
		entities={entityManager.entities} // Use `entities` from `entityManager`
		entityDBName="workoutExercises"
	/>
));

export default ListWorkoutExercise;