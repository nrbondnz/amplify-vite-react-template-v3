// src/components/workouts/NewWorkout.tsx
import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import React from 'react';
import withEntityData from '@components/generic/withEntityData';
import { defaultWorkout, EntityTypes, IWorkout } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface NewWorkoutProps {
	loading: boolean;
	getNextId: () => number;
}

const NewWorkout: React.FC<NewWorkoutProps> = ({ loading, getNextId }) => {
	const navigate = useNavigate();

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IWorkout) => {
		try {
			newEntity.id = getNextId(); // Assign the next ID using getNextId()
			await client.models.workouts.create(newEntity);
			console.log('Saving entity:', newEntity);
			navigate('/workouts'); // Navigate to /workouts after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
			
		}
	};

	return <NewEntity entity={defaultWorkout} entityName="workouts" onSave={handleSave} onCancel={() => {navigate('/workouts') }} />;
};

export default withEntityData<IWorkout>(EntityTypes.Workout)(NewWorkout);