// ==UserScript==
// @name         列表重新排序助手
// @name:en      GreasyFork Website Assistant
// @name:zh-CN   列表重新排序助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @updateURL    https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/GreasyFork%E8%84%9A%E6%9C%AC%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.8
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  此脚本会在GreasyFork网站的脚本列表页面和用户脚本列表页面每个脚本的下面添加几个快捷操作的按钮。包括直接安装、临时删除、加入黑名单等等功能。在脚本列表顶部添加了一个根据关键字过滤脚本的功能。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:zh-CN  此脚本会在GreasyFork网站的脚本列表页面和用户脚本列表页面每个脚本的下面添加几个快捷操作的按钮。包括直接安装、临时删除、加入黑名单等等功能。在脚本列表顶部添加了一个根据关键字过滤脚本的功能。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:en  This script will add several shortcut buttons under each script on the script list page and user script list page of GreasyFork website. Including functions such as direct installation, temporary deletion, blacklisting, etc. Added a function to filter scripts based on keywords at the top of the script list.Author：浴火凤凰(QQ:307053741,QQ group:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://chrome.google.com/webstore/*
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @note         2020-04-24 添加Chrome网上应用店网站
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }

    function sortList(params) {
        let items = document.querySelectorAll(params.itemNodeSelector);
        let arr = [].slice.call(items);
        let len = arr.length;
        arr.sort(function (A, B) {
            let node_A = A.querySelector(params.numberNodeSelector);
            let number_A = 0;
            if (node_A) { number_A = +node_A.innerText.replace(/,/g, ''); }
            let node_B = B.querySelector(params.numberNodeSelector);
            let number_B = 0;
            if (node_B) { number_B = +node_B.innerText.replace(/,/g, ''); }

            if (number_B != number_A) {
                //如果两者的数值不相等，大的排在前面
                return number_B - number_A;
            }
            else {
                return number_B - number_A;
            }
        });
        let parentNode = arr[0].parentNode;
        for (let i = 0; i < len; i++) {
            parentNode.appendChild(arr[i]);//按照数值从大到小重新排序列表
        }
    }

    //设置列表项的【删除】按钮
    function setRemoveLink(params) {
        let items = document.querySelectorAll(params.itemNodeSelector);
        let len = items.length;
        for (let i = 0; i < len; i++) {
            let targetNode = items[i].querySelector(params.appendNodeSelector);
            if (targetNode) {
                let a = document.createElement("a");
                a.href = "javascript:void(0);";
                a.innerText = "【删除】";
                a.onclick = function (e) {
                    items[i].remove();
                    return false;
                }
                targetNode.parentNode.insertBefore(a, targetNode.nextSibling);
            }
        }
    }



    if (location.href.includes("https://chrome.google.com/webstore/")) {
        let params = {};
        params.itemNodeSelector = "div[role=row] > div.webstore-test-wall-tile";
        params.numberNodeSelector = "div.KnRoYd-N-nd";
        params.appendNodeSelector = "div[role=button]";
        sortList(params);
        setRemoveLink(params);
    }


    // Your code here...
})();