# Architecture Guide: Connecting Frontend and Backend

This guide explains how the React frontend (in the `/web` directory) is bundled and served by the Cloudflare Worker backend (in the `/src` directory).

## Overview

The project is divided into two main parts:

1.  **`/src`**: The server-side Cloudflare Worker code.
2.  **`/web`**: The client-side React application code.

For the server to display the user interface, the React application must be packaged and embedded into the server's code. This is done through a build and "inlining" process.

## The Build and Inline Process

Here is a step-by-step flow of how your React components become a UI served by the worker:

```
[web/src/**] -> [esbuild] -> [web/dist/component.js] -> [inlining script] -> [src/components/react-widget-inline.ts] -> [src/components/react-widget-resource.ts] -> [src/index.ts] -> (User)
```

### Key Files and Their Roles

#### 1. `web/src/**`
This is where you write your React components, hooks, and styles (`styles.css`). This is the source code for your user interface.

#### 2. `web/dist/component.js`
This file is the output of the `esbuild` process (configured in `web/build.mjs`). It contains all your React code and CSS, bundled and minified into a single, efficient JavaScript file.

#### 3. `scripts/inline-react-widget.js`
This script takes the bundled `component.js` file and converts its contents into a single string, which it then saves into `react-widget-inline.ts`.

#### 4. `src/components/react-widget-inline.ts`

- **Purpose**: To hold the entire frontend application as a JavaScript string constant.
- **IMPORTANT**: This is an **auto-generated file**. You should **never edit it manually**, as your changes will be overwritten by the build process.

#### 5. `src/components/react-widget-resource.ts`

- **Purpose**: To provide the final HTML document that gets served to the user.
- **How it works**: It defines a basic HTML shell (`<!DOCTYPE html>...`). It then imports the JavaScript string from `react-widget-inline.ts` and injects it into a `<script type="module">` tag. This is how the browser receives and runs your React application.

#### 6. `src/index.ts`

- **Purpose**: This is the main entry point for the Cloudflare Worker.
- **How it works**: It imports the final HTML string from `react-widget-resource.ts` and registers it as a UI resource that can be served when requested.

## Summary

This architecture allows for a clean separation between your frontend and backend code while providing a robust process to bundle and serve the UI efficiently within the Cloudflare Workers environment. The files in `src/components` are essential plumbing for this process and are not meant to be edited directly.
