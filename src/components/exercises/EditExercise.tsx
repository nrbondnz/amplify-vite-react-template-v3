import React, { useRef } from 'react';
import { client } from "@shared/utils/client";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EditEntity from '@components/generic/EditEntity';
import ManageRelationships from '@components/generic/ManageRelationships';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IExercise } from '@shared/types/types';

interface EditExerciseProps {
	entities: IExercise[];
	getEntityById: (id: string) => IExercise | null;
	loading: boolean;
}

const EditExercise: React.FC<EditExerciseProps> = ({ getEntityById, loading }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const manageRelationshipsRef = useRef<{ saveRelationships: () => void; cancelRelationships: () => void }>(null);

	if (loading) {
		return <div>Loading...</div>;
	}

	const entity = getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSaveEntity = async (updatedEntity: IExercise) => {
		console.log('Attempting to save entity:', updatedEntity);
		try {
			const fred = await client.models.exercises.update(updatedEntity);
			console.log('Saved entity:', fred);
			manageRelationshipsRef.current?.saveRelationships();

			navigate('/exercises');
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleDelete = async (updatedEntity: IExercise) => {
		try {
			await client.models.exercises.delete(updatedEntity);
			console.log('Deleting entity:', updatedEntity);
			navigate('/exercises');
		} catch (error) {
			console.error('Failed to delete the entity:', error);
		}
	};

	const handleCancel = () => {
		manageRelationshipsRef.current?.cancelRelationships();
		console.log('Canceling changes');
		navigate('/exercises');
	};

	return (
		<>
			<EditEntity pEntity={entity!} pEntityName="exercises" onSave={handleSaveEntity} onDelete={handleDelete} onCancel={handleCancel} />
			<ManageRelationships
				ref={manageRelationshipsRef}
				keyId={entity.id}
				keyType={EntityTypes.Exercise}
				partnerType={EntityTypes.Muscle}
			/>
		</>
	);
};

export default withEntityData<IExercise>(EntityTypes.Exercise)(EditExercise);