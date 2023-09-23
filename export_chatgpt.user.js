// ==UserScript==
// @name         OpenAI Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Export OpenAI chat to Obsidian or Clipboard in Markdown format
// @author       chr1sdr01d
// @match        https://chat.openai.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Function to export chat
    function exportChat(exportType) {
        let chatMessages = document.querySelectorAll('.markdown.prose');
        let allChatContent = [];

        chatMessages.forEach(message => {
            allChatContent.push(message.innerText);
        });

        const markdownText = allChatContent.join('\n\n');

        if (exportType === 'clipboard') {
            GM_setClipboard(markdownText);
            alert('Chat content copied to clipboard in Markdown format!');
        } else if (exportType === 'obsidian') {
            const obsidianURL = `obsidian://new?vault=[VAULTNAME]&content=${encodeURIComponent(markdownText)}`;
            const link = document.createElement('a');
            link.href = obsidianURL;
            link.download = `ChatGPTExport.md`;
            link.click();
        }
    }

    // Function to create dropdown button
    function createDropdownButton() {
        const exportButton = document.createElement('button');
        exportButton.innerHTML = '&#9660; Export';
        exportButton.style.position = 'fixed';
        exportButton.style.bottom = '20px';
        exportButton.style.right = '20px';
        exportButton.style.padding = '10px';
        exportButton.style.backgroundColor = 'rgb(25, 195, 125)';
        exportButton.style.color = '#fff';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '50%';
        exportButton.style.cursor = 'pointer';
        exportButton.style.fontSize = '18px';
        exportButton.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        exportButton.style.zIndex = '9999';
        document.body.appendChild(exportButton);

        const clipboardOption = document.createElement('div');
        clipboardOption.className = 'export-option';
        clipboardOption.textContent = 'Copy to Clipboard 📋';
        clipboardOption.style.padding = '5px 10px';
        clipboardOption.style.cursor = 'pointer';
        clipboardOption.onclick = function() {
            exportChat('clipboard');
        };

        const obsidianOption = document.createElement('div');
        obsidianOption.className = 'export-option';
        obsidianOption.textContent = 'Export to Obsidian 📝';
        obsidianOption.style.padding = '5px 10px';
        obsidianOption.style.cursor = 'pointer';
        obsidianOption.onclick = function() {
            exportChat('obsidian');
        };

        const dropdownContent = document.createElement('div');
        dropdownContent.style.position = 'fixed';
        dropdownContent.style.bottom = '90px';
        dropdownContent.style.right = '30px';
        dropdownContent.style.backgroundColor = '#fff';
        dropdownContent.style.border = '1px solid #ccc';
        dropdownContent.style.borderRadius = '4px';
        dropdownContent.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        dropdownContent.style.display = 'none';
        dropdownContent.style.flexDirection = 'column';
        dropdownContent.style.alignItems = 'flex-start';
        dropdownContent.style.padding = '10px';
        dropdownContent.style.zIndex = '9999';

        clipboardOption.addEventListener('mouseover', function() {
            clipboardOption.style.backgroundColor = 'rgb(25, 195, 125)';
        });

        clipboardOption.addEventListener('mouseout', function() {
            clipboardOption.style.backgroundColor = '';
        });

        obsidianOption.addEventListener('mouseover', function() {
            obsidianOption.style.backgroundColor = 'rgb(25, 195, 125)';
        });

        obsidianOption.addEventListener('mouseout', function() {
            obsidianOption.style.backgroundColor = '';
        });

        exportButton.addEventListener('click', function() {
            if (dropdownContent.style.display === 'none') {
                dropdownContent.style.display = 'block';
            } else {
                dropdownContent.style.display = 'none';
            }
        });

        dropdownContent.appendChild(clipboardOption);
        dropdownContent.appendChild(obsidianOption);
        document.body.appendChild(dropdownContent);
    }

    // Initialize
    createDropdownButton();

})();
