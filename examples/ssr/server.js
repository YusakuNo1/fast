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

async function streamingSimple(req, res) {
    const arr = [];
    for (let i = 0; i < 20; ++i) {
        arr.push(i);
    }

    res.write('<html><body><div>');
    res.write('Search: <input type="text" id="search-input" name="search-input" placeholder="Bing Search Query"><br>');

    let counter = 0;
    for (let i = 0; i < arr.length; ++i) {
        const part = arr[i];
        const content = `<div>In Div${counter++}</div><br />`;
        res.write(content);
        console.log('part', part);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.write('</div></body></html>');

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

    for (const part of stream) {
        const content = await part;
        res.write(content);
        await new Promise(resolve => setImmediate(resolve));
    }

    res.end();
    DesignToken.unregisterDefaultStyleTarget(styleTarget);
}

app.get("/", async (req, res) => {
    if (experimentName === 'simple') {
        await streamingSimple(req, res);
    } else {
        await streaming(req, res);
    }
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
