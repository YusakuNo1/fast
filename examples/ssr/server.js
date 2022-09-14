/* eslint-disable no-undef */
import "@microsoft/fast-ssr/install-dom-shim";
import fs from "fs";
import { html } from "@microsoft/fast-element";
import fastSSR, {
    DeclarativeShadowDOMPolyfill,
    RequestStorageManager,
} from "@microsoft/fast-ssr";
import express from "express";
import { DefaultTodoList, app as todoApp, TodoList } from "fast-todo-app";
import {
    DesignToken,
    DesignTokenEventResolutionStrategy,
    DesignTokenStyleTarget,
} from "@microsoft/fast-foundation";

const experimentName = process.argv[2];

const app = express();
const port = 8080;
const { templateRenderer } = fastSSR({ renderMode: 'async' });

todoApp.define();
DesignToken.withStrategy(DesignTokenEventResolutionStrategy);

app.use(RequestStorageManager.middleware());
app.use(express.static("./www"));

const template = html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR Example</title>
            <style>${DeclarativeShadowDOMPolyfill.undefinedElementStyles}</style>
            <style>
                :root {
                    ${x => x.designTokenDefaultStyles}
                }
            </style>
        <body>
            <todo-app></todo-app>
            <script>${DeclarativeShadowDOMPolyfill.nonStreamingTemplateUpgrade}</script>
            <!--
                Use caution in production environments embedding JSON.
                In general the JSON should be sanitized to prevent
                JSON injection attacks.
            -->
            <script>window.__SSR_STATE__ = ${() =>
                JSON.stringify(TodoList.get(document).all)};
            </script>
            <script src="/bundle.js" defer></script>
        </body>
    </html>
