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
const ListEntity = <T extends WithId>({
										  title,
										  entityDBName,
										  entities = [], // Default to an empty array if not provided
									  }: ListEntityProps<T>) => {
	// Access subscription and data context
	const { addCustomEvent } = useSubscription();
	const { getManagerByType } = useDataContext();

	// State for entity manager and entities to be displayed
	const [, setEntityManager] = useState<
		IEntityManager<T> | undefined
	>(undefined);
	const [displayEntities, setDisplayEntities] = useState<T[]>(entities);

	// Effect to fetch entities on mount or when `entityDBName` changes
	useEffect(() => {
		const manager = getManagerByType(getEntityTypesFromName(entityDBName)!);
		setEntityManager(manager);

		// Safeguard for when no manager is found
		if (!manager) {
			console.warn(`No manager found for entity: ${entityDBName}`);
			setDisplayEntities([]); // Ensure an empty list to handle the UI gracefully
			return;
		}

		// Fetch and display entities dynamically
		const fetchEntities = async () => {
			try {
				const fetchedEntities = manager.entities || [];
				console.log("Fetched entities from manager:", fetchedEntities);
				setDisplayEntities(fetchedEntities as T[]); // Safely set fetched entities
			} catch (err) {
				// Log the error but continue rendering with an empty state
				console.error(`Error fetching entities for ${entityDBName}:`, err);
				setDisplayEntities([]); // Use an empty state to avoid breaking
			}
		};

		// If no predefined entities are provided, fetch them
		if (!entities.length) {
			fetchEntities();
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

	console.log("About to render ListEntity with:", displayEntities);

	// Render component structure
	return (
		<div>
			<h1>{title}</h1>
			<div>
				{/* Always show New and Cancel buttons */}
				<button className="button-green" onClick={handleNewClick}>
					New
				</button>
				<button className="button-green" onClick={handleCancelClick}>
					Cancel
				</button>
			</div>

			{/* Display content regardless of whether entities are available */}
			{displayEntities.length > 0 ? (
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
								{/* Optionally display `displayNum` */}
								{hasField(entity, "displayNum") &&
								entity.displayNum != null &&
								entity.displayNum !== 0
									? ` (${entity.displayNum})`
									: ""}
							</td>
						</tr>
					))}
					</tbody>
				</table>
			) : (
				// Render a fallback when there are no entities
				<div className="empty-state">
					<p>No {title} defined yet.</p>
				</div>
			)}
		</div>
	);
};

export default ListEntity;