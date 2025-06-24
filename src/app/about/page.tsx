'use client';

import React from 'react';
import bonfireGif from '@assets/bonfire.gif';

export default function About(): React.JSX.Element {
  return (
    <article className="mx-auto xs:px-12 px-8 gap-10 max-w-6xl place-content-center">
      <section>
        <h2>About</h2>
        <p>
          This is my personal website. These are the purposes of why I created the website:
        </p>
        <ol className="list-decimal pt-4 pl-4">
          <li>Writing allows me to dig deeper into the topics I am interested in.</li>
          <li>Practice my english.</li>
          <li>Experimenting with minimal design to discover my preferred UI for reading.</li>
          <li>Revisit my old posts and see how I have improved.</li>
        </ol>
        <p className="mt-18 mb-18">
          <span className="font-bold">It is not entirely a blog.</span> I'm planning to add random stuff here as well.
        </p>
      </section>
      <section>
        <h2 className="mt-8 mb-8">That's basically it!</h2>
        <div className="text-center">
          <img src={bonfireGif.src} alt="Bonfire GIF" className="mx-auto" />
          <span className="text-gray-500 text-sm italic">"If you require rest, now is the time. That is, after all, what the bonfire is for."</span>
        </div>
      </section>
    </article>
  );
}
