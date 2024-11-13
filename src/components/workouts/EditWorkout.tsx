// src/components/workouts/EditWorkout.tsx
//import { useSubscription } from "@context/SubscriptionContext";
import { client } from "@shared/utils/client";
//import { deleteWorkouts } from "mutations";
import React from 'react';
import {  useParams } from 'react-router-dom';
import EditEntity from '@components/generic/EditEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IWorkout } from '@shared/types/types';

interface EditWorkoutProps {
	entities: IWorkout[];
	getEntityById: (id: string) => IWorkout | null;
	loading: boolean;
}
const EditWorkout: React.FC<EditWorkoutProps> = ({ getEntityById, loading }) => {
	const { id } = useParams<{ id: string }>();
	//const navigate = useNavigate(); // Use the useNavigate hook
	//const { addCustomEvent } = useSubscription();

	if (loading) {
		return <div>Loading...</div>;
	}

	const entity = getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: IWorkout) => {
		try {
			await client.models.workouts.update(updatedEntity);
			console.log('Saving entity:', updatedEntity);
			//navigate('/appcontent'); // Navigate to /workouts after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleDelete = async (updatedEntity: IWorkout) => {
		try {
			client.models.workouts.delete({id:updatedEntity.id})
			console.log('Deleting entity:', updatedEntity);
			console.log("Post delete : ", client.models.workouts.list);
			//navigate('/appcontent'); // Navigate to /workouts after saving
		} catch (error) {
			console.error('Failed to delete the entity:', error);
		}
	};
	
	const handleCancel = () => {
		
	}

	return <EditEntity pEntity={entity} pEntityName="workouts"  onSave={handleSave} onDelete={handleDelete} onCancel={handleCancel} />;
};

export default withEntityData<IWorkout>(EntityTypes.Workout)(EditWorkout);