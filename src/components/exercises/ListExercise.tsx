// src/components/exercises/ListExercise.tsx
import ListEntity from '@components/generic/ListEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IExercise } from "@shared/types/types";
//import { EntityTypes, IExercise } from '@shared/types/types';

// Provide the right endpoint and props
const ListExercise = withEntityData<IExercise>(EntityTypes.Exercise)(({ entities }) => (
	<ListEntity title="Exercises" entities={entities} entityDBName="exercises" />
));

export default ListExercise;