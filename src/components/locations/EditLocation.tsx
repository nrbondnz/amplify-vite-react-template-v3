import React from "react";
import { useParams } from "react-router-dom";
import EditEntity from "@components/generic/EditEntity";
import withEntityData from "@components/generic/withEntityData";
import { client } from "@shared/utils/client";
import { EntityTypes, ILocation } from "@shared/types/types";

interface EditLocationProps {
	entityManager: {
		entities: ILocation[];
		setEntities: (entities: ILocation[]) => void;
		getEntityById: (id: string) => ILocation | null;
		getNextId: () => number; // Added this field to align with `withEntityData`!
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const EditLocation: React.FC<EditLocationProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const entity = entityManager.getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: ILocation) => {
		try {
			await client.models.locations.update(updatedEntity);
			console.log("Saving entity:", updatedEntity);
			entityManager.refreshEntities(); // Refresh entity list after save
			// Optional: Add `navigate` or additional actions here.
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleDelete = async (updatedEntity: ILocation) => {
		try {
			await client.models.locations.delete({ id: updatedEntity.id });
			console.log("Deleting entity:", updatedEntity);
			entityManager.refreshEntities(); // Refresh entity list after delete
			// Optional: Add `navigate` or additional actions here.
		} catch (error) {
			console.error("Failed to delete the entity:", error);
		}
	};

	const handleCancel = () => {
		console.log("Canceling changes");
		// Optional: Add navigation or custom actions upon canceling.
	};

	return (
		<EditEntity
			pEntity={entity}
			pEntityName="locations"
			onSave={handleSave}
			onDelete={handleDelete}
			onCancel={handleCancel}
		/>
	);
};

export default withEntityData<ILocation>(EntityTypes.Location)(EditLocation);