// src/components/muscles/NewMuscle.tsx
import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import React from 'react';
import withEntityData from '@components/generic/withEntityData';
import { defaultMuscle, EntityTypes, IMuscle } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface NewMuscleProps {
	loading: boolean;
	getNextId: () => number;
}

const NewMuscle: React.FC<NewMuscleProps> = ({ loading, getNextId }) => {
	const navigate = useNavigate();

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IMuscle) => {
		try {
			newEntity.id = getNextId(); // Assign the next ID using getNextId()
			await client.models.muscles.create(newEntity);
			console.log('Saving entity: ', newEntity);
			const newList = await client.models.muscles.list();
			console.log("newList", newList);
			// TODO workout if we can remove appcontent navigate.
			//  AppContent will fire to update its settings but display?
			//navigate('/appcontent'); // Navigate to /muscles after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};
	
	const handleCancel = () => {
		navigate('/muscles');
	}

	return 
				<NewEntity entity={defaultMuscle} entityName="muscles" onSave={handleSave} onCancel={handleCancel} />
			
};

export default withEntityData<IMuscle>(EntityTypes.Muscle)(NewMuscle);