import "./App.css";
import { Container } from "@material-ui/core";
import JobList from "./components/JobList";

const App = () => {
  return (
    <Container>
      <JobList />
    </Container>
  );
};

export default App;
