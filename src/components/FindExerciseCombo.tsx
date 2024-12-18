import React, { useState } from 'react';
import { Amplify } from "aws-amplify";
import outputs from '../../amplify_outputs.json';
import { useDataContext } from "@context/DataContext";
import "@components/FindExerciseCombo.css";

import { EntityTypes } from "@shared/types/types";

Amplify.configure(outputs);

// Tooltip for descriptions
const Tooltip: React.FC<{ description: string | null; position: { x: number; y: number } }> = ({ description, position }) => {
	if (!description) return null;

	return (
		<div
			className="tooltip"
			style={{
				position: 'absolute',
				top: position.y + 10,
				left: position.x + 10,
				backgroundColor: '#fff',
				border: '1px solid #ccc',
				padding: '8px',
				borderRadius: '6px',
				boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
				zIndex: 1000,
			}}
		>
			<p>{description}</p>
		</div>
	);
};

export const FindExerciseCombo: React.FC = () => {
	const dataContext = useDataContext();
	const machineManager = dataContext.mM;
	const exerciseManager = dataContext.eM;
	const muscleManager = dataContext.muM;
	const relationshipManager = dataContext.eRM;

	// Filters and search terms
	const [machineFilter, setMachineFilter] = useState<number[]>([]);
	const [exerciseFilter, setExerciseFilter] = useState<number[]>([]);
	const [muscleFilter, setMuscleFilter] = useState<number[]>([]);

	const [machineNameFilter, setMachineNameFilter] = useState('');
	const [exerciseNameFilter, setExerciseNameFilter] = useState('');
	const [muscleNameFilter, setMuscleNameFilter] = useState('');

	// Tooltip state
	const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	// Tooltip hover handlers
	const handleMouseEnter = (description: string, e: React.MouseEvent) => {
		setHoveredDescription(description);
		setTooltipPosition({ x: e.pageX, y: e.pageY });
	};

	const handleMouseLeave = () => {
		setHoveredDescription(null);
	};

	// Apply filters when clicking table cells
	const handleFilter = (entityType: EntityTypes, id: number) => {
		if (!relationshipManager.entities) return;

		switch (entityType) {
			case EntityTypes.Machine:
				const relatedMusclesFromMachine = relationshipManager.entities
					.filter((rel) => rel.machineId === id)
					.map((rel) => rel.muscleId)
					.filter((muscleId) => muscleId !== null) as number[];

				const relatedExercisesFromMachine = relationshipManager.entities
					.filter((rel) => rel.machineId === id)
					.map((rel) => rel.exerciseId)
					.filter((exerciseId) => exerciseId !== null) as number[];

				setMuscleFilter(relatedMusclesFromMachine.length ? relatedMusclesFromMachine : [-1]);
				setExerciseFilter(relatedExercisesFromMachine.length ? relatedExercisesFromMachine : [-1]);
				setMachineFilter([id]);
				break;

			case EntityTypes.Exercise:
				const relatedMusclesFromExercise = relationshipManager.entities
					.filter((rel) => rel.exerciseId === id)
					.map((rel) => rel.muscleId)
					.filter((muscleId) => muscleId !== null) as number[];

				const relatedMachinesFromExercise = relationshipManager.entities
					.filter((rel) => rel.exerciseId === id)
					.map((rel) => rel.machineId)
					.filter((machineId) => machineId !== null) as number[];

				setMuscleFilter(relatedMusclesFromExercise.length ? relatedMusclesFromExercise : [-1]);
				setMachineFilter(relatedMachinesFromExercise.length ? relatedMachinesFromExercise : [-1]);
				setExerciseFilter([id]);
				break;

			case EntityTypes.Muscle:
				const relatedMachinesFromMuscle = relationshipManager.entities
					.filter((rel) => rel.muscleId === id)
					.map((rel) => rel.machineId)
					.filter((machineId) => machineId !== null) as number[];

				const relatedExercisesFromMuscle = relationshipManager.entities
					.filter((rel) => rel.muscleId === id)
					.map((rel) => rel.exerciseId)
					.filter((exerciseId) => exerciseId !== null) as number[];

				setMachineFilter(relatedMachinesFromMuscle.length ? relatedMachinesFromMuscle : [-1]);
				setExerciseFilter(relatedExercisesFromMuscle.length ? relatedExercisesFromMuscle : [-1]);
				setMuscleFilter([id]);
				break;

			default:
				break;
		}
	};

	// Filtered entities
	const filteredMachines = machineManager.entities
		.filter((m) => machineNameFilter === '' || m.entityName.toLowerCase().includes(machineNameFilter.toLowerCase()))
		.filter((m) => machineFilter.length === 0 || machineFilter.includes(m.id));

	const filteredExercises = exerciseManager.entities
		.filter((e) => exerciseNameFilter === '' || e.entityName.toLowerCase().includes(exerciseNameFilter.toLowerCase()))
		.filter((e) => exerciseFilter.length === 0 || exerciseFilter.includes(e.id));

	const filteredMuscles = muscleManager.entities
		.filter((mu) => muscleNameFilter === '' || mu.entityName.toLowerCase().includes(muscleNameFilter.toLowerCase()))
		.filter((mu) => muscleFilter.length === 0 || muscleFilter.includes(mu.id));

	const maxRows = Math.max(filteredMachines.length, filteredExercises.length, filteredMuscles.length);

	return (
		<div style={{ position: 'relative' }}>
			<h1>Find Exercise Combo</h1>
			<table className="table-bordered">
				<thead>
				<tr>
					<th>
						Machines
						<input
							type="text"
							placeholder="Filter Machines"
							value={machineNameFilter}
							onChange={(e) => setMachineNameFilter(e.target.value)}
						/>
					</th>
					<th>
						Exercises
						<input
							type="text"
							placeholder="Filter Exercises"
							value={exerciseNameFilter}
							onChange={(e) => setExerciseNameFilter(e.target.value)}
						/>
					</th>
					<th>
						Muscles
						<input
							type="text"
							placeholder="Filter Muscles"
							value={muscleNameFilter}
							onChange={(e) => setMuscleNameFilter(e.target.value)}
						/>
					</th>
				</tr>
				</thead>
				<tbody>
				{[...Array(maxRows)].map((_, index) => (
					<tr key={index}>
						<td
							onMouseEnter={(e) =>
								filteredMachines[index]?.description &&
								handleMouseEnter(filteredMachines[index].description, e)
							}
							onMouseLeave={handleMouseLeave}
							onClick={() =>
								filteredMachines[index] &&
								handleFilter(EntityTypes.Machine, filteredMachines[index].id)
							}
						>
							{filteredMachines[index]?.entityName || '-'}
						</td>
						<td
							onMouseEnter={(e) =>
								filteredExercises[index]?.description &&
								handleMouseEnter(filteredExercises[index].description, e)
							}
							onMouseLeave={handleMouseLeave}
							onClick={() =>
								filteredExercises[index] &&
								handleFilter(EntityTypes.Exercise, filteredExercises[index].id)
							}
						>
							{filteredExercises[index]?.entityName || '-'}
						</td>
						<td
							onMouseEnter={(e) =>
								filteredMuscles[index]?.description &&
								handleMouseEnter(filteredMuscles[index].description, e)
							}
							onMouseLeave={handleMouseLeave}
							onClick={() =>
								filteredMuscles[index] &&
								handleFilter(EntityTypes.Muscle, filteredMuscles[index].id)
							}
						>
							{filteredMuscles[index]?.entityName || '-'}
						</td>
					</tr>
				))}
				</tbody>
			</table>
			<Tooltip description={hoveredDescription} position={tooltipPosition} />
		</div>
	);
};