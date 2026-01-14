/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@mcp_router/tailwind-config")],
  content: [
    "../electron/src/renderer/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
