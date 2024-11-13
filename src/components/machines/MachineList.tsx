// src/components/locations/ListLocation.tsx
import ListEntity from '@components/generic/ListEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IMachine } from "@shared/types/types";
//import { EntityTypes, ILocation } from '@shared/types/types';

// Provide the right endpoint and props
const MachineList = withEntityData<IMachine>(EntityTypes.Machine)(({ entities }) => (
	<ListEntity title="Machines" entities={entities} entityDBName="machines" />
));

export default MachineList;