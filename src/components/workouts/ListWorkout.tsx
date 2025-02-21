import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IWorkout } from "@shared/types/types";

interface ListWorkoutProps {
	entityManager: {
		entities: IWorkout[]; // List of entities
		setEntities: (entities: IWorkout[]) => void;
		getEntityById: (id: string) => IWorkout | null; // Retrieve entity by ID
		getNextId: () => number; // Generate the next available ID
		refreshEntities: () => void; // Refresh list of entities
		loading: boolean; // Loading state
		error: string | null; // Error state
		//setCurrentEntity: (entity: IWorkout | null) => void;
		//getCurrentEntity: () => IWorkout | null;
	};
}

const ListWorkout: React.FC<ListWorkoutProps> = ({ entityManager }) => {
	if (entityManager.loading) {
		return <div>Loading workouts...</div>;
	}

	if (entityManager.error) {
		return <div>Error loading workouts: {entityManager.error}</div>;
	}

	return (
		<ListEntity
			title="Workouts"
			entities={entityManager.entities}
			entityDBName="workouts"
		/>
	);
};

export default withEntityData<IWorkout>(EntityTypes.Workout)(ListWorkout);