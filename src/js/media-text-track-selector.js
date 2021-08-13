import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

const { MEDIA_SHOW_TEXT_TRACK_REQUEST } = MediaUIEvents;

template.innerHTML = `
  <style>
    #container {
      position: relative;
    }
    ul {
      display: none;
      list-style: none;
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
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_SUBTITLE_TRACKS];
  }

  constructor() {
    super();
    this._subtitleTextTracks = null;
    this._toggleList = this.toggleList.bind(this);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback () {
    this.subtitlesButton = this.shadowRoot.querySelector('#subtitlesButton');
    this.list = this.shadowRoot.querySelector('ul');
    this.subtitlesButton.addEventListener('click', this._toggleList);
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(_attrName, _oldValue, _newValue) {
    try {
      const parsed = JSON.parse(_newValue);
      this._subtitleTextTracks = parsed;
      this.renderTrackItems();
    } catch (e) {
      console.warn('Error parsing media-subtitle-tracks', e);
      this._subtitleTextTracks = null;
    }
  }

  renderTrackItems () {
    this.list.querySelectorAll('*').forEach(n => n.remove());
    if (this._subtitleTextTracks && this._subtitleTextTracks.length) {
      this._subtitleTextTracks.forEach((track) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerText = track.label;
        btn.addEventListener('click', () => {
          this.selectLang(track.label);
        });
        li.appendChild(btn);
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

  selectLang (label) {
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SHOW_TEXT_TRACK_REQUEST, { composed: true, bubbles: true, detail: label });
    this.dispatchEvent(evt);
  }
}

defineCustomElement('media-text-track-selector', MediaTextTrackSelector);

export default MediaTextTrackSelector;
