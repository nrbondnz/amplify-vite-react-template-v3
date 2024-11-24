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
		// Ensure default values for selection elements


		console.log('Attempting to save entity:', newEntity);
		try {
			console.log('New entity before save:', JSON.stringify(newEntity, null, 2));

			const response = await client.models.locations.create(newEntity);

			if (response.data) {
				console.log('Entity saved successfully:', response);
				//navigate('/locations'); // Navigate to /locations after saving
			} else {
				console.warn('Entity save responded with no data:', response);
			}
		} catch (error) {
			console.error('Failed to save the entity:', error);
			console.error('Error details:', error);
		}
	};

	return <NewEntity entity={defaultLocation} entityName="locations" onSave={handleSave} onCancel={() => "NEW"} />;
};

// @ts-ignore
export default withEntityData<ILocation>(EntityTypes.Location)(NewLocation);