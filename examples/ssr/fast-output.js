export const fastOutput = [
    `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SSR Example</title>
        <style>
            :not(:defined)>template[shadowroot]~* {
                display: none;
            }
        </style>
        <style>
            :root {

                --font-family: Segoe UI, Arial, sans-serif;
                --neutral-foreground: #2B2B2B;

            }
        </style>

    <body>
`,
`       <todo-app>
            <template shadowroot="open">
                <style>
                    :host {
                        display: block;
                        padding: 16px;
                        max-width: 320px;
                        font-family: var(--font-family);
                        color: var(--neutral-foreground);
                    }

                    h2 {
                        display: flex;
                    }

                    .todo-list {
                        list-style-type: none;
                        padding: 0;
                    }

                    .todo {
                        margin: 8px 0px;
                        display: flex;
                    }

                    .description {
                        display: inline-block;
                        align-self: center;
                        margin: 0px 8px;
                        flex: 1;
                    }

                    .description.done {
                        text-decoration: line-through;
                    }
                </style>

                <h1>FAST Todos</h1>
`,
`
                <todo-form>
                    <template shadowroot="open">
                        <style>
                            form {
                                display: flex;
                                align-items: center;
                            }

                            button {
                                margin: 4px;
                            }
                        </style>

                        <form>
                            <input type="text" />
                            <button type="submit" disabled>
                                Add Todo
                            </button>
                        </form>

                    </template>
                </todo-form>
`,
`
                <section>
                    <label for="filter">Filter:</label>
                    <select name="filter" title="filter">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </section>

                <ul class="todo-list">


                    <li class="todo">
                        <input type="checkbox" />
                        <span class="description done">

                            pick up groceries

                        </span>
                        <button aria-label="Remove item">
                            &times;
                        </button>
                    </li>


                    <li class="todo">
                        <input type="checkbox" />
                        <span class="description done">

                            schedule baby-sitter

                        </span>
                        <button aria-label="Remove item">
                            &times;
                        </button>
                    </li>


                    <li class="todo">
                        <input type="checkbox" />
                        <span class="description ">

                            schedule vet appointment

                        </span>
                        <button aria-label="Remove item">
                            &times;
                        </button>
                    </li>


                    <li class="todo">
                        <input type="checkbox" />
                        <span class="description done">

                            David Item 0

                        </span>
                        <button aria-label="Remove item">
                            &times;
                        </button>
                    </li>


                    <li class="todo">
                        <input type="checkbox" />
                        <span class="description ">

                            David Item 1

                        </span>
                        <button aria-label="Remove item">
                            &times;
                        </button>
                    </li>


                </ul>

            </template>
        </todo-app>
`,
`       <script>if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
                (function attachShadowRoots(root) {
                    root.querySelectorAll("template[shadowroot]").forEach(template => {
                        const mode = template.getAttribute("shadowroot");
                        const shadowRoot = template.parentNode.attachShadow({ mode });
                        shadowRoot.appendChild(template.content);
                        template.remove();
                        attachShadowRoots(shadowRoot);
                    });
                })(document);
            }</script>
        <!--
                    Use caution in production environments embedding JSON.
                    In general the JSON should be sanitized to prevent
                    JSON injection attacks.
                -->
        <script>window.__SSR_STATE__ =
                [{ "description": "pick up groceries", "done": true }, { "description": "schedule baby-sitter", "done": true }, { "description": "schedule vet appointment", "done": false }, { "description": "David Item 0", "done": true }, { "description": "David Item 1", "done": false }]
                ;
        </script>
        <script src="/bundle.js" defer></script>
    </body>

    </html>
`];
