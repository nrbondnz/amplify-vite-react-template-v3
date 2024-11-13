// src/components/generic/ListEntity.tsx
import { WithId } from "@shared/types/types";
//import { client } from "@shared/utils/client";
//import React from 'react';
import { useNavigate } from 'react-router-dom';

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

	const navigate = useNavigate();
	//const fred = client.models["locations"].list();
	//console.log("getResponseByModel, fred: ", fred)
	return (
		<div>
			<h1>{title}</h1>
			<button onClick={() => navigate(`/${entityDBName}/new`)}>Add
				New {title.slice(0, -1)}</button>
			<ul>
				{entities.map((entity) => (
					<li key={entity.id}
						onClick={() => navigate(`/${entityDBName}/${entity.id}`)}>
						{entity.entityName}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListEntity;