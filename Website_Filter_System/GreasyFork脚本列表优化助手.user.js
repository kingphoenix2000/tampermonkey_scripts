// ==UserScript==
// @name         GreasyFork脚本列表优化助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @downloadURL  https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/GreasyFork%E8%84%9A%E6%9C%AC%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.0
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  此脚本会在GreasyFork网站的脚本列表页面每个脚本的下面添加几个快捷操作的按钮。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://greasyfork.org/*
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }

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


    var links = document.querySelectorAll("#browse-script-list > li > article > h2 > a");
    links = Array.from(links);
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
                a2.onclick = function () { item.parentNode.parentNode.parentNode.remove(); }
                a2.style.marginLeft = "15px";
                let a3 = document.createElement('a');
                a3.href = "https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0";
                a3.innerText = "浴火凤凰的其它脚本";
                a3.style.marginLeft = "15px";
                item.parentNode.appendChild(a);
                item.parentNode.appendChild(a2);
                item.parentNode.appendChild(a3);
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