`;

const simpleOutput = [
    '<html><body><div>',
    'Search: <input type="text" id="search-input" name="search-input" placeholder="Bing Search Query"><br>',
    '<div>In Div 0</div><br />',
    '<div>In Div 1</div><br />',
    '<div>In Div 2</div><br />',
    '<div>In Div 3</div><br />',
    '<div>In Div 4</div><br />',
    '<div>In Div 5</div><br />',
    '<div>In Div 6</div><br />',
    '<div>In Div 7</div><br />',
    '<div>In Div 8</div><br />',
    '<div>In Div 9</div><br />',
    '</div></body></html>',
];

const simulateFastOutput = [
    "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\" />\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n            <title>SSR Example</title>\n            <style>:not(:defined) > template[shadowroot] ~ *  {\n    display: none;\n}</style>\n            <style>\n                :root {\n                    ",
    "--font-family: Segoe UI, Arial, sans-serif;--neutral-foreground: #2B2B2B;",
    "\n                }\n            ",
    "</style>\n        <body>\n            <todo-app",
    "",
    ">",
    "<template shadowroot=\"open\">",
    "<style>\n    :host {\n        display: block;\n        padding: 16px;\n        max-width: 320px;\n        font-family: var(--font-family);\n        color: var(--neutral-foreground);\n    }\n\n    h2 {\n        display: flex;\n    }\n\n    .todo-list {\n        list-style-type: none;\n        padding: 0;\n    }\n\n    .todo {\n        margin: 8px 0px;\n        display: flex;\n    }\n\n    .description {\n        display: inline-block;\n        align-self: center;\n        margin: 0px 8px;\n        flex: 1;\n    }\n\n    .description.done {\n        text-decoration: line-through;\n    }\n</style>",
    "\n    <h1>FAST Todos</h1>\n\n    <todo-form",
    ">",
    "<template shadowroot=\"open\">",
    "<style>\n    form {\n        display: flex;\n        align-items: center;\n    }\n\n    button {\n        margin: 4px;\n    }\n</style>",
    "\n    <form ",
    ">\n        <input type=\"text\" ",
    " />\n        <button type=\"submit\" ",
    "disabled",
    ">\n            Add Todo\n        </button>\n    </form>\n",
    "</template>",
    "</todo-form>\n\n    <section>\n        <label for=\"filter\">Filter:</label>\n        <select name=\"filter\" title=\"filter\" ",
    ">\n            <option value=\"all\">All</option>\n            <option value=\"active\">Active</option>\n            <option value=\"completed\">Completed</option>\n        </select>\n    </section>\n\n    <ul class=\"todo-list\">\n        ",
    "\n                <li class=\"todo\">\n                    <input type=\"checkbox\" ",
    " />\n                    <span ",
    "class=\"description done\"",
    ">\n                        ",
    "pick up groceries",
    "\n                    </span>\n                    <button\n                        ",
    "\n                        aria-label=\"Remove item\"\n                    >\n                        &times;\n                    </button>\n                </li>\n            ",
    "\n                <li class=\"todo\">\n                    <input type=\"checkbox\" ",
    " />\n                    <span ",
    "class=\"description done\"",
    ">\n                        ",
    "schedule baby-sitter",
    "\n                    </span>\n                    <button\n                        ",
    "\n                        aria-label=\"Remove item\"\n                    >\n                        &times;\n                    </button>\n                </li>\n            ",
    "\n                <li class=\"todo\">\n                    <input type=\"checkbox\" ",
    " />\n                    <span ",
    "class=\"description \"",
    ">\n                        ",
    "schedule vet appointment",
    "\n                    </span>\n                    <button\n                        ",
    "\n                        aria-label=\"Remove item\"\n                    >\n                        &times;\n                    </button>\n                </li>\n            ",
    "\n                <li class=\"todo\">\n                    <input type=\"checkbox\" ",
    " />\n                    <span ",
    "class=\"description done\"",
    ">\n                        ",
    "David Item 0",
    "\n                    </span>\n                    <button\n                        ",
    "\n                        aria-label=\"Remove item\"\n                    >\n                        &times;\n                    </button>\n                </li>\n            ",
    "\n                <li class=\"todo\">\n                    <input type=\"checkbox\" ",
    " />\n                    <span ",
    "class=\"description \"",
    ">\n                        ",
    "David Item 1",
    "\n                    </span>\n                    <button\n                        ",
    "\n                        aria-label=\"Remove item\"\n                    >\n                        &times;\n                    </button>\n                </li>\n            ",
    "\n    </ul>\n",
    "</template>",
    "</todo-app>\n            <script>if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {\n    (function attachShadowRoots(root) {\n        root.querySelectorAll(\"template[shadowroot]\").forEach(template => {\n            const mode = template.getAttribute(\"shadowroot\");\n            const shadowRoot = template.parentNode.attachShadow({ mode });\n            shadowRoot.appendChild(template.content);\n            template.remove();\n            attachShadowRoots(shadowRoot);\n        });\n    })(document);\n}</script>\n            <!--\n                Use caution in production environments embedding JSON.\n                In general the JSON should be sanitized to prevent\n                JSON injection attacks.\n            -->\n            <script>window.__SSR_STATE__ = ",
    "[{\"description\":\"pick up groceries\",\"done\":true},{\"description\":\"schedule baby-sitter\",\"done\":true},{\"description\":\"schedule vet appointment\",\"done\":false},{\"description\":\"David Item 0\",\"done\":true},{\"description\":\"David Item 1\",\"done\":false}]",
    ";\n            </script>\n            <script src=\"/bundle.js\" defer></script>\n        </body>\n    </html>\n",
];

async function outputStreamingResults(res, strings) {
    for await (const str of strings) {
        res.write(str);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    res.end();
}

async function streaming(req, res) {
    const todoData = JSON.parse(fs.readFileSync("./todo-data.json").toString());
    TodoList.provide(document, new DefaultTodoList(todoData));

    const styleTarget = new DesignTokenStyleTarget();
    DesignToken.registerDefaultStyleTarget(styleTarget);

    const stream = templateRenderer.render(
        template,
        templateRenderer.createRenderInfo(),
        { designTokenDefaultStyles: styleTarget.cssText }
    );

    for await (const part of stream) {
        res.write(part);
        await new Promise(resolve => setImmediate(resolve));
    }

    res.end();
    DesignToken.unregisterDefaultStyleTarget(styleTarget);
}

app.get("/", async (req, res) => {
    if (experimentName === 'simple') {
        await outputStreamingResults(res, simpleOutput);
    } else if (experimentName === 'simulate-fast') {
        await outputStreamingResults(res, simulateFastOutput);
    } else {
        await streaming(req, res);
    }
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
