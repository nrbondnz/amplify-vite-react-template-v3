﻿import EditEntity from '@components/generic/EditEntity';
import ManageRelationships from "@components/generic/ManageRelationships";
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, IMachine, ISettingWithStatus } from '@shared/types/types';
import { client } from '@shared/utils/client';
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ManageSettings from './ManageSettings';

interface EditMachineProps {
	entities: IMachine[];
	getEntityById: (id: string) => IMachine | null;
	loading: boolean;
}

const EditMachine: React.FC<EditMachineProps> = ({ getEntityById, loading }) => {
	const { id } = useParams<{ id: string }>();
	//const navigate = useNavigate();

	const entity = getEntityById(id!);
	const manageSettingsRef = useRef<{
		saveSettings: () => ISettingWithStatus[],
		saveSettingsToDB: (settings: ISettingWithStatus[]) => Promise<void>,
		settingsChanged: () => boolean
	}>(null);

	const [initialEntity, setInitialEntity] = useState<IMachine | null>(null);
	const [currentEntity, setCurrentEntity] = useState<IMachine | null>(null);
	const [saveEnabled, setSaveEnabled] = useState(false);
	const manageRelationshipsRef = useRef<{ saveRelationships: () => void; cancelRelationships: () => void }>(null);
	const manageRelationshipsRef2 = useRef<{ saveRelationships: () => void; cancelRelationships: () => void }>(null);

	useEffect(() => {
		if (entity) {
			setInitialEntity({ ...entity });
			setCurrentEntity({ ...entity });
		}
	}, [entity]);

	useEffect(() => {
		const entityChanged =
			JSON.stringify(initialEntity) !== JSON.stringify(currentEntity);
		const settingsChanged = manageSettingsRef.current?.settingsChanged() || false;
		setSaveEnabled(entityChanged || settingsChanged);
	}, [initialEntity, currentEntity]);

	if (!id) {
		return <div>No id provided</div>;
	}
	if (loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (updatedEntity: IMachine) => {
		try {
			await client.models.machines.update(updatedEntity);
			console.log('Saving entity:', updatedEntity);

			const currentSettings = manageSettingsRef.current?.saveSettings() || [];
			await manageSettingsRef.current?.saveSettingsToDB(currentSettings);
			manageRelationshipsRef.current?.saveRelationships();
			manageRelationshipsRef2.current?.saveRelationships();
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleDelete = async (updatedEntity: IMachine) => {
		try {
			await client.models.machines.delete(updatedEntity);
			console.log('Deleting entity:', updatedEntity);
			
		} catch (error) {
			console.error('Failed to delete the entity:', error);
		}
	};

	const handleCancel = () => {
		manageRelationshipsRef.current?.cancelRelationships();
		manageRelationshipsRef2.current?.cancelRelationships();
		//navigate('/machines');
	};

	const handleEntityChange = (updatedEntity: IMachine) => {
		setCurrentEntity(updatedEntity);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!entity || !currentEntity) {
		return <div>Entity not found</div>;
	}

	return (
		<>
			<EditEntity
				pEntity={currentEntity}
				pEntityName="machines"
				onSave={handleSave}
				onDelete={handleDelete}
				onCancel={handleCancel}
				onEntityChange={handleEntityChange}
			/>
			<ManageSettings
				entityId={currentEntity.id}
				entityNum={currentEntity.displayNum}
				entityType={EntityTypes.Machine}
				onSaveRef={manageSettingsRef}
			/>
			<button type="button" onClick={() => handleSave(currentEntity)} disabled={!saveEnabled}>
				Save
			</button>
			<ManageRelationships
				ref={manageRelationshipsRef}
				keyId={entity.id}
				keyType={EntityTypes.Machine}
				partnerType={EntityTypes.Muscle}
			/>
			<ManageRelationships
				ref={manageRelationshipsRef2}
				keyId={entity.id}
				keyType={EntityTypes.Machine}
				partnerType={EntityTypes.Exercise}
			/>
		</>
	);
};

export default withEntityData<IMachine>(EntityTypes.Machine)(EditMachine);