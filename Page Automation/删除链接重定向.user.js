
// ==UserScript==
// @name         删除链接重定向
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @downloadURL  https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Page%20Automation/%E5%88%A0%E9%99%A4%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @version      0.1.0
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  点击页面左下角蓝色按钮删除超链接中的第三方跳转，目前支持的网站有知乎、简书、掘金等等网站。如果发现没有删除第三方跳转，或者新的超链接是新生成的，多次点击该按钮即可。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      *://*.zhihu.com/*
// @include      *://*.jianshu.com/*
// @include      *://juejin.im/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let removeURLList = [
        "https://link.zhihu.com/?target=",
        "http://link.zhihu.com/?target=",
        "https://link.jianshu.com/?t=",
        "https://link.juejin.im/?target="
    ];

    let len = removeURLList.length;
    let div = document.createElement("div");
    div.id = "removeLinksRedirection";
    div.innerText = "删除链接重定向";
    div.style.cssText = "width: 150px;font-size:15px;padding: 7px;bottom: 35px;left: 35px;z-index: 1000;background-color: #0077e6;position: fixed;border-radius: 25px;text-align: center;cursor: pointer;color: #fff;";
    div.onclick = function (e) {
        let links = document.links;
        links = Array.from(links);
        links.forEach(function (a) {
            let href = a.href;
            for (let i = 0; i < len; i++) {
                let url = removeURLList[i];
                href = href.replace(url, '');
            }
            if (href.startsWith("http")) {
                href = decodeURIComponent(href);
                a.href = href;
            }
            else {
                console.log("错误的网址： ", a.href);
            }
        });
        this.innerText = "操作成功！";
        setTimeout(function () { document.getElementById("removeLinksRedirection").innerText = "删除链接重定向"; }, 3000);
    }

    document.body.appendChild(div);

})();
