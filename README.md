# tofile README

This is the README for your extension "tofile". After writing up a brief description, we recommend including the following sections.
> This Plugin for script that generate Fragments markdown file content with file location
> This Plugin do thing is goto file location with current cursor

## Features



\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.
  - generate Fragments markdown file is `src/script/fragment.ts` dependencies `ripgrep` 

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues
  - **Can't use literal Regex**
    - Error example
    ```ts
    /*\ ## only match space
    |*|  '  \n'.match(/^\x20*/
    \*/
    ```
    - fix way
    - Error example
    ```ts
    /*\ ## only match space
    |*|  ```ts
    |*|  '  \n'.match(new RegExp(String.raw`^\x20*`))
    |*|  ```
    \*/
    ```


### For more information
- Have Fun R:
  - [Insert a space after the line comment token and inside the block comments tokens](https://github.com/microsoft/vscode/blob/e5b6f39005e6029d6655e89313c8118bfda0913f/src/vs/editor/common/config/editorOptions.ts#L1136)
  - [vscode-box-comment](https://github.com/mattkenefick/vscode-box-comment)
  - [better-comments](https://github.com/aaron-bond/better-comments)
  - [comment-vscode](https://github.com/pouyakary/comment-vscode)


**Enjoy!**
