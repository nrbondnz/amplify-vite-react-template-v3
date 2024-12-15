import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IMuscle } from "@shared/types/types";

const ListMuscle = withEntityData<IMuscle>(EntityTypes.Muscle)(({ entityManager }) => (
	<ListEntity
		title="Muscles"
		entities={entityManager.entities} // Always up to date
		entityDBName="muscles"
	/>
));

export default ListMuscle;