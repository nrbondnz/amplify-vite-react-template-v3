
import { useSubscription } from "@context/SubscriptionContext";
import { WithId, AppEvent } from "@shared/types/types";

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

	//const navigate = useNavigate();
	//const fred = client.models["locations"].list();
	//console.log("getResponseByModel, fred: ", fred)
	return (
		<div>
			<h1>{title}</h1>
			<button onClick={handleNewClick}>New</button>
			<button onClick={handleCancelClick}>Cancel</button>
			<ul>
				{entities.map((entity) => (
					<li key={entity.id}
						onClick={() => handleEditClick(entity.id)}>
						{entity.entityName}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListEntity;