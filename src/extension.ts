import * as vscode from 'vscode';
import { minimatch } from 'minimatch';

interface IGlobPatterns {
	[filepattern: string]: boolean;
}

const defaultReadonlyExclude: IGlobPatterns = {
    '**/settings.json': true,
    '**/tasks.json': true,
    '**/keybindings.json': true,
    '**/*.code-workspace': true,
};

export function activate(context: vscode.ExtensionContext) {
    console.log('[auto-readonly-mode] Extension "auto-readonly-mode" is now active!');

    const filesConfig = vscode.workspace.getConfiguration('files');
    const readonlyExclude = filesConfig.get<IGlobPatterns>('readonlyExclude') ?? {};

    const mergedReadonlyExclude = { ...defaultReadonlyExclude, ...readonlyExclude };

    let disposable = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            if (vscode.workspace.workspaceFolders === undefined
                || vscode.workspace.workspaceFolders.length === 0) {
                // No workspace is opened
                return;
            }

            if (editor.document.isUntitled) {
                return;
            }

            const currentFileUri = editor.document.uri;
            const currentFilePath = currentFileUri.fsPath;

            const isReadonlyExclude = Object.keys(mergedReadonlyExclude).some(pattern => {
                if (mergedReadonlyExclude[pattern]) {
                    const normalizedPattern = pattern.replace(/\\/g, '/');
                    const normalizedFilePath = currentFilePath.replace(/\\/g, '/');

                    return minimatch(normalizedFilePath, normalizedPattern);
                }
                return false;
            });
            if (isReadonlyExclude) {
                return;
            }

            const isInWorkspace = vscode.workspace.getWorkspaceFolder(currentFileUri) !== undefined;
            if (!isInWorkspace) {
                console.log("[auto-readonly-mode] Enabling read-only mode for file: " + currentFilePath);
                vscode.commands.executeCommand(
                    'workbench.action.files.setActiveEditorReadonlyInSession',
                );
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
