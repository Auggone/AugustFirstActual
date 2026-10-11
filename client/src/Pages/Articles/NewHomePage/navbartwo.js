import React from "react";
import { Link } from "react-router-dom";
import "./navbartwo.css";

const NAV_ITEMS = ["Gallery", "Video", "Writing", "Music"];

export default function NavBarTwo() {
  return (
    <nav className="sidebar">
      {NAV_ITEMS.map((item) => (
        <Link key={item} to={`/${item.toLowerCase()}`} className="sidebar-item">
          {item}
        </Link>
      ))}
    </nav>
  );
}







