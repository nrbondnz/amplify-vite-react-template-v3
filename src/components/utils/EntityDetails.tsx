import { useState, FC } from 'react';

// Import ShowPicture
import ShowPicture from './ShowPicture';

// Import necessary types
import { WithId, WithIdAndDisplayNum } from '@shared/types/types';

interface EntityTableProps<T extends WithId> {
	entities: T[];
	selectPressed: (entity: T) => void;
}

const EntityTable: FC<EntityTableProps<WithId>> = ({ entities, selectPressed }) => {
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const handleSelect = (entity: WithId) => {
		setSelectedId(entity.id);
		selectPressed(entity);
	};

	const isWithIdAndDisplayNum = (entity: any): entity is WithIdAndDisplayNum => {
		return 'displayNum' in entity;
	};

	return (
		<table style={{ width: '100%', borderCollapse: 'collapse' }}>
			<tbody>
			{entities.map(entity => (
				<tr
					key={entity.id}
					onClick={() => handleSelect(entity)}
					style={{
						cursor: 'pointer',
						border: '1px solid black',
						backgroundColor: selectedId === entity.id ? 'lightgreen' : 'white',
						transition: 'background-color 0.3s ease',
					}}
					onMouseOver={(e) => {
						if (selectedId !== entity.id) {
							e.currentTarget.style.backgroundColor = 'lightcoral';
						}
					}}
					onMouseOut={(e) => {
						if (selectedId !== entity.id) {
							e.currentTarget.style.backgroundColor = 'white';
						}
					}}
				>
					<td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
						{isWithIdAndDisplayNum(entity) && (
							<ShowPicture
								name={entity.entityName}
								entityDisplayNum={entity.displayNum}
							/>
						)}
					</td>
					<td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
						{entity.entityName}
					</td>
				</tr>
			))}
			</tbody>
		</table>
	);
};

export default EntityTable;

// Usage example
// const ParentComponent = () => {
//     const handleSelection = (entity) => {
//         console.log('Selected entity:', entity);
//     };

//     const machines: IMachine[] = [
//         { id: 1, entityName: 'Machine 1', displayNum: 101, idLocation: 1 },
//         { id: 2, entityName: 'Machine 2', displayNum: 102, idLocation: 2 },
//         // More entities can be added here
//     ];

//     return <EntityTable entities={machines} selectPressed={handleSelection} />;
// };