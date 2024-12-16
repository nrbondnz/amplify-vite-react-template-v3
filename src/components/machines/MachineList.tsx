import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IMachine } from "@shared/types/types";

interface MachineListProps {
	entityManager: {
		entities: IMachine[]; // List of entities (machines)
		setEntities: (entities: IMachine[]) => void;
		getEntityById: (id: string) => IMachine | null; // Retrieve machine by ID
		getNextId: () => number; // Generate a new machine ID
		refreshEntities: () => void; // Refresh the machine list
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const MachineList: React.FC<MachineListProps> = ({ entityManager }) => {
	if (entityManager.loading) {
		return <div>Loading machines...</div>;
	}

	if (entityManager.error) {
		return <div>Error loading machines: {entityManager.error}</div>;
	}

	if (!entityManager.entities || entityManager.entities.length === 0) {
		return <div>No machines found.</div>;
	}

	return (
		<ListEntity
			title="Machines"
			entities={entityManager.entities}
			entityDBName="machines"
		/>
	);
};

export default withEntityData<IMachine>(EntityTypes.Machine)(MachineList);