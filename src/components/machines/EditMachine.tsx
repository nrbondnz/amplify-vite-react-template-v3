import EditEntity from "@components/generic/EditEntity";
import ManageRelationships from "@components/generic/ManageRelationships";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IMachine, ISettingWithStatus } from "@shared/types/types";
import { client } from "@shared/utils/client";
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ManageSettings from "./ManageSettings";

interface EditMachineProps {
	entityManager: {
		entities: IMachine[]; // List of machines
		setEntities: (entities: IMachine[]) => void;
		getEntityById: (id: string) => IMachine | null; // Retrieve machine by ID
		getNextId: () => number; // Generate new machine ID (optional but part of the type)
		refreshEntities: () => void; // Refresh list of machines
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const EditMachine: React.FC<EditMachineProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();

	const entity = entityManager.getEntityById(id!);
	const manageSettingsRef = useRef<{
		saveSettings: () => ISettingWithStatus[];
		saveSettingsToDB: (settings: ISettingWithStatus[]) => Promise<void>;
		settingsChanged: () => boolean;
	}>(null);

	const manageRelationshipsRef = useRef<{ saveRelationships: () => void; cancelRelationships: () => void }>(null);
	const manageRelationshipsRef2 = useRef<{ saveRelationships: () => void; cancelRelationships: () => void }>(null);

	const [initialEntity, setInitialEntity] = useState<IMachine | null>(null);
	const [currentEntity, setCurrentEntity] = useState<IMachine | null>(null);
	const [saveEnabled, setSaveEnabled] = useState(false);

	useEffect(() => {
		if (entity) {
			setInitialEntity({ ...entity });
			setCurrentEntity({ ...entity });
		}
	}, [entity]);

	useEffect(() => {
		const entityChanged = JSON.stringify(initialEntity) !== JSON.stringify(currentEntity);
		const settingsChanged = manageSettingsRef.current?.settingsChanged() ?? false;
		setSaveEnabled(entityChanged || settingsChanged);
	}, [initialEntity, currentEntity]);

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	if (!id) {
		return <div>No id provided</div>;
	}

	if (!entity || !currentEntity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: IMachine) => {
		try {


			const currentSettings = manageSettingsRef.current?.saveSettings() || [];
			await manageSettingsRef.current?.saveSettingsToDB(currentSettings);
			manageRelationshipsRef.current?.saveRelationships();
			manageRelationshipsRef2.current?.saveRelationships();
			await client.models.machines.update(updatedEntity);
			console.log("Saving entity:", updatedEntity);
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleDelete = async (updatedEntity: IMachine) => {
		try {
			await client.models.machines.delete(updatedEntity);
			console.log("Deleting entity:", updatedEntity);
		} catch (error) {
			console.error("Failed to delete the entity:", error);
		}
	};

	const handleCancel = () => {
		manageRelationshipsRef.current?.cancelRelationships();
		manageRelationshipsRef2.current?.cancelRelationships();
	};

	const handleEntityChange = (updatedEntity: IMachine) => {
		setCurrentEntity(updatedEntity);
	};

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