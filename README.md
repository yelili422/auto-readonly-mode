# auto-readonly-mode

Automatically enable read-only mode when the current file is located outside the workspace.

## Help

This extension is useful when you wish to avoid modifying any files that
beyond the current workspace.
For files within the current workspace, use this configuration:
`"files.readonlyInclude": {}`.

### How to disable auto-readonly-mode for some files?

Edit `settings.json`:

```json
"files.readonlyExclude": {
    "**/settings.json": true // the files you want to exclude
}
```

### How to disable readonly mode on this file?

Press `command-shift-p` or `ctrl-shift-p` and run this command:
File: Reset Active Editor Read-only in Session (`workbench.action.files.resetActiveEditorReadonlyInSession`)
