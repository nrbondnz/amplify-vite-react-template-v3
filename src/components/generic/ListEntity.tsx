import React, { useState, useEffect } from "react";
import { IEntityManager } from "@shared/types/IEntityManager";
import { useSubscription } from "@context/SubscriptionContext";
import { WithId, AppEvent, EntityTypes } from "@shared/types/types";
import { useDataContext } from "@context/DataContext";
import "./ListEntity.css";

const ListEntity = <T extends WithId>({
										  title,
										  entityDBName,
										  entities = [],
										  getName = (entity: T) => (entity as any).entityName || "Unnamed", // Updated to use entityName
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
				const fetchedEntities = manager.entities || [];
				setDisplayEntities(fetchedEntities as T[]);
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

	// todo fix this method to feed up to parent and then send an event
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
							onClick={() => handleEditClick(entity.id)} // Re-added row click functionality
							className={`entity-row ${index % 2 === 0 ? "even" : "odd"}`}
						>
							<td>{entity.id}</td>
							{/* Use the provided getName function to extract the entity name */}
							<td>{getName(entity)}</td>
							<td>
								{/* Stop event propagation to prevent row click */}
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