---
title: Media Chrome in React
description: Media Chrome in React
layout: ../../../layouts/MainLayout.astro
---

Media Chrome provides a React version of every component to make using Media Chrome in your React app easy and idiomatic. These are included in our standard [npm package](https://www.npmjs.com/package/media-chrome).

To use, simply import any components from `"media-chrome/dist/react"`.

## Components

To follow React conventions, the wrapper components use PascalCase for the component name, so

- `<media-controller>` becomes `<MediaController/>`
- `<media-play-button>` becomes `<MediaPlayButton/>`
- `<media-volume-range>` becomes `<MediaVolumeRange>`

and so on. For a complete list of components, see the left sidebar.

## Properties

Also, to keep things "idiomatically React", the wrapper components use camelCase prop names for lowercase attribute names, so

- `seekoffset` becomes `seekOffset`
- `showduration` becomes `showDuration`

and so on.

## Putting it all together, a simple example:

Here's a simple example of what it looks like to use Media Chrome in React with the wrapper components:

```jsx
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from 'media-chrome/dist/react';

export const MyComponent = () => {
  return (
    <MediaController>
      <video
        slot="media"
        src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
        preload="auto"
        muted
        crossOrigin=""
      />
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaSeekBackwardButton></MediaSeekBackwardButton>
        <MediaSeekForwardButton></MediaSeekForwardButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <MediaMuteButton></MediaMuteButton>
        <MediaVolumeRange></MediaVolumeRange>
      </MediaControlBar>
    </MediaController>
  );
};
```

For a full demo, check out our [NextJS Demo App](https://github.com/muxinc/media-chrome/tree/main/demos/nextjs-with-typescript)
