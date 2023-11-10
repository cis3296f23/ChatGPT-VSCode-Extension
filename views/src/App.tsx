import { useEffect } from 'react';
import showdown from 'showdown';
import microlight from 'microlight';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './App.css'
import {TextField} from "@mui/material";

type WebviewEvent = {
    data: {
        type: string;
        value: string;
    };
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
function App() {
    const vscode = (window as any).acquireVsCodeApi();

    let response = '';

    useEffect(() => {
        function handleMessage(event: WebviewEvent) {
            const message = event.data;
            switch (message.type) {
                case 'addResponse':
                    response = message.value;
                    setResponse();
                    break;
                case 'clearResponse':
                    response = '';
                    break;
                case 'setPrompt':
                    (document.getElementById('prompt-input') as HTMLInputElement).value = message.value;
                    break;
            }
        }

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const fixCodeBlocks = (input: string) => {
        const REGEX_CODEBLOCK = new RegExp('```', 'g');
        const matches = input.match(REGEX_CODEBLOCK);
        const count = matches ? matches.length : 0;
        return count % 2 === 0 ? input : input.concat('\n```');
    };

    const setResponse = () => {
        const converter = new showdown.Converter({
            omitExtraWLInCodeBlocks: true,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true,
            literalMidWordUnderscores: true,
            simpleLineBreaks: true
        });
        response = fixCodeBlocks(response);
        let html = converter.makeHtml(response);
        const responseElement = document.getElementById('response');
        if (responseElement) {
            responseElement.innerHTML = html;

            const preCodeBlocks = responseElement.querySelectorAll('pre code');
            preCodeBlocks.forEach((block) => {
                block.classList.add('p-2', 'my-2', 'block', 'overflow-x-scroll');
            });

            const codeBlocks = responseElement.querySelectorAll('code');
            codeBlocks.forEach((codeBlock) => {
                if (codeBlock.innerText.startsWith('Copy code')) {
                    codeBlock.innerText = codeBlock.innerText.replace('Copy code', '');
                }

                codeBlock.classList.add('inline-flex', 'max-w-full', 'overflow-hidden', 'rounded-sm', 'cursor-pointer');

                codeBlock.addEventListener('click', (e) => {
                    e.preventDefault();
                    vscode.postMessage({
                        type: 'codeSelected',
                        value: codeBlock.innerText
                    });
                });

                const divElement = document.createElement('div');
                divElement.innerHTML = codeBlock.innerHTML;
                codeBlock.innerHTML = '';
                codeBlock.appendChild(divElement);
                divElement.classList.add('code');
            });

            microlight.reset('code');
        }
    };

    const handlePromptInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            vscode.postMessage({
                type: 'prompt',
                value: (e.target as HTMLInputElement).value
            });
        }
    };


    return (
        <ThemeProvider theme={darkTheme}>
            {/* This is just a placeholder. You can add more JSX code as per your actual component requirement */}
            <h1>Code Review Bot</h1>
            <div id="response"></div>
            <TextField id="prompt-input" label="Ask ChatGPT" onKeyUp={handlePromptInput} variant="outlined"/>
        </ThemeProvider>
  )
}

export default App
