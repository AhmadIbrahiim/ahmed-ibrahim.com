import React from "react";
import kebabCase from "lodash.kebabcase";
import { Link } from "gatsby";

export default function PostTags({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="post-tags topic-links">
      {tags.map(tag => (
        <Link key={tag} to={`/tags/${kebabCase(tag)}/`}>
          {tag}
        </Link>
      ))}
    </div>
  );
}
