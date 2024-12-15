import NewEntity from "@components/generic/NewEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, getEntityDefault, IMachine } from "@shared/types/types";
import { client } from "@shared/utils/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import ManageSettings from "./ManageSettings";

interface NewMachineProps {
	entityManager: {
		entities: IMachine[]; // List of machines
		getEntityById: (id: string) => IMachine | null; // Function to retrieve an entity by its ID
		getNextId: () => number; // Generate the next machine ID
		refreshEntities: () => void; // Refresh the machine list
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const NewMachine: React.FC<NewMachineProps> = ({ entityManager }) => {
	const navigate = useNavigate();

	if (entityManager.loading) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IMachine) => {
		try {
			newEntity.id = entityManager.getNextId(); // Assign the next ID using getNextId()
			const savedMachine = await client.models.machines.create(newEntity);
			console.log("Saving entity:", savedMachine);

			entityManager.refreshEntities(); // Refresh entities after saving
			navigate("/appcontent"); // Navigate after save
		} catch (error) {
			console.error("Failed to save the entity:", error);
		}
	};

	const handleCancel = (): string => {
		navigate("/appcontent");
		return "NEW";
	};

	return (
		<>
			<NewEntity
				entity={getEntityDefault<IMachine>(EntityTypes.Machine).defaultEntity}
				entityName="machines"
				onSave={handleSave}
				onCancel={handleCancel}
			/>
			<ManageSettings
				entityType={EntityTypes.Machine}
				entityId={-1}
				onSaveRef={() => {}}
			/>
		</>
	);
};

export default withEntityData<IMachine>(EntityTypes.Machine)(NewMachine);