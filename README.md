# HCiQuery

Welcome to HCiQuery! This is an open-source extension for the Visual Studio Code IDE that enhances your coding experience by integrating OpenAI's ChatGPT directly into your editor, allowing you to generate code or natural language responses through ChatGPT on a side panel while coding. The extension also logs & collects usage data, such as user prompts, GPT responses, and timestamps for future research that may provide valuable insights into human-computer interaction and how developers utilize large language models for their tasks. 

The HCiQuery plugin was developed using TypeScript, JavaScript, CSS, and HTML, and uses a Firebase database in order to store prompt/response data. It was created for [Temple University's HCI labs,](https://stevemacn.github.io/research/) which plans to explore, analyze, and visualize the data collected for human-computer interaction research.

One can use ChatGPT in order to generate code from scratch, review or refactor existing code, ask questions, and more:
<br>
<img src="https://github.com/cis3296f23/project-03-ChatGPT-VSCode-Extension-Project/assets/27174032/c1538325-01e1-4a64-b5dd-10a58e28c7d1" style="width:50%;" alt="One can use ChatGPT in order to generate code from scratch, review or refactor existing code, ask questions, and more."/>

An example of data that HCiQuery logs:
<br>
<img src="https://github.com/cis3296f23/project-03-ChatGPT-VSCode-Extension-Project/assets/27174032/14dbd49d-75e2-47b2-8743-170ac83b7d8e" style="width:50%;" alt="An example of data that HCiQuery logs."/>

## Features
- 💡 **Ask general questions** or use code snippets from the editor to query ChatGPT via an input box in the sidebar
- 🖱️ Right click on a code selection and run one of the context menu **shortcuts**
	- automatically write documentation for your code
	- explain the selected code
	- refactor or optimize it
	- find problems with it
- 💻 View ChatGPT's responses in a panel next to the editor
- 🚀 See the response as it is being generated **in real time**
- 💬 Ask **follow-up questions** to the response (conversation context is maintained)
- 📝 **Insert code snippets** from the AI's response into the active editor by clicking on them
[original](https://github.com/timkmecl/chatgpt-vscode)


## Setup

As this version of the extension is not available on the market place, it currently has to be built from source.

1. Clone the repository.
2. Open the repository in Visual Studio Code.
3. Delete the node_modules folder.
4. Run `npm install` in the project folder.
5. Run `yarn run compile` in the project folder.


After the installation is complete and the extension is running, you will need to add an [OpenAI API key](https://platform.openai.com/account/api-keys) to the extension.
1. In Visual Studio Code, go to `File` -> `Preferences` -> `Settings`.
2. In the search bar, type `ChatGPT`.
3. Open the settings and input your API Key.


### Settings

This extension offers a bit of flexibility through various configuration settings. One can choose between ChatGPT and GPT4 by altering the `Model` setting. It also supports inputting a custom API, in the `API URL` field.


## Using the Extension

To use the extension, open a text editor in Visual Studio Code and open the ChatGPT panel by clicking on the ChatGPT icon in the sidebar. This will open a panel with an input field where you can enter your prompt or question. By clicking enter, it will be sent to ChatGPT. Its response will be displayed below the input field in the sidebar (note that it may take some time for it to be calculated).

<img src="https://github.com/cis3296f23/project-03-ChatGPT-VSCode-Extension-Project/assets/27174032/c5e0e19a-f080-4276-9936-59acf4e90b21" style="width:50%;" alt="Writing new code using chatGPT"/>

You can also select a code snippet in the editor and then enter a prompt in the side panel, or right-click and select "Ask ChatGPT". The **selected code will be automatically appended** to your query when it is sent to the AI. This can be useful for generating code snippets or getting explanations for specific pieces of code.

<img src="https://github.com/cis3296f23/project-03-ChatGPT-VSCode-Extension-Project/assets/27174032/ed01b5c9-db80-4263-99e4-b05a77ec0c83" style="width:50%;" alt="Refactoring selected code using chatGPT"/>

To **insert a code snippet** from the AI's response into the editor, simply click on the code block in the panel. The code will be automatically inserted at the cursor position in the active editor.

<img src="https://github.com/cis3296f23/project-03-ChatGPT-VSCode-Extension-Project/assets/27174032/24d49b72-cd42-43df-a0f7-6e0b816a746f" style="width:50%;" alt="chatGPT explaining selected code"/>

You can select some code in the editor, right click on it and choose one of the following **shortcuts** from the context menu:
#### Commands:
- `Ask ChatGPT`: will provide a prompt for you to enter any query
- `ChatGPT: Explain selection`: will explain what the selected code does
- `ChatGPT: Refactor selection`: will try to refactor the selected code
- `ChatGPT: Find problems`: looks for problems/errors in the selected code, fixes and explains them
- `ChatGPT: Optimize selection`: tries to optimize the selected code

`Ask ChatGPT` is also available when nothing is selected. For the other four commands, you can **customize the exact prompt** that will be sent to the AI by editing the extension settings in VSCode Preferences.


Because ChatGPT is a conversational AI, you can ask follow-up questions to the response. The conversation context is maintained between queries, so you can ask multiple questions in a row (this can be disabled in the extension settings.). 
If you aren't satisfied with an answer and would like to **retry the request**, click `ctrl+shift+p` and select `Retry ChatGPT request`. To **reset the conversation context**, click `ctrl+shift+p` and select `ChatGPT: Reset Conversation`.

[original](https://github.com/timkmecl/chatgpt-vscode)

---

## Credits

- Timkmecl's open source ChatGPT VSCode extension, [located here.](https://github.com/timkmecl/chatgpt-vscode)
- Temple's HCI lab fork of the open source extension, [located here.](https://github.com/Civic-Interactions-Lab/code-review-chatbot-vscode)
- OpenAI's [ChatGPT](https://chat.openai.com/chat)
- The extension makes use of [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api) (by [Travis Fischer](https://github.com/transitive-bullshit)), which uses unofficial ChatGPT API in order to login and communicate with it.
- The project was started by [mpociot](https://github.com/mpociot/)
- `v0.3` inspired by [barnesoir/chatgpt-vscode-plugin](https://github.com/barnesoir/chatgpt-vscode-plugin) and [gencay/vscode-chatgpt](https://github.com/gencay/vscode-chatgpt)
- Thank you to Professor Stephen MacNeil, Professor Ian Applebaum, and Professor Tamer Aldwairi for guidance and support.
