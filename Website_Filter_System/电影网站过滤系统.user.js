
// ==UserScript==
// @name         电影网站过滤系统
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @downloadURL  https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/%E7%94%B5%E5%BD%B1%E7%BD%91%E7%AB%99%E8%BF%87%E6%BB%A4%E7%B3%BB%E7%BB%9F.user.js
// @version      0.1.0
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  在悠悠MP4电影网站的文字电影列表顶部添加几个可以筛选的关键字按钮，点击相应的按钮就会按照按钮的提示文字进行电影种类的筛选，并切换下面列表的显示。
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://www.uump4.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function setUUMP4() {
        let items = document.querySelectorAll("ul.list-unstyled.threadlist > li.media.forum-list");
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

        var container = document.querySelector("div.threadlist-box > div.item-head > div.left");
        var div = document.createElement("div");
        var tagArr = ["全部显示", "字幕组作品", "<5GB", "<10GB", "<15GB", "合集", "720P", "1080P", "4K", "国英双语", "中英双字", "中文字幕"];
        for (let i = 0; i < tagArr.length; i++) {
            let a = document.createElement("a");
            a.innerText = tagArr[i];
            a.href = "javascript:void(0);";
            a.style.marginLeft = "25px";
            a.onclick = function () {
                let links = this.parentNode.querySelectorAll("a");
                for (let i = 0; i < links.length; i++) {
                    links[i].style.border = "none";
                }
                this.style.border = "1px solid red";

                let text2 = this.innerText;
                for (let i = 0; i < len; i++) {
                    let li = items[i];
                    li.style.display = "flex";//先显示出全部商品

                    let text1 = li.querySelector("div.subject.break-all").innerText.toLowerCase();
                    switch (text2) {
                        case "全部显示":
                            break;
                        case "字幕组作品":
                            // let movieNode = li.querySelector("div.subject.break-all > a:last-of-type");
                            //不存在评价节点
                            if (!text1.includes("cmct")
                                && !text1.includes("killman")
                                && !text1.includes("lwgod")
                                && !text1.includes("龙网")
                                && !text1.includes("cnxp")
                                && !text1.includes("帝国")
                                && !text1.includes("cnscg")
                                && !text1.includes("圣城家园")
                                && !text1.includes("wofei")
                                && !text1.includes("hdbird")
                                && !text1.includes("飞鸟娱乐")
                                && !text1.includes("x264.ac3.")
                            ) {
                                //不包含万+字符串
                                li.style.display = "none";
                            }
                            break;
                        case "合集":
                            if (!text1.includes("合集") && !text1.includes("部曲") && !text1.includes("合辑") && !text1.includes("全集") && !text1.includes("打包") && !/1-\d/.test(text1) && !/\d集全/.test(text1) && !/全\d+集/.test(text1)) {
                                li.style.display = "none";
                            }
                            break;
                        case "中文字幕":
                            if (!text1.includes("中文字幕") && !text1.includes("中字")) {
                                li.style.display = "none";
                            }
                            break;
                        case "中英双字":
                            if (!text1.includes("中英字幕") && !text1.includes("双字")) {
                                li.style.display = "none";
                            }
                            break;
                        case "国英双语":
                            if (!text1.includes("音轨")
                                && !text1.includes("双语")
                                && !text1.includes("三语")
                                && !text1.includes("四语")
                                && !text1.includes("国英")
                                && !text1.includes("国粤")
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "<5GB":
                        case "<10GB":
                        case "<15GB":
                            let n1 = parseFloat(this.innerText.replace("<", "").replace("GB", ""), 10);
                            let movieNode = li.querySelector("div.subject.break-all > a:last-of-type");
                            let n2 = movieNode.innerText.match(/([0-9.]+)G/);
                            if (n2 != null) {//文件显示为GB
                                n2 = parseFloat(n2[1], 10);
                                if (n2 > n1) { li.style.display = "none"; }
                                else {
                                    //与下边界进行比较，过滤掉上一个分段的数据
                                    if (n2 < (n1 - 5)) { li.style.display = "none"; }
                                }
                            }
                            else {//文件显示为MB或者不显示大小
                                if (n1 != 5) {//大于5GB的情况，去掉所有的大小为1GB以下的文件，就是显示为MB的文件
                                    n2 = movieNode.innerText.match(/([0-9.]+)M/);
                                    if (n2 != null) {
                                        { li.style.display = "none"; }
                                    }
                                }
                            }
                            break;

                        default:
                            // movieNode = li.querySelector("div.subject.break-all > a:last-of-type");
                            //不存在评价节点
                            if (!text1.includes(this.innerText.toLowerCase())) {
                                //不包含万+字符串
                                li.style.display = "none";
                            }
                    }
                }
                return false;
            }
            div.appendChild(a);
        }
        container.appendChild(div);
    }


    if (location.href.includes("https://www.uump4.net/")) {
        setUUMP4();
    }
    // Your code here...
})();
