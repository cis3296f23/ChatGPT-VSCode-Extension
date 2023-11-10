"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
//const vscode = __importStar(require("vscode"));
const vscode = import('vscode');
const chatgpt_1 = import('chatgpt');

const BASE_URL = 'https://api.openai.com/v1';
function activate(context) {
    console.log('activating extension "chatgpt"');
    // Get the settings from the extension's configuration
    const config = vscode.workspace.getConfiguration('chatgpt');
    // Create a new ChatGPTViewProvider instance and register it with the extension's context
    const provider = new ChatGPTViewProvider(context.extensionUri);
    // Put configuration settings into the provider
    provider.setAuthenticationInfo({
        apiKey: config.get('apiKey')
    });
    provider.setSettings({
        selectedInsideCodeblock: config.get('selectedInsideCodeblock') || false,
        codeblockWithLanguageId: config.get('codeblockWithLanguageId') || false,
        pasteOnClick: config.get('pasteOnClick') || false,
        keepConversation: config.get('keepConversation') || false,
        timeoutLength: config.get('timeoutLength') || 60,
        apiUrl: config.get('apiUrl') || BASE_URL,
        model: config.get('model') || 'gpt-3.5-turbo'
    });
    // Register the provider with the extension's context
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ChatGPTViewProvider.viewType, provider, {
        webviewOptions: { retainContextWhenHidden: true }
    }));
    const commandHandler = (command) => {
        const config = vscode.workspace.getConfiguration('chatgpt');
        const prompt = config.get(command);
        provider.search(prompt);
    };
    // Register the commands that can be called from the extension's package.json
    context.subscriptions.push(vscode.commands.registerCommand('chatgpt.ask', () => vscode.window.showInputBox({ prompt: 'What do you want to do?' })
        .then((value) => provider.search(value))), vscode.commands.registerCommand('chatgpt.explain', () => commandHandler('promptPrefix.explain')), vscode.commands.registerCommand('chatgpt.refactor', () => commandHandler('promptPrefix.refactor')), vscode.commands.registerCommand('chatgpt.review', () => commandHandler('promptPrefix.review')), vscode.commands.registerCommand('chatgpt.optimize', () => commandHandler('promptPrefix.optimize')), vscode.commands.registerCommand('chatgpt.findProblems', () => commandHandler('promptPrefix.findProblems')), vscode.commands.registerCommand('chatgpt.documentation', () => commandHandler('promptPrefix.documentation')), vscode.commands.registerCommand('chatgpt.resetConversation', () => provider.resetConversation()));
    // Change the extension's session token or settings when configuration is changed
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('chatgpt.apiKey')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setAuthenticationInfo({ apiKey: config.get('apiKey') });
        }
        else if (event.affectsConfiguration('chatgpt.apiUrl')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            let url = config.get('apiUrl') || BASE_URL;
            provider.setSettings({ apiUrl: url });
        }
        else if (event.affectsConfiguration('chatgpt.model')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setSettings({ model: config.get('model') || 'gpt-3.5-turbo' });
        }
        else if (event.affectsConfiguration('chatgpt.selectedInsideCodeblock')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setSettings({ selectedInsideCodeblock: config.get('selectedInsideCodeblock') || false });
        }
        else if (event.affectsConfiguration('chatgpt.codeblockWithLanguageId')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setSettings({ codeblockWithLanguageId: config.get('codeblockWithLanguageId') || false });
        }
        else if (event.affectsConfiguration('chatgpt.pasteOnClick')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setSettings({ pasteOnClick: config.get('pasteOnClick') || false });
        }
        else if (event.affectsConfiguration('chatgpt.keepConversation')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setSettings({ keepConversation: config.get('keepConversation') || false });
        }
        else if (event.affectsConfiguration('chatgpt.timeoutLength')) {
            const config = vscode.workspace.getConfiguration('chatgpt');
            provider.setSettings({ timeoutLength: config.get('timeoutLength') || 60 });
        }
    });
}
exports.activate = activate;
class ChatGPTViewProvider {
    // In the constructor, we store the URI of the extension
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this._currentMessageNumber = 0;
        this._settings = {
            selectedInsideCodeblock: false,
            codeblockWithLanguageId: false,
            pasteOnClick: true,
            keepConversation: true,
            timeoutLength: 60,
            apiUrl: BASE_URL,
            model: 'gpt-3.5-turbo'
        };
    }
    // Set the API key and create a new API instance based on this key
    setAuthenticationInfo(authInfo) {
        this._authInfo = authInfo;
        this._newAPI();
    }
    setSettings(settings) {
        let changeModel = false;
        if (settings.apiUrl || settings.model) {
            changeModel = true;
        }
        this._settings = { ...this._settings, ...settings };
        if (changeModel) {
            this._newAPI();
        }
    }
    getSettings() {
        return this._settings;
    }
    // This private method initializes a new ChatGPTAPI instance
    _newAPI() {
        console.log("New API");
        if (!this._authInfo || !this._settings?.apiUrl) {
            console.warn("API key or API URL not set, please go to extension settings (read README.md for more info)");
        }
        else {
            this._chatGPTAPI = new chatgpt_1.ChatGPTAPI({
                apiKey: this._authInfo.apiKey || "xx",
                apiBaseUrl: this._settings.apiUrl,
                completionParams: { model: this._settings.model || "gpt-3.5-turbo" },
            });
            // console.log( this._chatGPTAPI );
        }
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        // set options for the webview, allow scripts
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        // set the HTML for the webview
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        // add an event listener for messages received by the webview
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'codeSelected':
                    {
                        // do nothing if the pasteOnClick option is disabled
                        if (!this._settings.pasteOnClick) {
                            break;
                        }
                        let code = data.value;
                        const snippet = new vscode.SnippetString();
                        snippet.appendText(code);
                        // insert the code as a snippet into the active text editor
                        vscode.window.activeTextEditor?.insertSnippet(snippet);
                        break;
                    }
                case 'prompt':
                    {
                        this.search(data.value);
                    }
            }
        });
    }
    async resetConversation() {
        console.log(this, this._conversation);
        if (this._conversation) {
            this._conversation = null;
        }
        this._prompt = '';
        this._response = '';
        this._fullPrompt = '';
        this._view?.webview.postMessage({ type: 'setPrompt', value: '' });
        this._view?.webview.postMessage({ type: 'addResponse', value: '' });
    }
    async search(prompt) {
        this._prompt = prompt;
        if (!prompt) {
            prompt = '';
        }
        // Check if the ChatGPTAPI instance is defined
        if (!this._chatGPTAPI) {
            this._newAPI();
        }
        // focus gpt activity from activity bar
        if (!this._view) {
            await vscode.commands.executeCommand('chatgpt.chatView.focus');
        }
        else {
            this._view?.show?.(true);
        }
        let response = '';
        this._response = '';
        // Get the selected text of the active editor
        const selection = vscode.window.activeTextEditor?.selection;
        const selectedText = vscode.window.activeTextEditor?.document.getText(selection);
        // Get the language id of the selected text of the active editor
        // If a user does not want to append this information to their prompt, leave it as an empty string
        const languageId = (this._settings.codeblockWithLanguageId ? vscode.window.activeTextEditor?.document?.languageId : undefined) || "";
        let searchPrompt;
        if (selection && selectedText) {
            // If there is a selection, add the prompt and the selected text to the search prompt
            if (this._settings.selectedInsideCodeblock) {
                searchPrompt = `${prompt}\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
            }
            else {
                searchPrompt = `${prompt}\n${selectedText}\n`;
            }
        }
        else {
            // Otherwise, just use the prompt if user typed it
            searchPrompt = prompt;
        }
        this._fullPrompt = searchPrompt;
        // Increment the message number
        this._currentMessageNumber++;
        let currentMessageNumber = this._currentMessageNumber;
        if (!this._chatGPTAPI) {
            response = '[ERROR] "API key not set or wrong, please go to extension settings to set it (read README.md for more info)"';
        }
        else {
            // If successfully signed in
            console.log("sendMessage");
            // Make sure the prompt is shown
            this._view?.webview.postMessage({ type: 'setPrompt', value: this._prompt });
            this._view?.webview.postMessage({ type: 'addResponse', value: '...' });
            const agent = this._chatGPTAPI;
            try {
                // Send the search prompt to the ChatGPTAPI instance and store the response
                const res = await agent.sendMessage(searchPrompt, {
                    onProgress: (partialResponse) => {
                        // If the message number has changed, don't show the partial response
                        if (this._currentMessageNumber !== currentMessageNumber) {
                            return;
                        }
                        console.log("onProgress");
                        if (this._view && this._view.visible) {
                            response = partialResponse.text;
                            this._response = response;
                            this._view.webview.postMessage({ type: 'addResponse', value: response });
                        }
                    },
                    timeoutMs: (this._settings.timeoutLength || 60) * 1000,
                    ...this._conversation
                });
                if (this._currentMessageNumber !== currentMessageNumber) {
                    return;
                }
                console.log(res);
                response = res.text;
                if (res.detail?.usage?.total_tokens) {
                    response += `\n\n---\n*<sub>Tokens used: ${res.detail.usage.total_tokens} (${res.detail.usage.prompt_tokens}+${res.detail.usage.completion_tokens})</sub>*`;
                }
                if (this._settings.keepConversation) {
                    this._conversation = {
                        parentMessageId: res.id
                    };
                }
            }
            catch (e) {
                console.error(e);
                if (this._currentMessageNumber === currentMessageNumber) {
                    response = this._response;
                    response += `\n\n---\n[ERROR] ${e}`;
                }
            }
        }
        if (this._currentMessageNumber !== currentMessageNumber) {
            return;
        }
        // Saves the response
        this._response = response;
        // Show the view and send a message to the webview with the response
        if (this._view) {
            this._view.show?.(true);
            this._view.webview.postMessage({ type: 'addResponse', value: response });
        }
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'assets', 'index.js'));
        const microlightUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'scripts', 'microlight.min.js'));
        const tailwindUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'scripts', 'showdown.min.js'));
        const showdownUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'scripts', 'tailwind.min.js'));
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8"> 
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<script src="${tailwindUri}"></script>
				<script src="${showdownUri}"></script>
				<script src="${microlightUri}"></script>
				<style>
				.code {
					white-space: pre;
				}
				p {
					padding-top: 0.3rem;
					padding-bottom: 0.3rem;
				}
				/* overrides vscodes style reset, displays as if inside web browser */
				ul, ol {
					list-style: initial !important;
					margin-left: 10px !important;
				}
				h1, h2, h3, h4, h5, h6 {
					font-weight: bold !important;
				}
				</style>
				<title>Code Review Bot</title>
			</head>
			<body>
				<div id="root"></div>
				<script type="module" nonce="${nonce}" crossorigin src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
ChatGPTViewProvider.viewType = 'chatgpt.chatView';
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map