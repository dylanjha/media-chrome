import { MediaChromeButton } from './media-chrome-button.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
import { getBooleanAttr, setBooleanAttr } from './utils/element-utils.js';

const { MEDIA_TIME_IS_LIVE, MEDIA_PAUSED } = MediaUIAttributes;
const { MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST } = MediaUIEvents;

const indicatorSVG =
  '<svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <style>

  slot[name=indicator] > *,
  :host ::slotted([slot=indicator]) {
    ${/* Override styles for icon-only buttons */ ''}
    min-width: auto;
    fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
    color: var(--media-live-button-icon-color, rgb(140, 140, 140));
  }

  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) slot[name=indicator] > *,
  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) ::slotted([slot=indicator]) {
    fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
    color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
  }

  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) {
    cursor: not-allowed;
  }

  </style>

  <slot name="indicator">${indicatorSVG}</slot>
  ${
    /*
    A new line between spacer and text creates inconsistent spacing
    between slotted items and default slots.
  */ ''
  }
  <slot name="spacer">&nbsp;</slot><slot name="text">LIVE</slot>
`;

/**
 * @slot indicator - The default is an SVG of a circle that changes to red when the video or audio is live. Can be replaced with your own SVG or font icon.
 * @slot spacer - A simple text space (&nbsp;) between the indicator and the text.
 * @slot text - The text content of the button, with a default of “LIVE”.
 *
 * @attr {boolean} mediapaused - (read-only) Present if the media is paused.
 * @attr {boolean} mediatimeislive - (read-only) Present if the media playback is live.
 *
 * @cssproperty [--media-live-button-display = inline-flex] - `display` property of button.
 * @cssproperty --media-live-button-icon-color - `fill` and `color` of not live button icon.
 * @cssproperty --media-live-button-indicator-color - `fill` and `color` of live button icon.
 */
class MediaLiveButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MEDIA_PAUSED, MEDIA_TIME_IS_LIVE];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
    this.setAttribute('aria-label', verbs.SEEK_LIVE());
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (this.mediaPaused || !this.mediaTimeIsLive) {
      this.setAttribute('aria-label', verbs.SEEK_LIVE());
      this.removeAttribute('aria-disabled');
    } else {
      this.setAttribute('aria-label', verbs.PLAYING_LIVE());
      this.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * @type {boolean} Is the media paused
   */
  get mediaPaused() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
  }

  set mediaPaused(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
  }

  /**
   * @type {boolean} Is the media playback currently live
   */
  get mediaTimeIsLive() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_TIME_IS_LIVE);
  }

  set mediaTimeIsLive(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_TIME_IS_LIVE, value);
  }

  handleClick() {
    // If we're live and not paused, don't allow seek to live
    if (!this.mediaPaused && this.mediaTimeIsLive) return;

    this.dispatchEvent(
      new window.CustomEvent(MEDIA_SEEK_TO_LIVE_REQUEST, {
        composed: true,
        bubbles: true,
      })
    );

    // If we're paused, also automatically play
    if (this.hasAttribute(MEDIA_PAUSED)) {
      this.dispatchEvent(
        new window.CustomEvent(MEDIA_PLAY_REQUEST, {
          composed: true,
          bubbles: true,
        })
      );
    }
  }
}

if (!window.customElements.get('media-live-button')) {
  window.customElements.define('media-live-button', MediaLiveButton);
}

export default MediaLiveButton;
