import React from "react";
import { Link } from "react-router-dom";
import "./navbartwo.css";

const NAV_ITEMS = ["Gallery", "Writing", "Music", "Portfolio"];

// base: path the links start from (e.g. "/v2" sends Gallery to /v2/gallery)
export default function NavBarTwo({ base = "" }) {
  return (
    <nav className="sidebar">
      {NAV_ITEMS.map((item) => (
        <Link key={item} to={`${base}/${item.toLowerCase()}`} className="sidebar-item">
          {item}
        </Link>
      ))}
    </nav>
  );
}







