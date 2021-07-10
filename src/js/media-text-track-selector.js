import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { mediaUIEvents } from './media-chrome-html-element.js';
import { Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');
/*
  <media-playback-rate-button rates="1,1.5,2">
*/

// const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];

template.innerHTML = `
  <style>
    #container {
      position: relative;
    }
    ul {
      display: none;
      position: absolute;
      bottom: 30px;
      margin-inline: 0;
      padding-inline: 0;
    }
    ul.showing {
      display: block;
    }
  </style>
  <div id="container">
    <ul></ul>
    <button id="subtitlesButton">cc</button>
  </div>
`;

class MediaTextTrackSelector extends MediaChromeButton {
  constructor() {
    super();
    this._subtitleTextTracks = null;
    this._toggleList = this.toggleList.bind(this);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['media-subtitle-tracks'].concat(super.observedAttributes || []);
  }

  connectedCallback () {
    this.subtitlesButton = this.shadowRoot.querySelector('#subtitlesButton');
    this.list = this.shadowRoot.querySelector('ul');
    this.subtitlesButton.addEventListener('click', this._toggleList);
  }

  set mediaSubtitleTracks (tracks) {
    let parsed = null
    try {
      parsed = JSON.parse(tracks);
      this._subtitleTextTracks = parsed;
      this.renderTrackItems();
    } catch (e) {
      console.warn('Error parsing media-subtitle-tracks', e);
      this._subtitleTextTracks = null;
    }
  }

  get mediaSubtitleTracks () {
    return this._subtitleTextTracks;
  }

  renderTrackItems () {
    this.list.querySelectorAll('*').forEach(n => n.remove());
    if (this._subtitleTextTracks && this._subtitleTextTracks.length) {
      this._subtitleTextTracks.forEach((track) => {
        const li = document.createElement('li');
        li.innerText = track.label;
        this.list.appendChild(li);
      });
    } else {
      this.subtitlesButton.innerText = 'n/a';
    }
  }

  toggleList (e) {
    if (this.list.classList.contains('showing')) {
      this.list.classList.remove('showing');
    } else {
      this.list.classList.add('showing');
    }
  }
}

defineCustomElement('media-text-track-selector', MediaTextTrackSelector);

export default MediaTextTrackSelector;
