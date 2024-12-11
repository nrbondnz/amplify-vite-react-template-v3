

interface Observer<T> {
	next: (value: T) => void;
	error: (err: Error) => void;
	complete?: () => void;
}

interface ClientModel<T> {
	observeQuery: () => {
		subscribe: (observerOrNext?: Partial<Observer<{ items: T[]; isSynced: boolean }>> | ((value: { items: T[]; isSynced: boolean }) => void)) => { unsubscribe: () => void };
	};
	onCreate: () => {
		subscribe: (observer: Partial<Observer<T>>) => { unsubscribe: () => void };
	};
	onUpdate: () => {
		subscribe: (observer: Partial<Observer<T>>) => { unsubscribe: () => void };
	};
	onDelete: () => {
		subscribe: (observer: Partial<Observer<T>>) => { unsubscribe: () => void };
	};
}

interface ModelTypesClient {
	//machines: ClientModel<IMachine>;
	// Add other model types as needed
}