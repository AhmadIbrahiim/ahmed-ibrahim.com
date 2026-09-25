import React from "react";
import { Link } from "gatsby";
import { formatDate } from "../utils/global";

export default function PostListing({ postEdges }) {
  return (
    <ul className="posts-list">
      {postEdges.map(({ node }) => (
        <li key={node.fields.slug}>
          <Link to={node.fields.slug}>
            <span className="post-list-title">{node.frontmatter.title}</span>
            <time className="date" dateTime={node.fields.date}>
              {formatDate(node.fields.date)}
            </time>
            <span className="row-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
