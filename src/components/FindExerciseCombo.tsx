import React, { useState } from 'react';
import { Amplify } from "aws-amplify";
import outputs from '../../amplify_outputs.json';
import { useEntities } from "@components/utils/entityFetcher";
import { EntityTypes, IEntityRelationship } from "@shared/types/types";
import { useEntityData } from "@hooks/useEntityData";

Amplify.configure(outputs);

export const FindExerciseCombo: React.FC = () => {
	const machines = useEntities(EntityTypes.Machine);
	const exercises = useEntities(EntityTypes.Exercise);
	const muscles = useEntities(EntityTypes.Muscle);
	const { entities } = useEntityData<IEntityRelationship>(EntityTypes.EntityRelationship);

	const [machineFilter, setMachineFilter] = useState<number[]>([]);
	const [exerciseFilter, setExerciseFilter] = useState<number[]>([]);
	const [muscleFilter, setMuscleFilter] = useState<number[]>([]);

	const handleFilter = (entityType: EntityTypes, id: number) => {
		if (!entities) return;

		switch (entityType) {
			case EntityTypes.Machine:
				const relatedMusclesFromMachine = entities
					.filter(rel => rel.machineId === id)
					.map(rel => rel.muscleId)
					.filter(muscleId => muscleId !== null) as number[];

				const relatedExercisesFromMachine = entities
					.filter(rel => rel.machineId === id)
					.map(rel => rel.exerciseId)
					.filter(exerciseId => exerciseId !== null) as number[];

				setMuscleFilter(relatedMusclesFromMachine.length ? relatedMusclesFromMachine : [-1]);
				setExerciseFilter(relatedExercisesFromMachine.length ? relatedExercisesFromMachine : [-1]);
				setMachineFilter([id]);
				break;

			case EntityTypes.Exercise:
				const relatedMusclesFromExercise = entities
					.filter(rel => rel.exerciseId === id)
					.map(rel => rel.muscleId)
					.filter(muscleId => muscleId !== null) as number[];

				const relatedMachinesFromExercise = entities
					.filter(rel => rel.exerciseId === id)
					.map(rel => rel.machineId)
					.filter(machineId => machineId !== null) as number[];

				setMuscleFilter(relatedMusclesFromExercise.length ? relatedMusclesFromExercise : [-1]);
				setMachineFilter(relatedMachinesFromExercise.length ? relatedMachinesFromExercise : [-1]);
				setExerciseFilter([id]);
				break;

			case EntityTypes.Muscle:
				const relatedMachinesFromMuscle = entities
					.filter(rel => rel.muscleId === id)
					.map(rel => rel.machineId)
					.filter(machineId => machineId !== null) as number[];

				const relatedExercisesFromMuscle = entities
					.filter(rel => rel.muscleId === id)
					.map(rel => rel.exerciseId)
					.filter(exerciseId => exerciseId !== null) as number[];

				setMachineFilter(relatedMachinesFromMuscle.length ? relatedMachinesFromMuscle : [-1]);
				setExerciseFilter(relatedExercisesFromMuscle.length ? relatedExercisesFromMuscle : [-1]);
				setMuscleFilter([id]);
				break;

			default:
				break;
		}
	};

	const resetFilters = () => {
		setMachineFilter([]);
		setExerciseFilter([]);
		setMuscleFilter([]);
	};

	const filteredMachines = machines.filter(m => machineFilter.length === 0 || machineFilter.includes(m.id));
	const filteredExercises = exercises.filter(e => exerciseFilter.length === 0 || exerciseFilter.includes(e.id));
	const filteredMuscles = muscles.filter(m => muscleFilter.length === 0 || muscleFilter.includes(m.id));

	const maxRows = Math.max(filteredMachines.length, filteredExercises.length, filteredMuscles.length);

	return (
		<div>
			<h1>Find Exercise Combo</h1>
			<button onClick={resetFilters}>Reset Filters</button>
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
						<td onClick={() => filteredMachines[index] && handleFilter(EntityTypes.Machine, filteredMachines[index].id)}>
							{filteredMachines[index]?.entityName || (machineFilter.includes(-1) ? '0' : '-')}
						</td>
						<td onClick={() => filteredExercises[index] && handleFilter(EntityTypes.Exercise, filteredExercises[index].id)}>
							{filteredExercises[index]?.entityName || (exerciseFilter.includes(-1) ? '0' : '-')}
						</td>
						<td onClick={() => filteredMuscles[index] && handleFilter(EntityTypes.Muscle, filteredMuscles[index].id)}>
							{filteredMuscles[index]?.entityName || (muscleFilter.includes(-1) ? '0' : '-')}
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};