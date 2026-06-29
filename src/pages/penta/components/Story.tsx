import { Fragment } from 'react';
import { storyText } from '../matchData';

/** Render text with **bold** markers as <b> spans. */
function renderBold(text: string) {
  const parts = text.split('**');
  return parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>));
}

export default function Story() {
  return (
    <section className="story">
      <h3>The story of the match</h3>
      <p>{renderBold(storyText())}</p>
    </section>
  );
}
