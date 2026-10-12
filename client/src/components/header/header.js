import { Link } from "react-router-dom";
import './header.css'

// to: where the title links
export default function Header({ to = "/" }){


    return (
        <header>

        <Link to = {to} className = "logo">August First  </Link>
        
        
        
      </header>
    );
}



