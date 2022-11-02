import "../install-dom-shim.js";
import { FASTElement, customElement, css, html, attr, observable, when } from "@microsoft/fast-element";
import { expect, test } from '@playwright/test';
import { SyncFASTElementRenderer } from "./fast-element-renderer.js";
import fastSSR from "../exports.js";
import { consolidate, consolidateAsync } from "../test-utilities/consolidate.js";
import { uniqueElementName } from "@microsoft/fast-element/testing";
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task";

@customElement({
    name: "bare-element",
})
export class BareElement extends FASTElement {
    attrBoolean = true;
    attrString = "mock-string";
    attrObject = { key: "mock-value" };
}

// @customElement({
//     name: "styled-element",
//     styles: css`:host { display: block; }${css`:host { color: red; }`}
//     `
// })
// export class StyledElement extends FASTElement {}

// @customElement({
//     name: "host-binding-element",
//     template: html`
//         <template attr="attr" ?bool-attr="${() => true}"></template>
//     `
// })
// export class HostBindingElement extends FASTElement {}


test.describe("SyncFASTElementRenderer", () => {
    test("should render custome elements with valid attributes",  () => {
        // class MyElement extends FASTElement {}
        // expect(SyncFASTElementRenderer.matchesClass(MyElement, "", new Map())).toBe(true);
    });
});
