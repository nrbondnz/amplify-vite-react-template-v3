import ListEntity from "@components/generic/ListEntity";
import withEntityData from "@components/generic/withEntityData";
import { EntityTypes, IWorkout } from "@shared/types/types";

interface ListWorkoutProps {
	entityManager: {
		entities: IWorkout[]; // List of entities
		getEntityById: (id: string) => IWorkout | null; // Retrieve entity by ID
		getNextId: () => number; // Generate the next available ID
		refreshEntities: () => void; // Refresh list of entities
		loading: boolean; // Loading state
		error: string | null; // Error state
	};
}

const ListWorkout: React.FC<ListWorkoutProps> = ({ entityManager }) => {
	if (entityManager.loading) {
		return <div>Loading workouts...</div>;
	}

	if (entityManager.error) {
		return <div>Error loading workouts: {entityManager.error}</div>;
	}

	if (!entityManager.entities || entityManager.entities.length === 0) {
		return <div>No workouts found.</div>;
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