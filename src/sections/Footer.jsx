import React from 'react';

export default function Footer({ data }) {
  return (
    <footer className="border-t border-zinc-800 bg-black px-6 py-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-400">&copy; {data.copyright}</p>
        </div>
        <div>
          <a href="#home" className="text-gray-400 transition-colors hover:text-gray-600">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
