import { Link } from "react-router-dom";
import { useGridControls } from "../../animation";
import "./navigation.css";



export default function Navigation(){
  const { cycleFilter, toggleGroup, filter, group } = useGridControls();

  return (
    <nav className="nav">
      <button onClick={() => cycleFilter()}>
        {filter}
      </button>
      {/* Optional: a second button to toggle grouping */}
      {/* <button onClick={toggleGroup}>{group ? "Ungroup" : "Group"}</button> */}
    </nav>
  );
}
