import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import React from 'react';
import withEntityData from '@components/generic/withEntityData';
import {
	defaultLocation,
	EntityTypes,
	ILocation
} from '@shared/types/types';

interface NewLocationProps {
	loading: boolean;
	getNextId?: () => number;
}

export const NewLocation: React.FC<NewLocationProps> = ({ loading}) => {
	//const navigate = useNavigate();

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: ILocation) => {
		try {
			await client.models.locations.create(newEntity);
			console.log('Saving entity:', newEntity);
			//navigate('/locations'); // Navigate to /locations after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	return <NewEntity entity={defaultLocation} entityName="locations" onSave={handleSave} onCancel={() => { console.log("In New Location cancel") }} />;
};

// @ts-ignore
export default withEntityData<ILocation>(EntityTypes.Location)(NewLocation);