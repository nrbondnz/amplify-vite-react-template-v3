import withEntityData from "@components/generic/withEntityData";
import React, { useRef } from "react";
import { client } from "@shared/utils/client";
import { useParams, useNavigate } from "react-router-dom";
import EditEntity from "@components/generic/EditEntity";
import ManageRelationships from "@components/generic/ManageRelationships";
import { EntityTypes, IExercise } from "@shared/types/types";

interface EditExerciseProps {
	entityManager: {
		entities: IExercise[];
		setEntities: (entities: IExercise[]) => void;
		getEntityById: (id: string) => IExercise | null;
		getNextId: () => number; // Added to align with the `withEntityData` injection
		refreshEntities: () => void;
		loading: boolean;
		error: string | null;
	};
}

const EditExercise: React.FC<EditExerciseProps> = ({ entityManager }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Refs for managing relationships
	const manageRelationshipsRefs = useRef<{
		[key: string]: { saveRelationships: () => void; cancelRelationships: () => void } | null;
	}>({
		Muscle: null,
		Machine: null,
	});

	// Handle loading state
	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	// Handle undefined or invalid `id`
	if (!id) {
		return <div>Invalid entity ID</div>;
	}

	// Retrieve entity by ID
	const entity = entityManager.getEntityById(id);

	// Handle case where entity is not found
	if (!entity) {
		return <div>Entity not found</div>;
	}

	// Function to handle saving the updated entity
	const handleSaveEntity = async (updatedEntity: IExercise) => {
		console.log("Attempting to save entity:", updatedEntity);
		try {
			const updated = await client.models.exercises.update(updatedEntity);
			console.log("Saved entity:", updated);
			entityManager.setEntities(await client.models.exercises.list() as unknown as IExercise[]);
			console.log("list : ", entityManager.entities)// Refresh after saving
			Object.values(manageRelationshipsRefs.current).forEach((ref) =>
				ref?.saveRelationships()
			);
			navigate("/exercises")
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	// Function to handle deletion of the entity
	const handleDelete = async (updatedEntity: IExercise) => {
		try {
			await client.models.exercises.delete(updatedEntity);
			console.log("Deleting entity:", updatedEntity);
			navigate("/exercises"); // Navigate back to the exercises list
		} catch (error) {
			console.error("Failed to delete the entity:", error);
		}
	};

	// Function to handle canceling edits
	const handleCancel = () => {
		Object.values(manageRelationshipsRefs.current).forEach((ref) =>
			ref?.cancelRelationships()
		);
		console.log("Canceling changes");
		navigate("/exercises"); // Navigate back to the exercises list
	};

	return (
		<>
			{/* Render EditEntity with appropriate handlers */}
			<EditEntity
				pEntity={entity!}
				pEntityName="exercises"
				onSave={handleSaveEntity}
				onDelete={handleDelete}
				onCancel={handleCancel}
			/>

			{/* Dynamically render ManageRelationships components */}
			{["Muscle", "Machine"].map((partnerType) => (
				<ManageRelationships
					key={partnerType}
					ref={(ref) => (manageRelationshipsRefs.current[partnerType] = ref)}
					keyId={entity.id}
					keyType={EntityTypes.Exercise}
					partnerType={EntityTypes[partnerType as keyof typeof EntityTypes]}
				/>
			))}
		</>
	);
};

export default withEntityData<IExercise>(EntityTypes.Exercise)(EditExercise);