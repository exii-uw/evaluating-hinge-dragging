# Hinge-Based Interaction Demos

A series of demos illustrating how we can leverage the hinge of foldable devices for
interactions. All demos are optimized for the X1 Fold. Some demos require a swipe
from the edge of the screen, which requires [disabling the Windows edge swipe gesture](https://www.top-password.com/blog/disable-edge-swipe-gesture-in-windows-10/).

## Getting Started

-   [Install node](https://nodejs.org/en/)
-   [Disable the Windows edge swipe gesture (required for the touchbar demo)](https://www.top-password.com/blog/disable-edge-swipe-gesture-in-windows-10/)
-   In the project directory, install dependencies by running `npm install`
-   Run with `npm start`
-   Go to `http://localhost:3000` in your web browser to try it out!

## Overview of Demos

### Touchbar App

This demo shows a touchbar by swiping from the right edge of the hinge. This reveals buttons
for controlling media, sliders for brightness/volume, and a slider for selecting a wifi
network.

Sliding from the left edge of the hinge opens a multitasking menu. Dragging a window down
from the hinge opens the app either on the top or bottom half of the screen.

This demo is optimized for **portrait orientation only** (like a laptop is oriented).

### Window Management App

This shows how we can drag windows through various parts of the hinge to align windows in various
sections of the screen. Try dragging the window through different icons which show up along the
hinge.

This demo is optimized for both orientations.

### Drawing App

This shows a basic way we can manipulate objects in a drawing application by dragging through
different sections of the hinge. It's possible to cross the hinge multiple times to make multiple
selections, like duplicating the circle and turning it green.

This demo is optimized for both orientations.

### File Management App

This shows how we can perform actions like duplicate and rename by dragging a file through the
hinge multiple times in sequence. It also allows opening and sharing a file by dragging to
the appropriate icon and then dragging along the hinge to the specific app/sharing option.

This demo is optimized for **portrait orientation only** (like a laptop is oriented).
