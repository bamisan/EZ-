import UserListTable from "./Components/UserListTable";
import usersData from "./DummyData/usersData.json";

function App() {
  return (
    <div className="App">
      <UserListTable users={usersData} />
    </div>
  );
}

export default App;
