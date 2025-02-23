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

const ListEntity = <T extends WithId & WithOrdinal>({
														title,
														entityDBName,
														entities = [],
														getName = (entity: T) => (entity as any).entityName || "Unnamed", // Extracting entity name
													}: {
	title: string;
	entityDBName: string;
	entities?: T[];
	getName?: (entity: T) => string; // Function to extract the name
}) => {
	const { addCustomEvent } = useSubscription();
	const { getManagerByType } = useDataContext();

	const [, setEntityManager] = useState<IEntityManager<T> | undefined>(undefined);
	const [displayEntities, setDisplayEntities] = useState<T[]>(entities);

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
				let fetchedEntities: T[] = manager.entities || [];

				// Sort by ordinal if applicable
				if (
					fetchedEntities.length > 0 &&
					typeof (fetchedEntities[0] as WithOrdinal).ordinal === "number"
				) {
					fetchedEntities = fetchedEntities.sort(
						(a, b) =>
							(a as WithOrdinal).ordinal - (b as WithOrdinal).ordinal
					);
				}

				setDisplayEntities(fetchedEntities);
			} catch (err) {
				console.error(`Error fetching entities for ${entityDBName}:`, err);
				setDisplayEntities([]);
			}
		};

		if (!entities.length) {
			fetchEntities();
		}
	}, [entityDBName, entities, getManagerByType]);

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

	// Handle drag start
	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	// Handle drag over (required to allow dropping)
	const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
		e.preventDefault();
	};

	function saveEntityOrdinalSwap(sourceEntity: T, targetEntity: T) {
		console.log("Saving entity ordinal swap:", sourceEntity, targetEntity);
		const manager = getManagerByType(entityDBName as EntityTypes);
		manager?.updateEntity(sourceEntity);
		manager?.updateEntity(targetEntity);
	}

	// Handle dropping the dragged row
	const handleDrop = (targetIndex: number) => {
		if (draggedIndex === null || draggedIndex === targetIndex) return;

		setDisplayEntities((prevEntities) => {
			const updatedEntities = [...prevEntities];
			const sourceEntity = updatedEntities[draggedIndex];
			const targetEntity = updatedEntities[targetIndex];

			// Swap ordinal values only
			const tempOrdinal = sourceEntity.ordinal;
			sourceEntity.ordinal = targetEntity.ordinal;
			targetEntity.ordinal = tempOrdinal;
			// todo save changes to DB
			saveEntityOrdinalSwap(sourceEntity, targetEntity);
			// Sort the array to maintain ordered display
			return updatedEntities.sort((a, b) => a.ordinal - b.ordinal);
		});

		setDraggedIndex(null); // Reset draggedIndex
	};

	// Handle drag end
	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	console.log("About to render ListEntity with:", displayEntities);

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
				<table className="styled-table">
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Actions</th>
					</tr>
					</thead>
					<tbody>
					{displayEntities.map((entity, index) => (
						<tr
							key={entity.id}
							draggable
							onDragStart={() => handleDragStart(index)}
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(index)}
							onDragEnd={handleDragEnd}
							onClick={() => handleEditClick(entity.id)} // Row click invokes edit
							className={`entity-row ${
								index % 2 === 0 ? "even" : "odd"
							}`}
						>
							<td>{entity.id}</td>
							<td>{getName(entity)}</td>
							<td>
								<button
									className="button-red"
									onClick={(e) => handleRemoveClick(entity.id, e)}
								>
									Remove
								</button>
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