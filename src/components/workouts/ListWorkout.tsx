// src/components/workouts/ListWorkout.tsx
import ListEntity from '@components/generic/ListEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IWorkout } from "@shared/types/types";
//import { EntityTypes, IWorkout } from '@shared/types/types';

// Provide the right endpoint and props
const ListWorkout = withEntityData<IWorkout>(EntityTypes.Workout)(({ entities }) => (
	<ListEntity title="Workouts" entities={entities} entityDBName="workouts" />
));

export default ListWorkout;