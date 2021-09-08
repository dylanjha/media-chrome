import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { Document as document } from './utils/server-safe-globals.js';

const slotTemplate = document.createElement('template');

const { MEDIA_SHOW_TEXT_TRACK_REQUEST } = MediaUIEvents;

const subtitlesIcon = 
  '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>'

slotTemplate.innerHTML = `
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
    ul li {
      cursor: pointer;
    }
    ul.showing {
      display: block;
    }
  </style>
  <div id="container">
    <ul></ul>
    <slot id="subtitlesButton" name="subtitles">${subtitlesIcon}</slot>
  </div>
`;

class MediaTextTrackSelector extends MediaChromeButton {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_SUBTITLE_TRACKS];
  }

  constructor(options={}) {
    super({ slotTemplate, ...options });
    this._subtitleTextTracks = null;
    this._toggleList = this.toggleList.bind(this);
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
