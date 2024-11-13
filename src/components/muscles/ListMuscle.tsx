// src/components/muscles/ListMuscle.tsx
import ListEntity from '@components/generic/ListEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IMuscle } from "@shared/types/types";
//import { EntityTypes, IMuscle } from '@shared/types/types';

// Provide the right endpoint and props
const ListMuscle = withEntityData<IMuscle>(EntityTypes.Muscle)(({ entities }) => (
	<ListEntity title="Muscles" entities={entities} entityDBName="muscles" />
));

export default ListMuscle;