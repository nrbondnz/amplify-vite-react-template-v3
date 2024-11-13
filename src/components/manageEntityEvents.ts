interface LastEvent {
	entity: string;
	actionType: string;
	timestamp: number;
}

const manageEntityEvents = <T, S extends ClientModel<T>>(
	entityModel: S,
	entityName: string,
	setState: (items: T[]) => void,
	setLastEvent: (event: LastEvent | null) => void
) => {
	const querySub = entityModel.observeQuery().subscribe({
		next: ({ items }) => setState(items),
		error: (error) => console.warn(error),
	});

	const createSub = entityModel.onCreate().subscribe({
		next: () => {
			const event: LastEvent = {
				entity: entityName,
				actionType: "CREATE",
				timestamp: Date.now(),
			};
			setLastEvent(event);
			localStorage.setItem("lastEvent", JSON.stringify(event));
		},
		error: (error) => console.warn(error),
	});

	const updateSub = entityModel.onUpdate().subscribe({
		next: () => {
			const event: LastEvent = {
				entity: entityName,
				actionType: "UPDATE",
				timestamp: Date.now(),
			};
			setLastEvent(event);
			localStorage.setItem("lastEvent", JSON.stringify(event));
		},
		error: (error) => console.warn(error),
	});

	const deleteSub = entityModel.onDelete().subscribe({
		next: () => {
			const event: LastEvent = {
				entity: entityName,
				actionType: "DELETE",
				timestamp: Date.now(),
			};
			setLastEvent(event);
			localStorage.setItem("lastEvent", JSON.stringify(event));
		},
		error: (error) => console.warn(error),
	});

	return () => {
		querySub.unsubscribe();
		createSub.unsubscribe();
		updateSub.unsubscribe();
		deleteSub.unsubscribe();
	};
};

export { manageEntityEvents };