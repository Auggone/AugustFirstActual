import "./links.css";
import { FaInstagram, FaYoutube, FaTwitter, FaGoodreads, FaSoundcloud } from 'react-icons/fa';
import { FaLetterboxd } from 'react-icons/fa6';


export default function links(){

    return (

        <div className = 'link-box'> 
        
        <a href = "https://www.instagram.com/august.distefan0/"><FaInstagram /> <span class="label">Instagram Account</span> </a>
        <a href = "https://x.com/august_distef"><FaTwitter /> <span class="label">X Account</span> </a>
        <a href = "https://www.youtube.com/@AugustDiStefano"><FaYoutube /> <span class="label">YouTube Channel</span> </a>
        <a href = "https://www.goodreads.com/user/show/199496084-august-dist"><FaGoodreads /> <span class="label">Goodreads</span> </a>
        <a href = "https://soundcloud.com/aug-dist"><FaSoundcloud /> <span class="label">Sound Cloud</span> </a>
        <a href = "https://boxd.it/lzmd7"><FaLetterboxd /> <span class="label">Letterboxd</span> </a>

        </div>
        
    )
}