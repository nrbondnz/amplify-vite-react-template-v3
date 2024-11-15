import React, { useRef } from 'react';
import { client } from "@shared/utils/client";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EditEntity from '@components/generic/EditEntity';
import ManageRelationships from '@components/generic/ManageRelationships';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IMuscle } from '@shared/types/types';

interface EditMuscleProps {
	entities: IMuscle[];
	getEntityById: (id: string) => IMuscle | null;
	loading: boolean;
}

const EditMuscle: React.FC<EditMuscleProps> = ({ getEntityById, loading }) => {
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

	const handleSaveEntity = async (updatedEntity: IMuscle) => {
		try {
			await client.models.muscles.update(updatedEntity);
			manageRelationshipsRef.current?.saveRelationships();
			console.log('Saving entity:', updatedEntity);
			navigate('/appcontent');
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleDelete = async (updatedEntity: IMuscle) => {
		try {
			await client.models.muscles.delete(updatedEntity);
			console.log('Deleting entity:', updatedEntity);
			navigate('/appcontent');
		} catch (error) {
			console.error('Failed to delete the entity:', error);
		}
	};

	const handleCancel = () => {
		manageRelationshipsRef.current?.cancelRelationships();
		console.log('Canceling changes');
	};

	return (
		<>
			<EditEntity pEntity={entity!} pEntityName="muscles" onSave={handleSaveEntity} onDelete={handleDelete} onCancel={handleCancel} />
			<ManageRelationships
				ref={manageRelationshipsRef}
				keyId={entity.id}
				keyType={EntityTypes.Muscle}
				partnerType={EntityTypes.Exercise}
			/>
		</>
	);
};

export default withEntityData<IMuscle>(EntityTypes.Muscle)(EditMuscle);