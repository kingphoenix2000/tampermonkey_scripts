// ==UserScript==
// @name         GreasyFork网站助手
// @name:en      GreasyFork Website Assistant
// @name:zh-CN   GreasyFork网站助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @updateURL    https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/GreasyFork%E8%84%9A%E6%9C%AC%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.9
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
// @note         2020-04-16 增加 脚本列表综合排序功能，支持三个条件关联排序。
// @note         2020-04-19 增加 在用户主页自动隐藏最后回复者是脚本作者的讨论，减少讨论内容，减轻脚本作者的心理负担。
// @note         2020-05-24 增加 按照关键字列表隐藏脚本的功能。
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
    let GUI_sort_Helper = {};
    let is_CN = location.href.includes("zh-");
    if (is_CN) {
        GUI_strs = {
            name: "GreasyFork网站助手",
            filter_input_placeholder: "请输入过滤关键字",
            showOnlyBtnValue: "筛选",
            showAllBtnValue: "显示全部",
            showAlldiscussion: "显示全部讨论内容",
            switchBtnValue1: "宽屏",
            switchBtnValue2: "窄屏",
            sortBtnValue: "重新排序",
            install: "安装脚本",
            remove: "删除脚本",
            addtoblacklist: "加入黑名单",
            removefromblacklist: "移除黑名单",
            authorotherscripts: "浴火凤凰的其它脚本",
            code: "代码",
            history: "历史版本",
            feedback: "反馈",
            stats: "统计数据",
            ratingScore: "评分:",
            sortDesc: "以下菜单对已经加载的脚本列表进行重新排序，从左到右排序菜单优先级依次降低。",
            sortErrMsg: "选中的排序菜单的内容不能重复！",
            question: "无评分",
            good: "好评",
            ok: "一般",
            bad: "差评",
        };
        GUI_sort_Helper = {
            daily_installs: "今日安装",
            total_installs: "总安装量",
            ratings: "得分",
            // updated: "最近更新",
        }
    }
    else {
        GUI_strs = {
            name: "GreasyFork Website Assistant",
            filter_input_placeholder: "Please enter filter keywords here...",
            showOnlyBtnValue: "Filter",
            showAllBtnValue: "Show All",
            showAlldiscussion: "Show all Discussions",
            switchBtnValue1: "Wide Screen",
            switchBtnValue2: "Normal Screen",
            sortBtnValue: "sort current list",
            install: "install",
            remove: "remove",
            addtoblacklist: "add to blacklist",
            removefromblacklist: "remove from blacklist",
            authorotherscripts: "Author's other scripts",
            code: "Code",
            history: "History",
            feedback: "Feedback",
            stats: "Stats",
            ratingScore: "Score:",
            sortDesc: "The following menu reorders the list of scripts that have been loaded, and the priority of the drop-down menus decreases from left to right.",
            sortErrMsg: "The contents of the selected sort menu cannot be repeated!",
            question: "question",
            good: "good",
            ok: "ok",
            bad: "bad",
        };
        GUI_sort_Helper = {
            daily_installs: "daily_installs",
            total_installs: "total_installs",
            ratings: "ratings",
            // updated: "updated",
        }
    }
    let typeToDataSet = {
        daily_installs: "scriptDailyInstalls",
        total_installs: "scriptTotalInstalls",
        ratings: "scriptRatingScore",
        updated: "scriptUpdatedDate",
    };
    let pageSortType = "daily_installs";
    let url = new URL(location.href);
    let searchParams = url.searchParams;
    if (!searchParams.get("sort")) {
        // delete GUI_sort_Helper.daily_installs;
    }
    else {
        pageSortType = searchParams.get("sort");
        // delete GUI_sort_Helper[searchParams.get("sort")];
    }
    function addSortSelection(selector) {
        let div = document.createElement("div");
        div.id = "sort_select_list";
        let h3 = document.createElement("h3");
        h3.innerText = GUI_strs.sortDesc;
        h3.style.cssText = "margin: 10px;color: #A42121;";
        div.appendChild(h3);
        for (let i = 0; i < 3; i++) {
            let select = document.createElement("select");
            select.innerHTML = '';
            select.style.cssText = "width: 120px;height: 23px;margin-left:15px;";
            for (const key in GUI_sort_Helper) {
                if (GUI_sort_Helper.hasOwnProperty(key)) {
                    const value = GUI_sort_Helper[key];
                    select.innerHTML += `<option value="${key}">${value}</option>`;
                }
            }
            div.appendChild(select);
        }
        let sortBtn = document.createElement("input");
        sortBtn.type = "button";
        sortBtn.value = GUI_strs.sortBtnValue;
        sortBtn.style.marginLeft = "15px";
        sortBtn.onclick = function () {
            let selects = document.querySelectorAll("#sort_select_list > select");
            let arr = [];
            for (let i = 0; i < 3; i++) {
                if (arr.includes(selects[i].value)) {
                    alert(GUI_strs.sortErrMsg); return;
                }
                else {
                    arr.push(selects[i].value);
                }
            }
            // console.log(arr);
            let items = document.querySelectorAll(selector + " > li");
            let len = items.length;
            items = [].slice.call(items);
            items.sort(function (a, b) {
                let n1 = +a.dataset[typeToDataSet[arr[0]]];
                let n2 = +b.dataset[typeToDataSet[arr[0]]];
                if (n2 != n1) {
                    return n2 - n1;
                }
                else {
                    let n3 = +a.dataset[typeToDataSet[arr[1]]];
                    let n4 = +b.dataset[typeToDataSet[arr[1]]];
                    if (n4 != n3) {
                        return n4 - n3;
                    }
                    else {
                        let n5 = +a.dataset[typeToDataSet[arr[2]]];
                        let n6 = +b.dataset[typeToDataSet[arr[2]]];
                        return n6 - n5;

                    }
                }
            });
            let p = document.querySelector(selector);
            for (let j = 0; j < len; j++) {
                p.appendChild(items[j]);
            }
        }
        div.appendChild(sortBtn);
        return div;
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
        div.appendChild(addSortSelection(selector));
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
    function hideScriptsByKeywords(selector) {
        let arr = JSON.parse(GM_getValue("keywords_Blacklists", "[]"));
        arr = ["懒人专用", "百度文库"];
        let len2 = arr.length;
        let node_lis = document.querySelectorAll(selector + " > li");
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let li = node_lis[i];
            if (!li.querySelector("article > h2 > a")) { continue; }
            //取出脚本标题和描述
            let text = li.querySelector("article > h2").innerText;
            for (let j = 0; j < len2; j++) {
                if (text.includes(arr[j])) {
                    li.style.display = "none";//隐藏掉黑名单里的脚本
                    break;
                }
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
            let dd = li.querySelector("article > dl > dd.script-list-ratings");
            let span = document.createElement('span');
            span.title = GUI_strs.ratingScore;
            span.className = "good-rating-count";
            span.style.cssText = "margin-left:5px;";
            span.innerText = GUI_strs.ratingScore + dd.dataset.ratingScore;
            dd.firstElementChild.appendChild(span);

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
    function hideReplyByAuthor() {
        if (!document.querySelector("#user-discussions-on-scripts-written")) { return; }
        let text = document.querySelector("body > div.width-constraint > section > h2").innerText;
        text = `最终回复由 ${text} 发表于`;
        let items = document.querySelectorAll("#user-discussions-on-scripts-written > ul.discussion-list > li");
        let len = items.length;
        for (let i = 0; i < len; i++) {
            if (items[i].innerText.includes(text)) { items[i].style.display = "none"; }
        }
        let showAllBtn = document.createElement("input");
        showAllBtn.type = "button";
        showAllBtn.value = GUI_strs.showAlldiscussion;
        showAllBtn.style.marginLeft = "15px";
        showAllBtn.onclick = function () {
            for (let i = 0; i < len; i++) {
                items[i].style.display = "list-item";
            }
        }
        document.querySelector("#user-discussions-on-scripts-written > header").appendChild(showAllBtn);
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
    function addFilterSystem2(selector) {
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
        div.appendChild(showOnlyBtn);
        div.appendChild(showAllBtn);

        let arr = ["question", "good", "ok", "bad"];
        for (let i = 0; i < arr.length; i++) {
            let showBtn = document.createElement("input");
            showBtn.type = "button";
            showBtn.value = GUI_strs[arr[i]];
            showBtn.dataset.type = arr[i];
            showBtn.style.marginLeft = "15px";
            showBtn.onclick = function () {
                let type = this.dataset.type;
                for (let i = 0; i < len; i++) {
                    let li = items[i];
                    if (!li.className.includes(type)) {
                        li.style.display = "none";//隐藏掉不包含关键字的脚本 并且对隐藏掉的包含关键字的脚本不做处理。
                    }
                    else {
                        li.style.display = "list-item";
                    }
                }
            }
            div.appendChild(showBtn);
        }

        document.querySelector("#script-content").insertBefore(div, document.querySelector("#script-content > h3").nextElementSibling);
    }

    if (document.querySelector("#browse-script-list")) {
        document.querySelector("#site-nav > nav > li.with-submenu").outerHTML = document.querySelector("#site-nav > nav > li.with-submenu > nav").innerHTML;
        addFilterSystem("#browse-script-list");
        hideScriptsInBlacklist("#browse-script-list");
        hideScriptsByKeywords("#browse-script-list");
        addLinks("#browse-script-list > li");
    }
    if (document.querySelector("#user-script-list")) {
        document.querySelector("#site-nav > nav > li.with-submenu").outerHTML = document.querySelector("#site-nav > nav > li.with-submenu > nav").innerHTML;
        hideReplyByAuthor();
        total_installs();
        addFilterSystem("#user-script-list");
        hideScriptsInBlacklist("#user-script-list");
        hideScriptsByKeywords("#user-script-list");
        addLinks("#user-script-list > li");
    }
    if (/\/scripts\/\d+-/.test(location.href)) {
        handle_blacklist();
    }
    if (location.href.includes("/feedback")) {
        if (document.querySelector("#discussions")) { addFilterSystem2("#discussions"); }
    }


    // Your code here...
})();