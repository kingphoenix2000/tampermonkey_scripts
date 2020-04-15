// ==UserScript==
// @name         GreasyFork网站助手
// @name:en      GreasyFork Website Assistant
// @name:zh-CN   GreasyFork网站助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @updateURL    https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/GreasyFork%E8%84%9A%E6%9C%AC%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.6
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  此脚本会在GreasyFork网站的脚本列表页面和用户脚本列表页面每个脚本的下面添加几个快捷操作的按钮。包括直接安装、临时删除、加入黑名单等等功能。在脚本列表顶部添加了一个根据关键字过滤脚本的功能。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:zh-CN  此脚本会在GreasyFork网站的脚本列表页面和用户脚本列表页面每个脚本的下面添加几个快捷操作的按钮。包括直接安装、临时删除、加入黑名单等等功能。在脚本列表顶部添加了一个根据关键字过滤脚本的功能。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:en  This script will add several shortcut buttons under each script on the script list page and user script list page of GreasyFork website. Including functions such as direct installation, temporary deletion, blacklisting, etc. Added a function to filter scripts based on keywords at the top of the script list.Author：浴火凤凰(QQ:307053741,QQ group:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://*greasyfork.org/*
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @note         2019-12-12 为脚本列表的每个脚本增加加入黑名单功能，加入黑名单的脚本会在页面加载完成以后被隐藏掉。可以单击显示全部脚本按钮来显示黑名单的脚本
// @note         2020-01-08 在用户主页用户名的后面增加当前用户开发的脚本安装总数
// @note         2020-04-07 修复某些脚本名称带有引号导致解析错误的问题
// @note         2020-04-10 脚本架构重写。支持中英文界面。
// @note         2020-04-15 增加 代码、历史版本、反馈、统计数据等快捷入口。增加宽窄屏幕切换功能。
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }

    function addSingleLink(container, text, href) {
        let span = document.createElement('span');
        let a = document.createElement('a');
        a.href = href;
        a.innerText = text;
        span.appendChild(a);
        container.appendChild(span);
    }

    let GUI_strs = {};
    let is_CN = location.href.includes("zh-");
    if (is_CN) {
        GUI_strs = {
            name: "GreasyFork网站助手",
            filter_input_placeholder: "请输入过滤关键字",
            showOnlyBtnValue: "过滤脚本",
            showAllBtnValue: "显示全部脚本",
            switchBtnValue1: "宽屏",
            switchBtnValue2: "窄屏",
            install: "安装脚本",
            remove: "删除脚本",
            addtoblacklist: "加入黑名单",
            removefromblacklist: "移除黑名单",
            authorotherscripts: "浴火凤凰的其它脚本",
            code: "代码",
            history: "历史版本",
            feedback: "反馈",
            stats: "统计数据",
        };
    }
    else {
        GUI_strs = {
            name: "GreasyFork Website Assistant",
            filter_input_placeholder: "Please enter filter keywords here...",
            showOnlyBtnValue: "Filter script",
            showAllBtnValue: "Show all scripts",
            switchBtnValue1: "Wide Screen",
            switchBtnValue2: "Normal Screen",
            install: "install",
            remove: "remove",
            addtoblacklist: "add to blacklist",
            removefromblacklist: "remove from blacklist",
            authorotherscripts: "Author's other scripts",
            code: "Code",
            history: "History",
            feedback: "Feedback",
            stats: "Stats",
        };
    }

    function addFilterSystem(selector) {
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.style.cssText = "margin: 10px;color: #A42121;";
        h2.innerText = GUI_strs.name;
        div.appendChild(h2);
        let input = document.createElement("input");
        input.id = "filter_input";
        input.type = "text";
        input.value = "";
        input.style.cssText = "margin: 10px;width: 300px;";
        input.placeholder = GUI_strs.filter_input_placeholder;
        div.appendChild(input);
        let showOnlyBtn = document.createElement("input");
        let items = document.querySelectorAll(selector + " > li");
        let len = items.length;
        showOnlyBtn.type = "button";
        showOnlyBtn.value = GUI_strs.showOnlyBtnValue;
        showOnlyBtn.style.marginLeft = "15px";
        showOnlyBtn.onclick = function () {
            let text = input.value.trim().toLowerCase();
            for (let i = 0; i < len; i++) {
                let text1 = items[i].innerText.trim().toLowerCase();
                if (!text1.includes(text)) {
                    items[i].style.display = "none";//隐藏掉不包含关键字的脚本 并且对隐藏掉的包含关键字的脚本不做处理。
                }
            }
        }
        let showAllBtn = document.createElement("input");
        showAllBtn.type = "button";
        showAllBtn.value = GUI_strs.showAllBtnValue;
        showAllBtn.style.marginLeft = "15px";
        showAllBtn.onclick = function () {
            for (let i = 0; i < len; i++) {
                items[i].style.display = "list-item";
            }
        }
        let screenSize = true;
        let content = document.querySelector("body > div.width-constraint");
        let switchBtn = document.createElement("input");
        switchBtn.type = "button";
        switchBtn.value = GUI_strs.switchBtnValue1;
        switchBtn.style.marginLeft = "15px";
        switchBtn.onclick = function () {
            if (screenSize) {
                content.style.maxWidth = "95%";
                switchBtn.value = GUI_strs.switchBtnValue2;
                screenSize = false;
            }
            else {
                content.style.maxWidth = "960px";
                switchBtn.value = GUI_strs.switchBtnValue1;
                screenSize = true;
            }
        }
        div.appendChild(showOnlyBtn);
        div.appendChild(showAllBtn);
        div.appendChild(switchBtn);
        document.querySelector(selector).insertBefore(div, document.querySelector(selector).firstChild);
    }


    function hideScriptsInBlacklist(selector) {
        let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
        let node_lis = document.querySelectorAll(selector + " > li");
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let li = node_lis[i];
            if (!li.querySelector("article > h2 > a")) { continue; }
            let scriptId = li.dataset.scriptId;
            if (scriptId && arr.includes(scriptId)) {
                li.style.display = "none";//隐藏掉黑名单里的脚本
            }
        }
    }
    function addLinks(selector) {
        let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
        let node_lis = document.querySelectorAll(selector);
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let li = node_lis[i];
            let p = document.createElement("p");

            if (!li.querySelector("article > h2 > a")) { continue; }
            let a1 = document.createElement('a');
            a1.href = li.querySelector("article > h2 > a").href + "/code.user.js";
            a1.innerText = GUI_strs.install;
            p.appendChild(a1);
            p.appendChild(document.createTextNode(" | "));

            let a2 = document.createElement('a');
            a2.href = "javascript:void(0);";
            a2.innerText = GUI_strs.remove;
            a2.onclick = function () { li.remove(); }
            p.appendChild(a2);
            p.appendChild(document.createTextNode(" | "));

            let a3 = document.createElement('a');
            a3.href = "javascript:void(0);";
            a3.innerText = GUI_strs.addtoblacklist;
            let scriptId = li.dataset.scriptId;
            if (scriptId && arr.includes(scriptId)) { a3.innerText = GUI_strs.removefromblacklist; }
            a3.onclick = function () {
                let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
                if (arr.includes(scriptId)) {
                    arr.splice(arr.indexOf(scriptId), 1);
                    GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                    this.innerText = GUI_strs.addtoblacklist;
                }
                else {
                    arr.push(scriptId);
                    GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                    li.style.display = "none";
                    this.innerText = GUI_strs.removefromblacklist;
                }
            }
            p.appendChild(a3);
            p.appendChild(document.createTextNode(" | "));

            let a4 = document.createElement('a');
            a4.href = li.querySelector("article > h2 > a").href + "/code";
            a4.innerText = GUI_strs.code;
            a4.target = "_blank";
            p.appendChild(a4);
            p.appendChild(document.createTextNode(" | "));

            let a5 = document.createElement('a');
            a5.href = li.querySelector("article > h2 > a").href + "/versions";
            a5.innerText = GUI_strs.history;
            a5.target = "_blank";
            p.appendChild(a5);
            p.appendChild(document.createTextNode(" | "));

            let a6 = document.createElement('a');
            a6.href = li.querySelector("article > h2 > a").href + "/feedback";
            a6.innerText = GUI_strs.feedback;
            a6.target = "_blank";
            p.appendChild(a6);
            p.appendChild(document.createTextNode(" | "));

            let a7 = document.createElement('a');
            a7.href = li.querySelector("article > h2 > a").href + "/stats";
            a7.innerText = GUI_strs.stats;
            a7.target = "_blank";
            p.appendChild(a7);
            p.appendChild(document.createTextNode(" | "));

            let a8 = document.createElement('a');
            a8.href = "https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%a8%E5%87%B0";
            a8.innerText = GUI_strs.authorotherscripts;
            a8.target = "_blank";
            p.appendChild(a8);
            p.appendChild(document.createTextNode(" | "));
            li.querySelector("article").appendChild(p);
        }
    }

    function total_installs() {
        let items = document.querySelectorAll("#user-script-list article > dl > dd.script-list-total-installs > span");
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            let n = parseInt(items[i].innerText.replace(/,/g, ''), 10);
            if (!isNaN(n)) { sum += n; }
        }
        let text = document.querySelector("body > div.width-constraint > section > h2").innerText;
        document.querySelector("body > div.width-constraint > section > h2").innerText = text + `(${sum})`;
    }
    function handle_blacklist() {
        let installArea = document.querySelector("#install-area");
        if (!installArea) { return; }
        let a3 = document.createElement('a');
        a3.href = "javascript:void(0);";
        a3.innerText = GUI_strs.addtoblacklist;
        let scriptId = location.href.match(/\/scripts\/(\d+)-/);
        if (scriptId) { scriptId = scriptId[1]; }
        let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
        if (scriptId && arr.includes(scriptId)) { a3.innerText = GUI_strs.removefromblacklist; }
        a3.onclick = function () {
            let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
            if (arr.includes(scriptId)) {
                arr.splice(arr.indexOf(scriptId), 1);
                GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                this.innerText = GUI_strs.addtoblacklist;
            }
            else {
                arr.push(scriptId);
                GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                this.innerText = GUI_strs.removefromblacklist;
            }
        }
        installArea.insertBefore(a3, installArea.querySelector("a.install-help-link").nextSibling);
    }

    if (document.querySelector("#browse-script-list")) {
        document.querySelector("#site-nav > nav > li.with-submenu").outerHTML = document.querySelector("#site-nav > nav > li.with-submenu > nav").innerHTML;
        addFilterSystem("#browse-script-list");
        hideScriptsInBlacklist("#browse-script-list");
        addLinks("#browse-script-list > li");
    }
    if (document.querySelector("#user-script-list")) {
        document.querySelector("#site-nav > nav > li.with-submenu").outerHTML = document.querySelector("#site-nav > nav > li.with-submenu > nav").innerHTML;
        total_installs();
        addFilterSystem("#user-script-list");
        hideScriptsInBlacklist("#user-script-list");
        addLinks("#user-script-list > li");
    }
    if (/\/scripts\/\d+-/.test(location.href)) {
        handle_blacklist();
    }


    // Your code here...
})();