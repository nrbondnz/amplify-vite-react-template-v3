//import { useSubscription } from "@context/SubscriptionContext";
//import { AppEvent } from "@shared/types/types";
import React from "react";
import { useParams } from "react-router-dom";
import { useDataContext } from "@context/DataContext";
//const { addCustomEvent } = useSubscription();
const MuscleSelection: React.FC = () => {
	const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
//	const navigate = useNavigate();
	const dataContext = useDataContext();

	// Data Managers
	const muscleManager = dataContext.muM;
	const machineManager = dataContext.mM;
	const exerciseManager = dataContext.eM;
	const relationshipManager = dataContext.eRM;

	// Parse entityId into a number
	const selectedEntityId = parseInt(entityId || "0", 10);

	// Retrieve the selected Muscle (currently assuming entityType = "muscles")
	const selectedMuscle =
		entityType === "muscles"
			? muscleManager.entities.find((muscle) => muscle.id === selectedEntityId)
			: null;

	// Get related Machines for the selected Muscle
	const relatedMachines = selectedMuscle
		? relationshipManager.entities
			.filter((rel) => rel.muscleId === selectedEntityId && rel.machineId !== null)
			.map((rel) => machineManager.entities.find((machine) => machine.id === rel.machineId))
			.filter((machine) => machine !== undefined) // Remove undefined entries
		: [];

	// Get related Exercises for the Machines, ensuring uniqueness
	const relatedExercises = Array.from(
		new Set(
			relatedMachines
				.map((machine) =>
					relationshipManager.entities
						.filter((rel) => rel.machineId === machine!.id && rel.exerciseId !== null)
						.map((rel) => exerciseManager.entities.find((exercise) => exercise.id === rel.exerciseId))
						.filter((exercise) => exercise !== undefined) // Remove undefined entries
				)
				.flat()
		)
	);

	// Navigate back to the FindExerciseCombo page
	const navigateBack = () => {
		/*const event: AppEvent = {
			entity: entityType!,
			entityId: 0,
			actionType: "FIND_REQUEST",
			pageType: "APPHOME",
		};*/
		// todo fix with visible cancel button
		//addCustomEvent(event); // This assumes the combo page is under
		// `/app/find`
	};

	return (
		<div>
			{/* Back Button */}
			<div style={{ marginBottom: "20px" }}>
				<button type="button"
					style={{
						padding: "10px 20px",
						backgroundColor: "#007BFF",
						color: "black",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
					}}
					onClick={navigateBack}
				>
					← Back to Find Exercise Combo
				</button>
			</div>

			{/* Main Content */}
			<div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
				{/* Left Panel: Selected Muscle */}
				<div style={{ flex: 1 }}>
					<h3>Selected {entityType}</h3>
					{selectedMuscle ? (
						<div>
							<h4>{selectedMuscle.entityName}</h4>
							<p>ID: {selectedMuscle.id}</p>
						</div>
					) : (
						<p>No valid entity selected.</p>
					)}
				</div>

				{/* Middle Panel: Related Machines */}
				<div style={{ flex: 1 }}>
					<h3>Related Machines</h3>
					{relatedMachines.length > 0 ? (
						<ul style={{ listStyleType: "none", paddingLeft: 0 }}>
							{relatedMachines.map((machine) => (
								<li key={machine!.id} style={{ marginBottom: "8px" }}>
									{machine!.entityName} (ID: {machine!.id})
								</li>
							))}
						</ul>
					) : (
						<p>No machines found.</p>
					)}
				</div>

				{/* Right Panel: Related Exercises */}
				<div style={{ flex: 1 }}>
					<h3>Related Exercises</h3>
					{relatedExercises.length > 0 ? (
						<ul style={{ listStyleType: "none", paddingLeft: 0 }}>
							{relatedExercises.map((exercise) => (
								<li key={exercise!.id} style={{ marginBottom: "8px" }}>
									{exercise!.entityName} (ID: {exercise!.id})
								</li>
							))}
						</ul>
					) : (
						<p>No exercises found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default MuscleSelection;