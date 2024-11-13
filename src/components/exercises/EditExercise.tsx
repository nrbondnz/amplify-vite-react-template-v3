// src/components/exercises/EditExercise.tsx
import { client } from "@shared/utils/client";
import React from 'react';
import {  useParams } from 'react-router-dom';
import EditEntity from '@components/generic/EditEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IExercise } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface EditExerciseProps {
	entities: IExercise[];
	getEntityById: (id: string) => IExercise | null;
	loading: boolean;
}
const EditExercise: React.FC<EditExerciseProps> = ({ getEntityById, loading }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate(); // Use the useNavigate hook

	if (loading) {
		return <div>Loading...</div>;
	}

	const entity = getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: IExercise) => {
		try {
			await client.models.exercises.update(updatedEntity);
			console.log('Saving entity:', updatedEntity);
			navigate('/exercises'); // Navigate to /exercises after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleDelete = async (updatedEntity: IExercise) => {
		try {
			await client.models.exercises.delete(updatedEntity);
			console.log('Deleting entity:', updatedEntity);
			navigate('/exercises'); // Navigate to /exercises after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};
	
	const handleCancel = () => {
		navigate('/exercises');
	}

	return <EditEntity pEntity={entity} pEntityName="Exercise" onSave={handleSave} onDelete={handleDelete} onCancel={handleCancel} />;
};

export default withEntityData<IExercise>(EntityTypes.Exercise)(EditExercise);