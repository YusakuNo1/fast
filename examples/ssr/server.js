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

import { fastOutput } from "./fast-output.js";
import { fastOutputNoTemplate } from "./fast-output-no-template.js";

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

async function outputStreamingResults(res, strings) {
    for await (const str of strings) {
        res.write(str);
        await new Promise(resolve => setTimeout(resolve, 1000));
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
    } else if (experimentName === 'fast-output') {
        await outputStreamingResults(res, fastOutput);
    } else if (experimentName === 'fast-output-no-template') {
        await outputStreamingResults(res, fastOutputNoTemplate);
    } else {
        await streaming(req, res);
    }
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
