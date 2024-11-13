import { useSubscription } from "@context/SubscriptionContext";
import { WithId } from "@shared/types/types";

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
		addCustomEvent(entityDBName, "EDIT_REQUEST", id)
	}
	const handleNewClick = () => {
		addCustomEvent(entityDBName, "NEW_REQUEST")
	}

	//const navigate = useNavigate();
	//const fred = client.models["locations"].list();
	//console.log("getResponseByModel, fred: ", fred)
	return (
		<div>
			<h1>{title}</h1>
			<button onClick={handleNewClick}>New</button>
			<ul>
				{entities.map((entity) => (
					<li key={entity.id} onClick={() => handleEditClick(entity.id)}>
						{entity.entityName}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListEntity;