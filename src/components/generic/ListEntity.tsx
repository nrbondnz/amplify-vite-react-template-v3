import { useSubscription } from "@context/SubscriptionContext";
import { WithId, AppEvent } from "@shared/types/types";
import './ListEntity.css';  // Import the CSS file for styles

interface ListEntityProps<T extends WithId> {
	title: string;
	entities: T[];
	entityDBName: string;
}

const ListEntity = <T extends WithId>({
										  title,
										  entities,
										  entityDBName
									  }: ListEntityProps<T>) => {
	const { addCustomEvent } = useSubscription();

	const handleEditClick = (id: number) => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "EDIT_REQUEST",
			entityId: id,
			pageType: "LIST"
		};
		addCustomEvent(event);
	}

	const handleNewClick = () => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "NEW_REQUEST",
			pageType: "LIST"
		};
		addCustomEvent(event);
	}

	const handleCancelClick = () => {
		const event: AppEvent = {
			entity: entityDBName,
			actionType: "CANCEL_REQUEST",
			pageType: "LIST"
		};
		addCustomEvent(event);
	}

	return (
		<div>
			<h1>{title}</h1>
			<button className="button-green" onClick={handleNewClick}>New</button>
			<button className="button-green" onClick={handleCancelClick}>Cancel</button>
			<table className="styled-table">
				<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
				</thead>
				<tbody>
				{entities.map((entity, index) => (
					<tr key={entity.id}
						onClick={() => handleEditClick(entity.id)}
						className={`entity-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
						<td>{entity.id}</td>
						<td>{entity.entityName}</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};

export default ListEntity;