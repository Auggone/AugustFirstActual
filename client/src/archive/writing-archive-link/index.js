// features/writing-archive-link
// The "Archive" link above the cards on the v2 Writing page, leading to the
// archive of older posts. Fills the "v2-writing-links" slot (Pages/V2/WritingV2.js).
import { Link } from "react-router-dom";

function ArchiveLink() {
  return <Link to="/writing/archive" className="writing-link">Archive</Link>;
}

const feature = {
  name: "writing-archive-link",
  slots: {
    "v2-writing-links": ArchiveLink,
  },
};

export default feature;
