
import { BUNDLED_REACT_COMPONENT as bundledComponent } from "./react-widget-inline";

export const REACT_WIDGET_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pexels Gallery Widget</title>
</head>
<body>
  <div id="app-root"></div>
  <script type="module">
${bundledComponent}
  </script>
</body>
</html>
`;
