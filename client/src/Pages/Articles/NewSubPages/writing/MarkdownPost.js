// src/Pages/Articles/NewSubPages/writing/MarkdownPost.js
// The page behind /articles/<slug> for any post written as a markdown file.
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from '../../../../markdown/Markdown';
import { usePosts, formatDate } from '../../../../markdown/posts';

export default function MarkdownPost() {
  const { slug } = useParams();
  const { posts, loading, error } = usePosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div className="md-status">Loading…</div>;
  }

  if (error) {
    return <div className="md-status">This post could not be loaded.</div>;
  }

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="md-status">
        <p>There is nothing written here yet.</p>
        <Link to="/writing">← back to writing</Link>
      </div>
    );
  }

  return (
    <article className={`md-post md-align-${post.align}`}>
      <nav className="md-post-back">
        <Link to="/writing">← back to writing</Link>
      </nav>

      <header className="md-post-header">
        <h1 className="md-post-title">{post.title}</h1>
        {post.date ? <p className="md-post-date">{formatDate(post.date)}</p> : null}
      </header>

      <Markdown source={post.content} />

      <footer className="md-post-footer">
        <Link to="/writing">← more writing</Link>
      </footer>
    </article>
  );
}
