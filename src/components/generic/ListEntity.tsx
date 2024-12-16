import { useState, useEffect } from "react";
import { IEntityManager } from "@shared/types/IEntityManager";
import { useSubscription } from "@context/SubscriptionContext";
import { WithId, AppEvent, EntityTypes } from "@shared/types/types";
import { useDataContext } from "@context/DataContext";
import "./ListEntity.css";

// Generic function to check if an entity has a specific field
const hasField = <T extends object, K extends keyof any>(
	entity: T,
	field: K
): entity is T & Record<K, any> => {
	return field in entity;
};

function getEntityTypesFromName(entityDBName: string): EntityTypes | undefined {
	return Object.values(EntityTypes).find((type) => type === entityDBName);
}

// Define props type for ListEntity with generics
type ListEntityProps<T> = {
	title: string;
	entityDBName: string;
	entities?: T[]; // Optional prop for pre-fetched entities
};

// Component definition
const ListEntity = <T extends WithId & { entityName: string }>({
																   title,
																   entityDBName,
																   entities = [], // Default to an empty array if not provided
															   }: ListEntityProps<T>) => {
	// Access subscription and data context
	const { addCustomEvent } = useSubscription();
	const { getManagerByType } = useDataContext();

	// State for entity manager and entities to be displayed
	const [, setEntityManager] = useState<IEntityManager<T> | undefined>(undefined);
	const [displayEntities, setDisplayEntities] = useState<T[]>(entities);

	// Effect to fetch entities on mount or when `entityDBName` changes
	useEffect(() => {
		const manager = getManagerByType(getEntityTypesFromName(entityDBName)!);
		setEntityManager(manager);

		if (manager?.entities?.length! > 0) {
			// Use the entities from the manager if available
			setDisplayEntities(manager!.entities as T[]);
		} else if (entities.length === 0) {
			// Otherwise, fetch from DB if no predefined entities were passed
			const fetchEntitiesFromDB = async () => {
				try {
					if (manager) {
						// Fetch entities through the manager dynamically
						console.log("Fetched entities from DB manager:", manager.entities);
						setDisplayEntities(manager.entities as T[]); // Ensure types are aligned
					} else {
						console.warn(`No manager found for ${entityDBName}. Setting empty state.`);
						setDisplayEntities([]);
					}
				} catch (err) {
					console.error("Error fetching entities from DB:", err);
					setDisplayEntities([]);
				}
			};

			fetchEntitiesFromDB();
		}
	}, [entityDBName, entities, getManagerByType]);

	// Event handlers for different actions
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

	// Build an array of display numbers if the field exists in entities
	const displayNums = Array.isArray(displayEntities)
		? displayEntities.map((entity) =>
			hasField(entity, "displayNum") ? entity.displayNum : undefined
		)
		: [];

	console.log("About to render ListEntity with:", displayEntities);

	// Render component structure
	return (
		<div>
			<h1>{title}</h1>
			<div>
				<button className="button-green" onClick={handleNewClick}>
					New
				</button>
				<button className="button-green" onClick={handleCancelClick}>
					Cancel
				</button>
			</div>
			<table className="styled-table">
				<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
				</thead>
				<tbody>
				{/* Ensure that displayEntities is correctly iterated */}
				{displayEntities.length > 0 ? (
					displayEntities.map((entity, index) => (
						<tr
							key={entity.id}
							onClick={() => handleEditClick(entity.id)}
							className={`entity-row ${index % 2 === 0 ? "even" : "odd"}`}
						>
							<td>{entity.id}</td>
							<td>
								{entity.entityName}
								{displayNums[index] !== undefined
									? "-" + displayNums[index]
									: "n/a"}
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={2}>No entities available</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	);
};

export default ListEntity;