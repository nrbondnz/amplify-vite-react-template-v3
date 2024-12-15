import { useEffect, useState } from "react";
import { useSubscription } from "@context/SubscriptionContext";
import { WithId, AppEvent } from "@shared/types/types";
import "./ListEntity.css";

interface ListEntityProps<T extends WithId> {
	title: string;
	entities: T[];
	entityDBName: string;
}

// Generic function to check if an entity has a specific field
const hasField = <T extends object, K extends keyof any>(entity: T, field: K): entity is T & Record<K, any> => {
	return field in entity;
};

const ListEntity = <T extends WithId & { entityName: string }>({
																   title,
																   entities,
																   entityDBName,
															   }: ListEntityProps<T>) => {
	const { addCustomEvent } = useSubscription();

	// Local state to manage entities and ensure re-render
	const [displayEntities, setDisplayEntities] = useState<T[]>(entities);

	// Effect to update the local entities state whenever the `entities` prop changes
	useEffect(() => {
		console.log("Entities updated in ListEntity:", entities);
		setDisplayEntities(entities);
	}, [entities]);

	const handleEditClick = (id: number) => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "EDIT_REQUEST",
			entityId: id,
			pageType: "LIST",
		};
		addCustomEvent(event);
	};

	const handleNewClick = () => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "NEW_REQUEST",
			pageType: "LIST",
		};
		addCustomEvent(event);
	};

	const handleCancelClick = () => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "CANCEL_REQUEST",
			pageType: "LIST",
		};
		addCustomEvent(event);
	};

	// Build an array of display numbers if they exist
	const displayNums = displayEntities.map((entity) =>
		hasField(entity, "displayNum") ? entity.displayNum : undefined
	);

	console.log("About to render ListEntity with : ", displayEntities);

	return (
		<div>
			<h1>{title}</h1>
			<button className="button-green" onClick={handleNewClick}>
				New
			</button>
			<button className="button-green" onClick={handleCancelClick}>
				Cancel
			</button>
			<table className="styled-table">
				<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
				</thead>
				<tbody>
				{displayEntities.map((entity, index) => (
					<tr
						key={entity.id}
						onClick={() => handleEditClick(entity.id)}
						className={`entity-row ${index % 2 === 0 ? "even" : "odd"}`}
					>
						<td>{entity.id}</td>
						<td>
							{entity.entityName}
							{displayNums[index] !== undefined ? "-" + displayNums[index] : "n/a"}
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};

export default ListEntity;