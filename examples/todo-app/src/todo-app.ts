import { FASTElement } from "@microsoft/fast-element";
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";
import { TodoList } from "./todo-list.js";

export class TodoApp extends FASTElement {
    @TodoList todos!: TodoList;

    connectedCallback(): void {
        super.connectedCallback();
        this.dispatchEvent(new PendingTaskEvent(this.todos.addItemsAsync()));
    }
}

// By using this API instead of the @customElement
// decorator, we are able to assemble the component
// with its name, template, and styles, but without
// immediately defining it with the platform. We do
// this so that we can control the startup timing of
// the app. See the main.ts file for further
// explanation.
export const app = TodoApp.compose({
    name: "todo-app",
    template,
    styles,
});
