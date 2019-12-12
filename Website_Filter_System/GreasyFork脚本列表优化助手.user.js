// ==UserScript==
// @name         GreasyFork脚本列表优化助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @downloadURL  https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/GreasyFork%E8%84%9A%E6%9C%AC%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.2
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  此脚本会在GreasyFork网站的脚本列表页面每个脚本的下面添加几个快捷操作的按钮。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://greasyfork.org/*
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @note         2019-12-12 为脚本列表的每个脚本增加加入黑名单功能，加入黑名单的脚本会在页面加载完成以后被隐藏掉。可以单击显示全部脚本按钮来显示黑名单的脚本
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }
    function addFilterSystem() {
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.innerText = "GreasyFork脚本列表优化助手";
        div.appendChild(h2);
        let input = document.createElement("input");
        input.id = "filter_input";
        input.type = "text";
        input.value = "";
        input.placeholder = "请输入过滤关键字";
        div.appendChild(input);
        let showOnlyBtn = document.createElement("input");
        let items = document.querySelectorAll("#browse-script-list > li");
        let len = items.length;
        showOnlyBtn.type = "button";
        showOnlyBtn.value = "过滤脚本";
        showOnlyBtn.style.marginLeft = "15px";
        showOnlyBtn.onclick = function () {
            let text = input.value;
            for (let i = 0; i < len; i++) {
                if (!items[i].innerText.includes(text)) {
                    items[i].style.display = "none";//隐藏掉不包含关键字的脚本 并且对隐藏掉的包含关键字的脚本不做处理。
                }
            }
        }
        let showAllBtn = document.createElement("input");
        showAllBtn.type = "button";
        showAllBtn.value = "显示全部脚本";
        showAllBtn.style.marginLeft = "15px";
        showAllBtn.onclick = function () {
            for (let i = 0; i < len; i++) {
                items[i].style.display = "list-item";
            }
        }
        div.appendChild(showOnlyBtn);
        div.appendChild(showAllBtn);
        document.querySelector("#browse-script-list").insertBefore(div, document.querySelector("#browse-script-list").firstChild);
    }

    addFilterSystem();

    let items = document.querySelectorAll("#browse-script-list > li");
    let len = items.length;
    for (let i = 0; i < len; i++) {
        items[i].addEventListener("click", function (e) {
            if (e.ctrlKey === true) {
                e.preventDefault();
                this.remove();
                return false;
            }
            return true;
        }, true);
    }



    let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
    var links = document.querySelectorAll("#browse-script-list > li > article > h2 > a");
    for (let index = 0; index < links.length; index++) {
        const node_li = links[index].parentNode.parentNode.parentNode;
        if (arr.includes(node_li.dataset.scriptId)) {
            node_li.style.display = "none";//隐藏掉黑名单里的脚本
        }
    }
    links.forEach(function (item) {
        var href = item.href;
        GM_xmlhttpRequest({
            "method": "GET",
            "url": href,
            "onload": function (response) {
                var text = response.responseText;
                var scriptURL = text.match(/\/scripts\/[^"']+\.(user\.js)/)[0];
                console.log(scriptURL);
                let a = document.createElement('a');
                a.href = "https://greasyfork.org" + scriptURL;
                a.innerText = "安装脚本";
                let a2 = document.createElement('a');
                a2.href = "javascript:void(0);";
                a2.innerText = "删除脚本";
                let node_li = item.parentNode.parentNode.parentNode;
                a2.onclick = function () { node_li.remove(); }
                a2.style.marginLeft = "15px";
                let a3 = document.createElement('a');
                a3.href = "javascript:void(0);";
                a3.innerText = "加入黑名单";
                let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
                if (arr.includes(node_li.dataset.scriptId)) { a3.innerText = "移除黑名单"; }
                a3.onclick = function () {
                    let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
                    if (arr.includes(node_li.dataset.scriptId)) {
                        arr.splice(arr.indexOf(node_li.dataset.scriptId), 1);
                        GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                        this.innerText = "加入黑名单";
                    }
                    else {
                        arr.push(node_li.dataset.scriptId);
                        GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                        node_li.style.display = "none";
                        this.innerText = "移除黑名单";
                    }
                }
                a3.style.marginLeft = "15px";
                let a4 = document.createElement('a');
                a4.href = "https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0";
                a4.innerText = "浴火凤凰的其它脚本";
                a4.style.marginLeft = "15px";
                item.parentNode.appendChild(a);
                item.parentNode.appendChild(a2);
                item.parentNode.appendChild(a3);
                item.parentNode.appendChild(a4);
            },
            onerror: function (response) {
                console.error("查询信息发生错误。");
            },
            ontimeout: function (response) {
                console.info("查询信息超时。");
            }
        });
    });
    // Your code here...
})();