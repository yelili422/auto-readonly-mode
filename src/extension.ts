import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "project-workspace-readonly" is now active!');

    let disposable = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            if (vscode.workspace.workspaceFolders === undefined
                || vscode.workspace.workspaceFolders.length === 0) {
                // No workspace is opened
                return;
            }

            const document = editor.document;
            const isInWorkspace = vscode.workspace.getWorkspaceFolder(document.uri) !== undefined;
            if (!isInWorkspace) {
                vscode.commands.executeCommand(
                    'workbench.action.files.setActiveEditorReadonlyInSession',
                );
            }
        }

    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
