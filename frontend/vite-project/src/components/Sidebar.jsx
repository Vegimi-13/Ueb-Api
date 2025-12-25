import { Link } from "react-router-dom";

export default function Sidebar({ menu }) {
  return (
    <div style={{ width: 200, borderRight: "1px solid #ccc" }}>
      {menu.map((item) => (
        <div key={item.path}>
          <Link to={item.path}>{item.label}</Link>
        </div>
      ))}
    </div>
  );
}
