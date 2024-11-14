
import { client } from "@shared/utils/client";
import React from 'react';
import {  useParams } from 'react-router-dom';
import EditEntity from '@components/generic/EditEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, ILocation, IMuscle } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface EditMuscleProps {
	entities: IMuscle[];
	getEntityById: (id: string) => IMuscle | null;
	loading: boolean;
}
const EditMuscle: React.FC<EditMuscleProps> = ({ getEntityById, loading }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate(); // Use the useNavigate hook

	if (loading) {
		return <div>Loading...</div>;
	}

	const entity = getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: IMuscle) => {
		try {
			await client.models.muscles.update(updatedEntity);
			console.log('Saving entity:', updatedEntity);
			navigate('/appcontent'); // Navigate to /muscles after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};
	

	const handleDelete = async (updatedEntity: ILocation) => {
		try {
			await client.models.muscles.delete(updatedEntity);
			console.log('Deleting entity:', updatedEntity);
			navigate('/appcontent'); // Navigate to /locations after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleCancel = () => {
		navigate('/muscles');
	}

	return <EditEntity pEntity={entity} pEntityName="muscles" onSave={handleSave} onDelete={handleDelete} onCancel={handleCancel}/>;
};

export default withEntityData<IMuscle>(EntityTypes.Muscle)(EditMuscle);