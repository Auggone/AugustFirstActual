// layout.js
import { Outlet } from "react-router-dom";
import Header from "./components/header/header";
import Navigation from "./components/nav/navigation";
import Link from "./components/links/links";
import NavBarTwo from "./Pages/Articles/NewHomePage/navbartwo.js";
import "./layout.css";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="desktop-only">
        <Link />
        <div className="nav-box">
          <NavBarTwo />
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
}