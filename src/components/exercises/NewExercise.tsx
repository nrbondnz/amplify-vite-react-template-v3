// src/components/exercises/NewExercise.tsx
import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import React from 'react';
import withEntityData from '@components/generic/withEntityData';
import { defaultExercise, EntityTypes, IExercise } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface NewExerciseProps {
	loading: boolean;
	getNextId: () => number;
}

const NewExercise: React.FC<NewExerciseProps> = ({ loading, getNextId }) => {
	const navigate = useNavigate();

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IExercise) => {
		try {
			newEntity.id = getNextId(); // Assign the next ID using getNextId()
			await client.models.exercises.create(newEntity);
			console.log('Saving entity:', newEntity);
			navigate('/exercises'); // Navigate to /exercises after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	return <NewEntity entity={defaultExercise} entityName="Exercise" onSave={handleSave} onCancel={() => {navigate('/exercises') }} />;
};

export default withEntityData<IExercise>(EntityTypes.Exercise)(NewExercise);