const windowShim = {
  HTMLElement: function HTMLElement() {},
  CustomEvent: function () {},
  customElements: {
    get: function(){},
    define: function(){},
    whenDefined: function(){}
  }
};

const documentShim = {
  createElement: function() { return {}; }
};

export const isServer = typeof window === 'undefined' || typeof window.customElements === 'undefined';
export const Window = isServer ? windowShim : window;
export const Document = isServer ? documentShim : window.document;
