import { Link } from "react-router-dom";
import list from "../Assets/list.svg";
import { useState } from "react";

export default function Nav() {
  const [expandNav, setExpandNav] = useState(false);

  return (
    <div className="nav">
      <h1>Our Name</h1>
      <span>
        <img src={list} alt="dropdown button icon" onClick={() => setExpandNav(!expandNav)} />
        {expandNav && (
          <div className="expanded">
            <Link to="/scanner" onClick={() => setExpandNav(false)}>
              Scan Food
            </Link>
            <Link to="/rewards" onClick={() => setExpandNav(false)}>
              Rewards
            </Link>
          </div>
        )}
      </span>
    </div>
  );
}