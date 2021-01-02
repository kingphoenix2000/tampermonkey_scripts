// ==UserScript==
// @name                  网站好帮手
// @name:en               Website helper
// @name:zh-CN            网站好帮手
// @namespace             https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL            https://github.com/kingphoenix2000/tampermonkey_scripts
// @updateURL             https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Page%20Automation/%E5%88%A0%E9%99%A4%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @version               0.1.6
// @author                浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description           本脚本提供了一系列小工具，在您访问互联网网站的时候加快您访问网站的速度和提高您的工作效率。包括删除服务器重定向(支持全网网站)
// @description:en        This script provides a series of small tools to speed up the speed of your visit to the website and improve your work efficiency.
// @description:zh-CN     本脚本提供了一系列小工具，在您访问互联网网站的时候加快您访问网站的速度和提高您的工作效率。包括删除服务器重定向(支持全网网站)
// @homepage              https://blog.csdn.net/kingwolf_javascript/
// @include               *
// @grant                 GM_getValue
// @grant                 GM_setValue
// @grant                 GM_registerMenuCommand
// @noframes
// @note                  2020-04-10：添加删除服务器跳转功能。
// @note                  2020-04-12：修改域名解析函数。
// @note                  2020-04-19：增加 回到顶部 功能。
// ==/UserScript==

(function () {
    'use strict';

    let div1 = document.createElement("div");
    div1.id = "returnToTop";
    div1.innerText = "回到顶部";
    div1.style.cssText = "display:none;font-size:15px;padding: 10px;bottom: 5px;right: 5px;z-index: 1000;background-color: gray;position: fixed;border-radius: 25px;text-align: center;cursor: pointer;color: #fff;";
    div1.onclick = function () { scrollTo(0, 0); }
    let height = document.documentElement.scrollHeight;
    if (height > 2000) { div1.style.display = "block"; }
    document.body.appendChild(div1);


    let WebSite = JSON.parse(GM_getValue("Phoenix_City_WebSite", false));
    // console.log(WebSite);
    let redirect_URL_list = [];
    if (WebSite) {
        //以下代码为升级版本的兼容性代码
        if (!WebSite.Redirect_URL_List) {
            for (let domain in WebSite) {
                let links = WebSite[domain].removeURLList;
                for (let i = 0; i < links.length; i++) {
                    let url = links[i];
                    if (!redirect_URL_list.includes(url)) {
                        redirect_URL_list.push(url);
                    }
                }
            }
            WebSite = {};
            WebSite.Redirect_URL_List = redirect_URL_list;
            console.log(WebSite);
            GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
        }
    }
    else {
        WebSite = {};
        WebSite.Redirect_URL_List = redirect_URL_list;
    }
    console.log(WebSite);

    let num = 0;
    function removeRedirectURL(msg, links) {
        let len1 = WebSite.Redirect_URL_List.length;
        for (let i = 0; i < links.length; i++) {
            let href = links[i].href;

            for (let j = 0; j < len1; j++) {
                const url = WebSite.Redirect_URL_List[j];
                href = decodeURIComponent(href.replace(url, ''));
            }
            if (href.startsWith("http")) {
                links[i].href = href;
            }
            else {
                console.log("错误的网址： ", links[i].href);
            }
        }
        num = num + links.length;
        console.log(msg, "目前已经删除重定向的链接数：", num);
    }
    //首先删除已经加载的超链接的重定向
    removeRedirectURL("页面初始化阶段-->", document.links);


    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var mutationObserver = new MutationObserver(function (mutations, instance) {
        //console.log(instance);
        mutations.forEach(function (mutation) {
            let addedNodes = mutation.addedNodes;
            if (addedNodes.length > 0) {
                addedNodes.forEach(function (node) {
                    if (node.nodeType == 1) {
                        removeRedirectURL("页面链接动态加载阶段-->", node.querySelectorAll("a"));
                    }
                });
            }
        });
    });

    // 开始监听页面根元素 HTML 变化。
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    GM_registerMenuCommand("添加重定向链接", () => {
        let url = prompt("链接必须以http或者https开头，并且带有？和=\n类似于：https://link.zhihu.com/?target=", "");
        if (url) {
            if (WebSite.Redirect_URL_List.includes(url)) {
                console.log(`要添加的重定向URL：${url}已经存在。`);
            }
            else {
                WebSite.Redirect_URL_List.push(url);
                GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
                console.log(`重定向URL：${url} 添加成功。`);
            }
        }
    });
    GM_registerMenuCommand("删除重定向链接", () => {
        let url = prompt("链接必须以http或者https开头，并且带有？和=\n类似于：https://link.zhihu.com/?target=", "");
        if (url) {
            let index = WebSite.Redirect_URL_List.indexOf(url);
            if (index == -1) {
                console.log(`找不到要删除的重定向URL：${url}。`);
            }
            else {
                WebSite.Redirect_URL_List.splice(index, 1);
                GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
                console.log(`重定向URL：${url} 删除成功。`);
            }
        }
    });

})();
