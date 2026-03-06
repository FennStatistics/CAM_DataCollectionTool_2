import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
    const isJatos = mode === "jatos";

    return {
        base: "./",
        plugins: [
            {
                name: "inject-jatos-script",
                transformIndexHtml(html) {
                    if (!isJatos) {
                        return html;
                    }
                    return html.replace(
                        "</head>",
                        "  <script src=\"jatos.js\"></script>\n  </head>"
                    );
                },
            },
        ],
    };
});
