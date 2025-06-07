import { useQuery } from "@tanstack/react-query";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { api } from "./config";
import viteLogo from "/vite.svg";

function App() {
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch(
        `${api.baseUrl}/api/v1/todos`, // Adjust the endpoint as needed
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIyYzMiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.G5wdYS1G5gfd14BnsXrZ0JcLW0kB5ItFd7M_9elzjUQ`,
          },
        }
      );
      return (await response.json()) as {
        data: { items: { id: string; title: string }[] };
      };
    },
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <span>API Gateway Base URL: {api.baseUrl}</span>
      <h3>Todos</h3>
      <ul>
        {query.data?.data.items.map((todo) => (
          <li key={todo.id}>
            <div>
              {todo.id} : "{todo.title}"
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
