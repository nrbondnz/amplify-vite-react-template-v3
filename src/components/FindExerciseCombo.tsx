import { useSubscription } from "@context/SubscriptionContext";
import { AppEvent } from "@shared/types/types";
import React from "react";
import { useDataContext } from "@context/DataContext";
//import { useNavigate } from "react-router-dom";

const FindExerciseCombo: React.FC = () => {
	const dataContext = useDataContext();

	// Data Managers
	const muscleManager = dataContext.muM;
	const machineManager = dataContext.mM;
	const exerciseManager = dataContext.eM;

	//const navigate = useNavigate();
	const { addCustomEvent } = useSubscription();
	// Handle selection and navigate to ExerciseSelection page
	const handleSelection = (entityType: string, id: number) => {
		// Updated route path to match App.tsx
		const event: AppEvent = {
			entity: entityType,
			entityId: id,
			actionType: "SELECT",
			pageType: "COMBO_SEARCH",
		};
		addCustomEvent(event);
	};

	return (
		<div>
			<h2>Find Exercise Combo</h2>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
					gap: "20px",
				}}
			>
				{/* List of Muscles */}
				<div style={{ flex: 1, maxHeight: "500px", overflowY: "auto" }}>
					<h3>Muscles</h3>
					<ul style={{ listStyleType: "none", paddingLeft: "0" }}>
						{muscleManager.entities.map((muscle) => (
							<li
								key={muscle.id}
								style={{
									cursor: "pointer",
									textDecoration: "underline",
									color: "blue",
									marginBottom: "8px",
								}}
								onClick={() => handleSelection("muscles", muscle.id)}
							>
								{muscle.entityName}
							</li>
						))}
					</ul>
				</div>

				{/* List of Machines */}
				<div style={{ flex: 1, maxHeight: "500px", overflowY: "auto" }}>
					<h3>Machines</h3>
					<ul style={{ listStyleType: "none", paddingLeft: "0" }}>
						{machineManager.entities.map((machine) => (
							<li
								key={machine.id}
								style={{
									cursor: "pointer",
									textDecoration: "underline",
									color: "blue",
									marginBottom: "8px",
								}}
								onClick={() => handleSelection("machines", machine.id)}
							>
								{machine.entityName}
							</li>
						))}
					</ul>
				</div>

				{/* List of Exercises */}
				<div style={{ flex: 1, maxHeight: "500px", overflowY: "auto" }}>
					<h3>Exercises</h3>
					<ul style={{ listStyleType: "none", paddingLeft: "0" }}>
						{exerciseManager.entities.map((exercise) => (
							<li
								key={exercise.id}
								style={{
									cursor: "pointer",
									textDecoration: "underline",
									color: "blue",
									marginBottom: "8px",
								}}
								onClick={() => handleSelection("exercises", exercise.id)}
							>
								{exercise.entityName}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default FindExerciseCombo;