import { useSubscription } from "@context/SubscriptionContext";
import { AppEvent } from "@shared/types/types";
import React from "react";
import { useParams } from "react-router-dom";
import { useDataContext } from "@context/DataContext";
const { addCustomEvent } = useSubscription();
const ExerciseSelection: React.FC = () => {
	const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
	//const navigate = useNavigate();
	const dataContext = useDataContext();

	// Data Managers
	const muscleManager = dataContext.muM;
	const machineManager = dataContext.mM;
	const exerciseManager = dataContext.eM;
	const relationshipManager = dataContext.eRM;

	// Parse entityId into a number
	const selectedEntityId = parseInt(entityId || "0", 10);

	// Retrieve the selected Exercise (assuming entityType is "exercises")
	const selectedExercise =
		entityType === "exercises"
			? exerciseManager.entities.find((exercise) => exercise.id === selectedEntityId)
			: null;

	// Get related Machines for the selected Exercise
	const relatedMachines = selectedExercise
		? relationshipManager.entities
				.filter((rel) => rel.exerciseId === selectedEntityId && rel.machineId !== null)
				.map((rel) => machineManager.entities.find((machine) => machine.id === rel.machineId))
				.filter((machine) => machine !== undefined) // Remove undefined entries
		: [];

	// Get related Muscles for the Machines, ensuring uniqueness
	const relatedMuscles = Array.from(
		new Set(
			relatedMachines
				.map((machine) =>
					relationshipManager.entities
						.filter((rel) => rel.machineId === machine!.id && rel.muscleId !== null)
						.map((rel) => muscleManager.entities.find((muscle) => muscle.id === rel.muscleId))
						.filter((muscle) => muscle !== undefined) // Remove undefined entries
				)
				.flat()
		)
	);

	// Navigate back to the FindExerciseCombo page
	const navigateBack = () => {
		const event: AppEvent = {
			entity: entityType!,
			entityId: 0,
			actionType: "FIND_REQUEST",
			pageType: "APPHOME",
		};
		addCustomEvent(event); // This assumes the combo page is under `/app/find`
	};

	return (
		<div>
			{/* Back Button */}
			<div style={{ marginBottom: "20px" }}>
				<button
					style={{
						padding: "10px 20px",
						backgroundColor: "#007BFF",
						color: "white",
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
				{/* Left Panel: Selected Exercise */}
				<div style={{ flex: 1 }}>
					<h3>Selected {entityType}</h3>
					{selectedExercise ? (
						<div>
							<h4>{selectedExercise.entityName}</h4>
							<p>ID: {selectedExercise.id}</p>
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

				{/* Right Panel: Related Muscles */}
				<div style={{ flex: 1 }}>
					<h3>Related Muscles</h3>
					{relatedMuscles.length > 0 ? (
						<ul style={{ listStyleType: "none", paddingLeft: 0 }}>
							{relatedMuscles.map((muscle) => (
								<li key={muscle!.id} style={{ marginBottom: "8px" }}>
									{muscle!.entityName} (ID: {muscle!.id})
								</li>
							))}
						</ul>
					) : (
						<p>No muscles found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExerciseSelection;