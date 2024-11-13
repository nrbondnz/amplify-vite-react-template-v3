// src/components/locations/ListLocation.tsx
import ListEntity from '@components/generic/ListEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, ILocation } from "@shared/types/types";
//import { EntityTypes, ILocation } from '@shared/types/types';

// Provide the right endpoint and props
const ListLocation = withEntityData<ILocation>(EntityTypes.Location)(({ entities }) => (
	<ListEntity title="Locations" entities={entities} entityDBName="locations" />
));

export default ListLocation;