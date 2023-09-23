 // ==UserScript==
// @name         Craigslist Housing Gallery Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       chr1sdr01d
// @match        https://vancouver.craigslist.org/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=craigslist.org
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_KEYWORDS = ['basement', 'upper', 'lower', 'garden'];

    function removeListings() {
        const elements = document.getElementsByClassName("cl-search-result cl-search-view-mode-gallery");
        const keywords = GM_getValue("keywords", DEFAULT_KEYWORDS);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const location = element.getElementsByClassName("meta")[0].childNodes[4].data;
            const title = document.getElementsByClassName("cl-search-result cl-search-view-mode-gallery")[i].title;
            for (let j = 0; j < keywords.length; j++) {
                if (location.toLowerCase().includes(keywords[j])) {
                    element.remove();
                    break;
                } else if (title.toLowerCase().includes(keywords[j])) {
                    element.remove();
                    break;
                }
            }
        }
    }

    function addKeyword(keyword) {
        const keywords = GM_getValue("keywords", DEFAULT_KEYWORDS);
        keywords.push(keyword);
        GM_setValue("keywords", keywords);
        refreshUI();
    }

    function removeKeyword(keyword) {
        const keywords = GM_getValue("keywords", DEFAULT_KEYWORDS);
        const index = keywords.indexOf(keyword);
        if (index !== -1) {
            keywords.splice(index, 1);
            GM_setValue("keywords", keywords);
            refreshUI();
        }
    }

    function refreshUI() {
    const keywords = GM_getValue("keywords", DEFAULT_KEYWORDS);
    const container = document.querySelector(".cl-middle-group");
    const ui = `
        <div>
            <b>Search Keywords:</b>
            <select id="keyword-select">
                <option value="">Select a keyword</option>
                ${keywords.map(keyword => `
                    <option value="${keyword}">${keyword}</option>
                `).join("")}
            </select>
            <button id="remove-keyword">Remove</button>
            <form>
                <label for="new-keyword">New Keyword:</label>
                <input type="text" name="new-keyword" id="new-keyword">
                <button type="submit" id="add-keyword">Add Keyword</button>
            </form>
        </div>
    `;
    container.innerHTML = ui;

    const form = container.querySelector("form");
    form.addEventListener("submit", event => {
        event.preventDefault();
        const input = form.querySelector("#new-keyword");
        const keyword = input.value.trim().toLowerCase();
        if (keyword !== "") {
            addKeyword(keyword);
            input.value = "";
        }
    });

    const select = container.querySelector("#keyword-select");
    const removeButton = container.querySelector("#remove-keyword");
    select.addEventListener("change", event => {
        const keyword = event.target.value;
        if (keyword !== "") {
            removeKeyword(keyword);
            select.value = "";
        }
    });
    removeButton.addEventListener("click", event => {
        const keyword = select.value;
        if (keyword !== "") {
            removeKeyword(keyword);
            select.value = "";
        }
    });
}


//    function refreshUI() {
//        const keywords = GM_getValue("keywords", DEFAULT_KEYWORDS);
//        const container = document.querySelector(".cl-middle-group");
//        const ui = `
//            <div>
//                <b>Search Keywords:</b>
//                <ul>
//                    ${keywords.map(keyword => `
//                        <li>
//                            <span>${keyword}</span>
//                            <button class="remove-keyword" data-keyword="${keyword}">Remove</button>
//                        </li>
//                    `).join("")}
//                </ul>
//                <form>
//                    <label for="new-keyword">New Keyword:</label>
//                    <input type="text" name="new-keyword" id="new-keyword">
//                    <button type="submit" id="add-keyword">Add Keyword</button>
//                </form>
//            </div>
//        `;
//        container.innerHTML = ui;
//
//        const form = container.querySelector("form");
//        form.addEventListener("submit", event => {
//            event.preventDefault();
//            const input = form.querySelector("#new-keyword");
//            const keyword = input.value.trim().toLowerCase();
//            if (keyword !== "") {
//                addKeyword(keyword);
//                input.value = "";
//            }
//        });
//
//        const buttons = container.querySelectorAll(".remove-keyword");
//        buttons.forEach(button => {
//            button.addEventListener("click", event => {
//                event.preventDefault();
//                const keyword = event.currentTarget.dataset.keyword;
//                removeKeyword(keyword);
//            });
//        });
//    }

    // Wait 3 seconds before running the script for the first time
    setTimeout(function() {
        refreshUI();
        removeListings();
        // Run the script every 1 seconds
        setInterval(removeListings, 1000);
    }, 3000);
})();