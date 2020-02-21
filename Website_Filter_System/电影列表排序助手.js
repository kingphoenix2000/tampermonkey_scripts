// ==UserScript==
// @name         电影列表排序助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @downloadURL  https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.0
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  给包含很长电影列表的单个页面添加几个筛选排序功能，比如按照年份、评分等对电影列表重新进行排序。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://leisidianying.com/*
// @grant        GM_openInTab
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }

    function setButton() {
        let div = document.createElement("div");
        let h4 = document.createElement("h4");
        h4.innerHTML = '<a href="https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0" target="_blank">电影列表排序助手，作者：浴火凤凰(QQ:307053741)</a>';
        let input1 = document.createElement("input");
        let input2 = document.createElement("input");
        input1.type = "button";
        input1.value = "年份从远到近";
        input2.type = "button";
        input2.value = "年份从近到远";
        input2.style.marginLeft = "15px";
        input1.onclick = input2.onclick = function () {
            let items = document.querySelectorAll("#tag-movie-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.item-name div.name-c a.name");
                let year1 = name1.innerText.match(/\((\d+)\)/);
                if (year1) { year1 = +year1[1] }
                else { year1 = 0; }
                let name2 = b.querySelector("div.item-name div.name-c a.name");
                let year2 = name2.innerText.match(/\((\d+)\)/);
                if (year2) { year2 = +year2[1] }
                else { year2 = 0; }
                if (_this.value == "年份从近到远") { return year2 - year1; }
                else { return year1 - year2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#tag-movie-list").innerHTML = div.innerHTML;
        }
        let input3 = document.createElement("input");
        let input4 = document.createElement("input");
        input3.type = "button";
        input3.value = "评分从高到低";
        input3.style.marginLeft = "15px";
        input4.type = "button";
        input4.value = "评分从低到高";
        input4.style.marginLeft = "15px";
        input3.onclick = input4.onclick = function () {
            let items = document.querySelectorAll("#tag-movie-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.item-name div.rat span[title=rating]");
                let rating1 = name1.innerText;
                if (rating1) { rating1 = +rating1 }
                else { rating1 = 0; }
                let name2 = b.querySelector("div.item-name div.rat span[title=rating]");
                let rating2 = name2.innerText;
                if (rating2) { rating2 = +rating2 }
                else { rating2 = 0; }
                if (_this.value == "评分从高到低") { return rating2 - rating1; }
                else { return rating1 - rating2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#tag-movie-list").innerHTML = div.innerHTML;
        }

        div.appendChild(h4);
        div.appendChild(input1);
        div.appendChild(input2);
        div.appendChild(input3);
        div.appendChild(input4);
        document.querySelector("#tag-movie-list").parentNode.insertBefore(div, document.querySelector("#tag-movie-list"));

    }




    if (location.hostname.includes("leisidianying.com")) {//整个网站
        if (location.href.includes("/tag/")) {//单个页面
            setTimeout(function () { setButton(); }, 2000);
        }
    }
    // Your code here...
})();