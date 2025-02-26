import React, { useState, useEffect } from "react";
import { IEntityManager } from "@shared/types/IEntityManager";
import { useSubscription } from "@context/SubscriptionContext";
import {
	WithId,
	AppEvent,
	EntityTypes,
	WithOrdinal
} from "@shared/types/types";
import { useDataContext } from "@context/DataContext";
import "./ListEntity.css";
type ListEntityProps<T> = T extends WithOrdinal
	? {
		title: string;
		entityDBName: string;
		entities?: T[];
		entitiesFiltered?: boolean;
		sortable: true; // Required when sorting enabled
	}
	: {
		title: string;
		entityDBName: string;
		entities?: T[];
		entitiesFiltered?: boolean;
		sortable?: false; // Sorting disabled
	};

const ListEntity = <T extends WithId>({
														title,
														entityDBName,
														entities = [],
														entitiesFiltered = false,
														sortable = false,
													}: ListEntityProps<T>) => {
	const { addCustomEvent } = useSubscription();
	const { getManagerByType } = useDataContext();

	const [, setEntityManager] = useState<IEntityManager<T> | undefined>(undefined);
	const [displayEntities, setDisplayEntities] = useState<T[]>(entities as T[]);


	// Track the index of the row being dragged
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	useEffect(() => {
		const manager = getManagerByType(entityDBName as EntityTypes);
		setEntityManager(manager);

		if (!manager) {
			console.warn(`No manager found for entity: ${entityDBName}`);
			setDisplayEntities([]);
			return;
		}

		const fetchEntities = async () => {
			try {
				let fetchedEntities: T[] = (manager.entities || []) as T[];

				// Sort by ordinal if entities implement WithOrdinal
				if (sortable) {
					fetchedEntities = [...fetchedEntities].sort(
						(a, b) => (a as unknown as WithOrdinal).ordinal - (b as unknown as WithOrdinal).ordinal
					);
				}

				setDisplayEntities(fetchedEntities);
			} catch (err) {
				console.error(`Error fetching entities for ${entityDBName}:`, err);
				setDisplayEntities([]);
			}
		};

		if (!entitiesFiltered && entities.length === 0) {
			fetchEntities();
		} else if (entities) {
			// Sort entities passed via props
			const sortedEntities = sortable
				? [...entities].sort((a, b) => (a as unknown as WithOrdinal).ordinal - (b as unknown as WithOrdinal).ordinal)
				: entities;

			setDisplayEntities(sortedEntities as T[]);
		}
	}, [entityDBName, sortable, entities, entitiesFiltered, getManagerByType]);

	const handleEditClick = (id: number) => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "EDIT_REQUEST",
			entityId: id,
			pageType: "LIST",
		};
		addCustomEvent(event);
		console.log(`Edit action triggered for entity with ID: ${id}`);
	};

	const handleNewClick = () => {
		const event: AppEvent = {
			entity: entityDBName,
			entityId: 0,
			actionType: "NEW_REQUEST",
			pageType: "LIST",
		};
		addCustomEvent(event);
	};

	const handleCancelClick = () => {
		const event: AppEvent = {
			entity: entityDBName,
			entityId: 0,
			actionType: "CANCEL_REQUEST",
			pageType: "LIST",
		};
		addCustomEvent(event);
	};

	const handleRemoveClick = (id: number, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent row click from also triggering
		setDisplayEntities((prev) => prev.filter((entity) => entity.id !== id));

		const event: AppEvent = {
			entity: entityDBName,
			entityId: id,
			actionType: "DELETE_REQUEST",
			pageType: "LIST",
		};
		addCustomEvent(event);

		console.log(`Entity with ID ${id} removed.`);
	};

// Handle drag start: Store the index of the dragged item
	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

// Handle drag over: Prevent default to allow dropping
	const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
		e.preventDefault();
	};




	// Handle dropping the dragged row
	// Handle dropping the dragged row
	const handleDrop = (targetIndex: number) => {
		if (draggedIndex === null || draggedIndex === targetIndex || !sortable) {
			setDraggedIndex(null);
			return;
		}

		setDisplayEntities((prevEntities) => {
			// Clone the entities array
			const updatedEntities = [...prevEntities];

			// Move the dragged entity to the target index
			const [draggedEntity] = updatedEntities.splice(draggedIndex, 1);
			updatedEntities.splice(targetIndex, 0, draggedEntity);

			// If sortable (i.e., T extends WithOrdinal), update ordinals
			if (sortable) {
				(updatedEntities as unknown as WithOrdinal[]).forEach((entity, index) => {
					entity.ordinal = index; // Update ordinal to match new index
				});
			}

			// Save changes back to the manager
			saveEntityOrder(updatedEntities);

			return updatedEntities;
		});

		// Reset dragged index
		setDraggedIndex(null);
	};

// Save the updated order back to the manager
	function saveEntityOrder(updatedEntities: T[]) {
		if (sortable) {
			const manager = getManagerByType(entityDBName as EntityTypes);
			if (manager) {
				updatedEntities.forEach((entity) => manager.updateEntity(entity));
			}
		}
	}

	console.log("About to render ListEntity with:", displayEntities);
	console.log("Draggable: ", sortable ? "true" : "false")
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

			{displayEntities.length > 0 ? (
				<table>
					<thead>
					<tr>

						<th>Name</th>

						<th>Actions</th>
					</tr>
					</thead>
					<tbody>
					{displayEntities.map((entity, index) => (
						<tr
							key={entity.id}
							draggable={sortable} // Enable dragging only if sortable
							onDragStart={() => sortable && handleDragStart(index)}
							onDragOver={(e) => sortable && handleDragOver(e)}
							onDrop={() => sortable && handleDrop(index)}
						>
							{/* Populate table columns */}

							<td
								onClick={() => handleEditClick(entity.id)} // Trigger edit on name click
								style={{ cursor: "pointer", textDecoration: "underline", width:200 }} // Optional styling for indication
							>
								{(entity as any).entityName || "N/A"}
							</td>


							<td style={{width:100}}>
								{/* Attach actions */}

								<button onClick={(e) => handleRemoveClick(entity.id, e)}>Remove</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			) : (
				<div>No entities found.</div>
			)}
		</div>
	);
};

export default ListEntity;