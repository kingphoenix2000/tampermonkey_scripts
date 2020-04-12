
// ==UserScript==
// @name                  网站好帮手
// @name:en               Website helper
// @name:zh-CN            网站好帮手
// @namespace             https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL            https://github.com/kingphoenix2000/tampermonkey_scripts
// @updateURL             https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Page%20Automation/%E5%88%A0%E9%99%A4%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @version               0.1.3
// @author                浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description           本脚本提供了一系列小工具，在您访问互联网网站的时候加快您访问网站的速度和提高您的工作效率。包括删除服务器重定向(支持全网网站)
// @description:en        This script provides a series of small tools to speed up the speed of your visit to the website and improve your work efficiency.
// @description:zh-CN     本脚本提供了一系列小工具，在您访问互联网网站的时候加快您访问网站的速度和提高您的工作效率。包括删除服务器重定向(支持全网网站)
// @homepage              https://blog.csdn.net/kingwolf_javascript/
// @include               *
// @grant                 GM_getValue
// @grant                 GM_setValue
// @noframes
// @note                  2020-04-10：添加删除服务器跳转功能。
// @note                  2020-04-12：修改域名解析函数。
// ==/UserScript==

(function () {
    'use strict';
    function getDomainName(str1) {
        let hostname = str1 || window.location.hostname;
        let domain1 = hostname.split('.').slice(-2).join('.');
        let CN_Sites = ["com.cn", "edu.cn", "gov.cn", "int.cn", "mil.cn", "net.cn", "org.cn", "biz.cn", "info.cn", "pro.cn", "name.cn", "museum.cn", "coop.cn", "aero.cn", "xxx.cn", "idv.cn", "mobi.cn", "cc.cn", "me.cn", "xin.cn", "top.cn", "xyz.cn", "vip.cn"];
        if (CN_Sites.includes(domain1)) {//如果以.cn结尾，则取后三位
            domain1 = hostname.split('.').slice(-3).join('.');
        }
        return domain1;
    }

    let hostname = getDomainName();

    let WebSite = {};
    WebSite["zhihu.com"] = {};
    WebSite["zhihu.com"]["removeURLList"] = ["https://link.zhihu.com/?target="];
    WebSite["juejin.im"] = {};
    WebSite["juejin.im"]["removeURLList"] = ["https://link.juejin.im/?target="];
    WebSite["jianshu.com"] = {};
    WebSite["jianshu.com"]["removeURLList"] = ["https://link.jianshu.com/?t=", "https://links.jianshu.com/go?to="];
    let obj = JSON.parse(GM_getValue("Phoenix_City_WebSite", false));
    if (obj == false) {//没有网站对象
        GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
    }

    let div = document.createElement("div");
    div.id = "removeLinksRedirection";
    div.innerText = "删除链接重定向";
    div.style.cssText = "width: 150px;font-size:15px;padding: 7px;bottom: 35px;left: 35px;z-index: 1000;background-color: #0077e6;position: fixed;border-radius: 25px;text-align: center;cursor: pointer;color: #fff;";
    div.onclick = function (e) {
        let links = document.links;
        let len = links.length;

        let removeURLList = [];

        let Website = JSON.parse(GM_getValue("Phoenix_City_WebSite", "{}"));
        if ((Website[hostname] && Website[hostname]["removeURLList"])) {
            removeURLList = Website[hostname]["removeURLList"];
        }
        else {
            let settled = false;
            let arr = [];
            alert("还没有为当前网站设置过要删除的跳转链接前缀！\n\n下面开始设置，只需设置一次，每个网站可以设置2个要删除的跳转链接前缀。");
            let i = 0;
            while (i < 2) {
                let result = prompt("为当前网站设置要删除的跳转链接前缀\n链接必须以http或者https开头，并且带有？和=\n类似于：https://link.zhihu.com/?target=", "");
                if (result == null) { i++; }
                else {//点击了确定按钮
                    if (!(result.startsWith("http") && result.includes("?") && result.includes("="))) {
                        //链接格式错误！
                        alert("链接格式错误！\n链接必须以http或者https开头，并且带有?和=\n类似于：https://link.zhihu.com/?target=");
                    }
                    else {
                        //链接格式正确！
                        console.log(result);
                        let site = JSON.parse(GM_getValue("Phoenix_City_WebSite", "{}"));
                        if ((site[hostname] && site[hostname]["removeURLList"])) {
                            site[hostname]["removeURLList"].push(result);
                        }
                        else {
                            site[hostname] = {};
                            site[hostname]["removeURLList"] = [];
                            site[hostname]["removeURLList"].push(result);
                        }
                        GM_setValue("Phoenix_City_WebSite", JSON.stringify(site));
                        i++;
                    }
                }
            }
            if (!settled) { return; }
        }

        let len_URLList = removeURLList.length;
        if (len_URLList == 0) { return; }
        for (let i = 0; i < len; i++) {
            const a = links[i];
            let href = a.href;
            if (!href.startsWith("http")) { continue; }
            for (let j = 0; j < len_URLList; j++) {
                const url = removeURLList[j];
                if (!url.startsWith("http")) { continue; }
                href = href.replace(url, '');
            }
            if (href.startsWith("http")) {
                href = decodeURIComponent(href);
                a.href = href;
            }
            else {
                console.log("错误的网址： ", a.href);
            }
        }
        this.innerText = "操作成功！";
        setTimeout(function () { document.getElementById("removeLinksRedirection").innerText = "删除链接重定向"; }, 3000);
    }
    document.body.appendChild(div);

})();
