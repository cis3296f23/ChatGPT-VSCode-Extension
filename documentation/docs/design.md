---
sidebar_position: 6
---

# System Architecture

## Extension Architecture
:::tip Microsoft's Extension Anatomy Documentation
Go check out Microsoft's [extension anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy) documentation for details on the basic structure and definitions of VSCode Extension written in TypeScript.
:::

```mermaid
classDiagram
class activate ~Function~{
const vscode.WorkspaceConfiguration config = 'chatgpt'
const ChatGPTViewProvider provider = context.extensionUri
    commandHandler(command:string)
}

class AuthInfo ~type~{
    string? apiKey 
}
class Settings ~type~{
 boolean? selectedInsideCodeblock
  boolean? codeblockWithLanguageId
   boolean? pasteOnClick
   boolean? keepConversation
   number? timeoutLength
   string? model
   string? apiUrl
}
class `src/extension.ts` {
const BASE_URL = 'https://api.openai.com/v1'
activate(context: vscode.ExtensionContext)
deactivate()
}
class vscode
class chatgpt
`src/extension.ts` --> activate 
class ChatGPTViewProvider {
+ChatGPTViewProviderViewType viewType$
    - vscode.WebviewView? _view
	- ChatGPTAPI? _chatGPTAPI
	- any? _conversation
	- string? _response
	- string? _prompt
	- string? _fullPrompt
	-_currentMessageNumber = 0
	- Settings _settings
	- AuthInfo _authInfo
	constructor(private readonly _extensionUri: vscode.Uri) 
	+setAuthenticationInfo(authInfo: AuthInfo)
	+setSettings(settings: Settings)
	+getSettings()
	-_newAPI()
	-resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) 
	+ async resetConversation() Promise<void>
	+ async search(prompt?:string) Promise<void>
	- _getHtmlForWebview(webview: vscode.Webview) string
}
ChatGPTViewProvider --|> `vscode.WebviewViewProvider`
ChatGPTViewProvider ..> chatgpt
ChatGPTViewProvider --> Settings
ChatGPTViewProvider --> AuthInfo
`vscode.WebviewViewProvider` --> vscode
activate ..> ChatGPTViewProvider
```
**Figure 1. VSCode Extension UML class diagram**
Representing the current structure of the VSCode extension is a bit messy and difficult. However, it is worth it to highlight that extension.ts `activate()` registers the view provider `ChatGPTViewProvider`. The provider makes all of the calls to the ChatGPT library from the `search()` function which also updates the `webview`.
