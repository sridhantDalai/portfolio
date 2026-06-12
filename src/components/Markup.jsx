import React from 'react';

export function Markup({ html, className = '' }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html ?? '' }} />;
}
