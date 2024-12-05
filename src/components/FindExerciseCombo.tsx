import React, { useState } from 'react';
import { Amplify } from "aws-amplify";
import outputs from '../../amplify_outputs.json';
import { useEntities } from "@components/utils/entityFetcher";
import { EntityTypes } from "@shared/types/types";

Amplify.configure(outputs);

export const FindExerciseCombo: React.FC = () => {
	const machines = useEntities(EntityTypes.Machine);
	const exercises = useEntities(EntityTypes.Exercise);
	const muscles = useEntities(EntityTypes.Muscle);
	//const entityRelationships = useEntities(EntityTypes.WorkoutExercise);

	const [machineFilter, setMachineFilter] = useState<number[]>([]);
	const [exerciseFilter, setExerciseFilter] = useState<number[]>([]);
	const [muscleFilter, setMuscleFilter] = useState<number[]>([]);

	const toggleFilter = (filter: number[], setFilter: React.Dispatch<React.SetStateAction<number[]>>, value: number) => {
		setFilter(
			filter.includes(value)
				? filter.filter(item => item !== value)
				: [...filter, value]
		);
	};

	const filteredMachines = machines.filter(m => machineFilter.length === 0 || machineFilter.includes(m.id));
	const filteredExercises = exercises.filter(e => exerciseFilter.length === 0 || exerciseFilter.includes(e.id));
	const filteredMuscles = muscles.filter(m => muscleFilter.length === 0 || muscleFilter.includes(m.id));

	// Assuming the largest list to ensure all rows display correctly
	const maxRows = Math.max(filteredMachines.length, filteredExercises.length, filteredMuscles.length);

	return (
		<div>
			<h1>Find Exercise Combo</h1>

			<div>
				<h3>Machines Filter</h3>
				{machines.map(machine => (
					<button
						key={machine.id}
						onClick={() => toggleFilter(machineFilter, setMachineFilter, machine.id)}
						style={{ background: machineFilter.includes(machine.id) ? "lightblue" : "" }}
					>
						{machine.entityName}
					</button>
				))}
			</div>

			<div>
				<h3>Exercises Filter</h3>
				{exercises.map(exercise => (
					<button
						key={exercise.id}
						onClick={() => toggleFilter(exerciseFilter, setExerciseFilter, exercise.id)}
						style={{ background: exerciseFilter.includes(exercise.id) ? "lightblue" : "" }}
					>
						{exercise.entityName}
					</button>
				))}
			</div>

			<div>
				<h3>Muscles Filter</h3>
				{muscles.map(muscle => (
					<button
						key={muscle.id}
						onClick={() => toggleFilter(muscleFilter, setMuscleFilter, muscle.id)}
						style={{ background: muscleFilter.includes(muscle.id) ? "lightblue" : "" }}
					>
						{muscle.entityName}
					</button>
				))}
			</div>

			<table border={1} cellPadding="5">
				<thead>
				<tr>
					<th>Machines</th>
					<th>Exercises</th>
					<th>Muscles</th>
				</tr>
				</thead>
				<tbody>
				{[...Array(maxRows)].map((_, index) => (
					<tr key={index}>
						<td>{filteredMachines[index]?.entityName || '-'}</td>
						<td>{filteredExercises[index]?.entityName || '-'}</td>
						<td>{filteredMuscles[index]?.entityName || '-'}</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};