import React, { useState } from 'react';
import { Amplify } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import outputs from '../../amplify_outputs.json';
import { useEntities } from "@components/utils/entityFetcher";
import { EntityTypes, IEntityRelationship, WithIdAndDisplayNum } from "@shared/types/types";
import { useEntityData } from "@hooks/useEntityData";
import ShowPicture from '@components/utils/ShowPicture';
import '@components/FindExerciseCombo.css';

Amplify.configure(outputs);

export const FindExerciseCombo: React.FC = () => {
	const navigate = useNavigate();
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

	const handleNavigation = (entityType: EntityTypes, entity: any) => {
		switch (entityType) {
			case EntityTypes.Machine:
				if (machineFilter.includes(entity.id)) {
					navigate(`/combo-details/${EntityTypes.Machine}/${entity.id}`);
				}
				break;
			case EntityTypes.Exercise:
				if (exerciseFilter.includes(entity.id)) {
					navigate(`/combo-details/${EntityTypes.Exercise}/${entity.id}`);
				}
				break;
			case EntityTypes.Muscle:
				if (muscleFilter.includes(entity.id)) {
					navigate(`/combo-details/${EntityTypes.Muscle}/${entity.id}`);
				}
				break;
			default:
				break;
		}
	};

	const filteredMachines = machines.filter(m => machineFilter.length === 0 || machineFilter.includes(m.id));
	const filteredExercises = exercises.filter(e => exerciseFilter.length === 0 || exerciseFilter.includes(e.id));
	const filteredMuscles = muscles.filter(m => muscleFilter.length === 0 || muscleFilter.includes(m.id));

	const maxRows = Math.max(filteredMachines.length, filteredExercises.length, filteredMuscles.length);

	return (
		<div>
			<h1>Find Exercise Combo</h1>
			<button onClick={resetFilters}>Reset Filters</button>
			<table className="table-bordered">
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
						<td onClick={() => {
							if (filteredMachines[index]) {
								handleFilter(EntityTypes.Machine, filteredMachines[index].id);
								handleNavigation(EntityTypes.Machine, filteredMachines[index]);
							}
						}}>
							{filteredMachines[index] ? (
								<div>
									{filteredMachines[index].entityName}
									{('displayNum' in filteredMachines[index]) && (
										<ShowPicture
											name={EntityTypes.Machine}
											entityDisplayNum={(filteredMachines[index] as WithIdAndDisplayNum).displayNum}
										/>
									)}
								</div>
							) : (
								machineFilter.includes(-1) ? '0' : '-'
							)}
						</td>
						<td onClick={() => {
							if (filteredExercises[index]) {
								handleFilter(EntityTypes.Exercise, filteredExercises[index].id);
								handleNavigation(EntityTypes.Exercise, filteredExercises[index]);
							}
						}}>
							{filteredExercises[index] ? (
								<div>
									{filteredExercises[index].entityName}
									{('displayNum' in filteredExercises[index]) && (
										<ShowPicture
											name={EntityTypes.Exercise}
											entityDisplayNum={(filteredExercises[index] as WithIdAndDisplayNum).displayNum}
										/>
									)}
								</div>
							) : (
								exerciseFilter.includes(-1) ? '0' : '-'
							)}
						</td>
						<td onClick={() => {
							if (filteredMuscles[index]) {
								handleFilter(EntityTypes.Muscle, filteredMuscles[index].id);
								handleNavigation(EntityTypes.Muscle, filteredMuscles[index]);
							}
						}}>
							{filteredMuscles[index] ? (
								<div>
									{filteredMuscles[index].entityName}
									{('displayNum' in filteredMuscles[index]) && (
										<ShowPicture
											name={EntityTypes.Muscle}
											entityDisplayNum={(filteredMuscles[index] as WithIdAndDisplayNum).displayNum}
										/>
									)}
								</div>
							) : (
								muscleFilter.includes(-1) ? '0' : '-'
							)}
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};