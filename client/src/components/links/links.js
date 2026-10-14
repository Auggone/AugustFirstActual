import "./links.css";
import { FaInstagram, FaYoutube, FaTwitter, FaGoodreads, FaSoundcloud, FaEnvelope } from 'react-icons/fa';
import { FaLetterboxd } from 'react-icons/fa6';

// Social links shown on the site, in order
const LINKS = [
    { href: "https://www.instagram.com/august.distefan0/", Icon: FaInstagram, label: "Instagram Account" },
    { href: "https://x.com/august_distef", Icon: FaTwitter, label: "X Account" },
    { href: "https://www.youtube.com/@AugustDiStefano", Icon: FaYoutube, label: "YouTube Channel" },
    { href: "https://boxd.it/lzmd7", Icon: FaLetterboxd, label: "Letterboxd" },
    { href: "https://mail.google.com/mail/?view=cm&fs=1&to=augdist4@gmail.com", Icon: FaEnvelope, label: "Email", newTab: true },
];

// Archived: put away, not shown. Move one up into LINKS to bring it back.
// eslint-disable-next-line no-unused-vars
const ARCHIVED_LINKS = [
    { href: "https://www.goodreads.com/user/show/199496084-august-dist", Icon: FaGoodreads, label: "Goodreads" },
    { href: "https://soundcloud.com/aug-dist", Icon: FaSoundcloud, label: "Sound Cloud" },
];

export default function links(){

    return (

        <div className = 'link-box'>

        {LINKS.map(({ href, Icon, label, newTab }) => (
            <a key={href} href={href} {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}><Icon /> <span className="label">{label}</span> </a>
        ))}

        </div>

    )
}
