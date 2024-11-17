import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import React from 'react';
import withEntityData from '@components/generic/withEntityData';
import { defaultWorkoutExercise, EntityTypes, IWorkoutExercise } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface NewWorkoutExerciseProps {
	loading: boolean;
	getNextId: () => number;
}

const NewWorkoutExercise: React.FC<NewWorkoutExerciseProps> = ({ loading, getNextId }) => {
	const navigate = useNavigate();

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IWorkoutExercise) => {
		try {
			newEntity.id = getNextId(); // Assign the next ID using getNextId()
			await client.models.workout_exercises.create(newEntity);
			console.log('Saving entity:', newEntity);
			navigate('/workoutExercises'); // Navigate to /workoutExercises after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);

		}
	};

	return <NewEntity entity={defaultWorkoutExercise} entityName={EntityTypes.WorkoutExercise} onSave={handleSave} onCancel={() => "NEW" } />;
};
export default withEntityData<IWorkoutExercise>(EntityTypes.WorkoutExercise)(NewWorkoutExercise);
