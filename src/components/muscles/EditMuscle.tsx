import React, { useRef } from "react";
import { client } from "@shared/utils/client";
import { useParams, useNavigate } from "react-router-dom";
import EditEntity from "@components/generic/EditEntity";
import ManageRelationships from "@components/generic/ManageRelationships";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IMuscle } from "@shared/types/types";

interface EditMuscleProps {
	entityManager: {
		entities: IMuscle[];
		setEntities: (entities: IMuscle[]) => void;
		getEntityById: (id: string) => IMuscle | null;
		getNextId: () => number;
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const EditMuscle: React.FC<EditMuscleProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Refs for managing relationships
	const manageRelationshipsRefs = useRef<{
		[key: string]: { saveRelationships: () => void; cancelRelationships: () => void } | null;
	}>({
		Exercise: null,
		Machine: null,
	});

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	if (!id) {
		return <div>Invalid entity ID</div>;
	}

	const entity = entityManager.getEntityById(id);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSaveEntity = async (updatedEntity: IMuscle) => {
		try {
			await client.models.muscles.update(updatedEntity); // Save updated muscle
			entityManager.refreshEntities(); // Refresh after saving
			Object.values(manageRelationshipsRefs.current).forEach((ref) => ref?.saveRelationships());
			console.log("Saved entity:", updatedEntity);
			navigate("/muscles"); // Navigate back to muscles list
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleDelete = async (updatedEntity: IMuscle) => {
		try {
			await client.models.muscles.delete(updatedEntity); // Delete the muscle
			console.log("Deleted entity:", updatedEntity);
			navigate("/muscles"); // Navigate back to muscles list
		} catch (error) {
			console.error("Failed to delete the entity:", error);
		}
	};

	const handleCancel = () => {
		Object.values(manageRelationshipsRefs.current).forEach((ref) => ref?.cancelRelationships());
		console.log("Canceling changes");
		navigate("/muscles"); // Navigate back to muscles list
	};

	return (
		<>
			{/* Muscle edit form */}
			<EditEntity
				pEntity={entity!}
				pEntityName="muscles"
				onSave={handleSaveEntity}
				onDelete={handleDelete}
				onCancel={handleCancel}
			/>

			{/* Manage relationships */}
			{["Exercise", "Machine"].map((partnerType) => (
				<ManageRelationships
					key={partnerType}
					ref={(ref) => (manageRelationshipsRefs.current[partnerType] = ref)}
					keyId={entity.id}
					keyType={EntityTypes.Muscle}
					partnerType={EntityTypes[partnerType as keyof typeof EntityTypes]}
				/>
			))}
		</>
	);
};

export default withEntityData<IMuscle>(EntityTypes.Muscle)(EditMuscle);