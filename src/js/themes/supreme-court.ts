/* 
 * First used in a Mux blog post that contained snippets of audio
 * from supreme court justices
 *
 * https://www.mux.com/blog/up-next-the-lawsuit-threatening-your-youtube-watch-queue
 *
<media-theme-supreme-court>
  <video
    slot="media"
    src="https://stream.mux.com/rknNLDjvn01ONcHtbElIibwEU6Vv86008X/high.mp4"
  ></video>
</media-theme-supreme-court>
*/

import { window, document } from '../utils/server-safe-globals.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
  media-controller, .controls {
    --media-control-padding: 0;
    --media-control-background: transparent;
    --media-control-hover-background: transparent;
  }
  media-controller media-play-button > svg {
    height: 40px;
  }
  media-controller[breakpoint-md] media-play-button > svg {
    height: 50px;
  }
  .controls {
    background: black;
    height: 30px;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .controls > * {
    margin-right: 10px;
  }
  media-mute-button {
    margin-left: 10px;
  }
  media-time-display {
  }
  media-time-range {
    flex-grow: 1;
  }
</style>
<media-controller id="mc">
  <slot name="media" slot="media"></slot>
  <div slot="centered-chrome">
    <media-play-button>
      <svg slot="play" width="90" height="89" viewBox="0 0 90 89" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="90" height="89" rx="44.5" fill="#FA50B5"/>
        <path d="M62.397 42.829L34.0636 28.2614C32.619 27.5187 30.8135 28.4471 30.8135 29.9324V59.0676C30.8135 60.5528 32.619 61.4813 34.0636 60.7386L62.397 46.171C63.8416 45.4282 63.8416 43.5715 62.397 42.829Z" fill="white"/>
      </svg>
      <svg slot="pause" width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="26" rx="3" fill="#FA50B5"/>
        <path d="M11.9071 6H8.96889C8.46857 6 8.06299 6.40559 8.06299 6.9059V19.0941C8.06299 19.5944 8.46857 20 8.96889 20H11.9071C12.4074 20 12.813 19.5944 12.813 19.0941V6.9059C12.813 6.40559 12.4074 6 11.9071 6Z" fill="white"/>
        <path d="M21.1571 6H18.2189C17.7186 6 17.313 6.40559 17.313 6.9059V19.0941C17.313 19.5944 17.7186 20 18.2189 20H21.1571C21.6574 20 22.063 19.5944 22.063 19.0941V6.9059C22.063 6.40559 21.6574 6 21.1571 6Z" fill="white"/>
      </svg>
    </media-play-button>
  </div>
</media-controller>
<div class="controls">
  <div>
    <media-mute-button media-controller="mc"></media-mute-button>
    <media-volume-range media-controller="mc"></media-volume-range>
  </div>
  <media-time-display show-duration media-controller="mc"></media-time-display>
  <media-time-range media-controller="mc"></media-time-range>
</div>
`;

class MediaThemeSupremeCourt extends MediaThemeElement {
  static template = template;
}

if (!window.customElements.get('media-theme-supreme-court')) {
  window.customElements.define('media-theme-supreme-court', MediaThemeSupremeCourt);
}

export default MediaThemeSupremeCourt;
