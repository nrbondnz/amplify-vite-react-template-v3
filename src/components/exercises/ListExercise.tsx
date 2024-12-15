import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IExercise } from "@shared/types/types";

const ListExercise = withEntityData<IExercise>(EntityTypes.Exercise)(({ entityManager }) => (
	<ListEntity
		title="Exercises"
		entities={entityManager.entities} // Always up to date
		entityDBName="exercises"
	/>
));

export default ListExercise;