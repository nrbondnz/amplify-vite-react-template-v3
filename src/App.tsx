import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [locations, setLocations] = useState<Array<Schema["locations"]["type"]>>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locationList = await client.models.locations.list();
                setLocations(locationList.data); // assuming locationList.items
                // is the array of locations
            } catch (error) {
                console.error("Failed to fetch locations:", error);
            }
        };

        fetchLocations();
    }, []);

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

    useEffect(() => {
        const subscription = client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });

        return () => subscription.unsubscribe();
    }, []);

    function createTodo() {
        const content = window.prompt("Todo content");
        if (content) {
            client.models.Todo.create({ content });
        }
    }

    return (
        <main>
            <h1>My todos</h1>
            <button onClick={createTodo}>+ new</button>
            <ul>
                {todos.map((todo) => (
                    <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
                        {todo.content}
                    </li>
                ))}
            </ul>
            <h2>Locations</h2>
            <ul>
                {locations.map((location) => (
                    <li key={location.id}>{location.entityName}</li>
                ))}
            </ul>
            <div>
                🥳 App successfully hosted. Try creating a new todo.
                <br />
                <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                    Review next step of this tutorial.
                </a>
            </div>
        </main>
    );
}

export default App;