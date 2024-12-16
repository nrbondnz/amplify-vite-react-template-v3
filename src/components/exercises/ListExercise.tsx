import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IExercise } from "@shared/types/types";

// Using withEntityData HOC to wrap ListEntity
const ListExercise = withEntityData<IExercise>(EntityTypes.Exercise)(({ entityManager }) => (
	<ListEntity
		title="Exercises"
		entityDBName="exercises"
		entities={entityManager.entities as IExercise[]} // Pass entities explicitly
	/>
));

export default ListExercise;