
// ==UserScript==
// @name         浴火凤凰京东购物助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @downloadURL  https://github.com/kingphoenix2000/tampermonkey_scripts/raw/master/Website_Filter_System/%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B.user.js
// @version      0.1.0
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  在京东商城的商品搜索结果页面顶部生成一个筛选按钮，点击按钮会生成一些筛选条件，可以按照商品店铺、商品包含的内容关键字、商品评价数、商品的标签等等类别进行筛选。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://search.jd.com/Search?keyword=*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function setJDHelper() {
        function addDiv(div) {
            document.querySelector("#ecommerce_filter").appendChild(div);
        }


        let arr = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
        //结合Ctrl删除项目
        for (let i = 0; i < arr.length; i++) {
            // arr[i].removeEventListener("click");
            arr[i].addEventListener("click", function (e) {
                if (e.ctrlKey === true) {
                    e.preventDefault();
                    this.remove();
                    return false;
                }
                return true;
            }, true);
        }


        function getShopList() {
            var shopListWrapper = {};
            var shopListObj = {};
            var shopNameTimes = {};//统计每个店铺出现的次数
            var shopNodes = document.querySelectorAll("#J_goodsList > ul > li > div > div.p-shop > span.J_im_icon > a");
            for (let i = 0; i < shopNodes.length; i++) {
                const shopNode = shopNodes[i];
                shopListObj[shopNode.innerText] = shopNode.href;
                if (!shopNameTimes[shopNode.innerText]) {
                    shopNameTimes[shopNode.innerText] = 1;
                }
                else {
                    shopNameTimes[shopNode.innerText]++;
                }
            }
            shopListWrapper.shopNameTimes = shopNameTimes;
            shopListWrapper.shopListObj = shopListObj;
            console.log(shopListWrapper);
            return shopListWrapper;
        }
        function getTagList() {
            var tagListWrapper = {};
            var tagListObj = {};
            var tagNameTimes = {};//统计每个店铺出现的次数
            var tagNodes = document.querySelectorAll("#J_goodsList > ul > li > div > div.p-icons > i");
            for (let i = 0; i < tagNodes.length; i++) {
                const tagNode = tagNodes[i];
                tagListObj[tagNode.innerText] = tagNode.dataset.tips;
                if (!tagNameTimes[tagNode.innerText]) {
                    tagNameTimes[tagNode.innerText] = 1;
                }
                else {
                    tagNameTimes[tagNode.innerText]++;
                }
            }
            tagListWrapper.tagNameTimes = tagNameTimes;
            tagListWrapper.tagListObj = tagListObj;
            console.log(tagListWrapper);
            return tagListWrapper;
        }

        function createShopList() {
            var shopListWrapper = getShopList();
            var shopListObj = shopListWrapper.shopListObj;
            var div1 = document.createElement("h3");
            div1.innerHTML = "1.按照店铺名字筛选";
            var div2 = document.createElement("div");
            addDiv(div1);
            let a = document.createElement("a");
            a.innerText = "全部显示";
            a.href = "javascript:void(0);";
            a.style.border = "1px solid red";
            a.onclick = function () {
                let links = div2.querySelectorAll("a");
                for (let i = 0; i < links.length; i++) {
                    links[i].style.border = "none";
                }
                this.style.border = "1px solid red";
                let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                let len = items.length;
                for (let i = 0; i < len; i++) {
                    let li = items[i];
                    li.style.display = "list-item";
                }
                return false;
            }
            div2.appendChild(a);
            for (let key in shopListObj) {
                let a = document.createElement("a");
                // a.innerText = key + ("(100)".replace("100", shopListWrapper.shopNameTimes[key]));
                a.innerText = key;
                a.href = shopListObj[key];
                a.style.marginLeft = "25px";
                a.onclick = function () {
                    let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                    let links = div2.querySelectorAll("a");
                    for (let i = 0; i < links.length; i++) {
                        links[i].style.border = "none";
                    }
                    this.style.border = "1px solid red";
                    let len = items.length;
                    for (let i = 0; i < len; i++) {
                        let li = items[i];
                        let shopNode = li.querySelector("div.p-shop > span > a");
                        //判断店铺名字是否相等
                        if (shopNode && this.innerText.includes(shopNode.innerText)) {
                            li.style.display = "list-item";
                        } else {
                            li.style.display = "none";
                        }

                    }
                    return false;
                }
                div2.appendChild(a);
            }
            addDiv(div2);

            var div3 = document.createElement("h3");
            div3.innerHTML = "2.按照内容关键字进行筛选（支持多个关键字，使用空格分开）";
            var div4 = document.createElement("div");
            div4.innerText = "注意：1.筛选的关键字区分字母大小写。2.如果上面选中了按照店铺筛选，则当前的关键字筛选将只在当前店铺进行筛选，如果想在全部店铺进行筛选，请先点击全部显示按钮";
            div4.style.color = "red";

            var div5 = document.createElement("div");
            var input1 = document.createElement("input");
            input1.placeholder = "支持多个关键字，使用空格分开";
            input1.style.width = "200px";
            var button1 = document.createElement("input");
            button1.type = "button";
            button1.value = "显示包含所有关键字的内容";
            button1.onclick = function () {
                let values = input1.value.split(/\s+/);
                let len = values.length;
                let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                for (let i = 0; i < items.length; i++) {
                    let li = items[i];
                    //注释下面的代码可以使关键字筛选在上面的店铺筛选基础上进行
                    // li.style.display = "list-item";
                    let text = items[i].querySelector("div.p-name").innerText;
                    let b = true;//假设包含所有关键字
                    for (let j = 0; j < len; j++) {
                        let value = values[j];
                        if (!text.includes(value)) {
                            b = false;//有一个关键字不包含
                            break;
                        }
                    }
                    if (b == false) { li.style.display = "none"; }
                    else { li.style.display = "list-item"; }
                }
            }
            var input2 = document.createElement("input");
            input2.placeholder = "支持多个关键字，使用空格分开";
            input2.style.width = "200px";
            var button2 = document.createElement("input");
            button2.type = "button";
            button2.value = "显示包含任何一个关键字的内容";
            button2.onclick = function () {
                let values = input2.value.split(/\s+/);
                let len = values.length;
                let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                for (let i = 0; i < items.length; i++) {
                    let li = items[i];
                    //注释下面的代码可以使关键字筛选在上面的店铺筛选基础上进行
                    // li.style.display = "list-item";
                    let text = items[i].querySelector("div.p-name").innerText;
                    let b = false;//假设不包含任何关键字
                    for (let j = 0; j < len; j++) {
                        let value = values[j];
                        if (text.includes(value)) {
                            b = true;//有一个关键字包含
                            break;
                        }
                    }
                    if (b == false) { li.style.display = "none"; }
                    else { li.style.display = "list-item"; }
                }
            }

            div5.appendChild(input1);
            div5.appendChild(button1);
            div5.appendChild(input2);
            div5.appendChild(button2);



            var div6 = document.createElement("h3");
            div6.innerHTML = "3.按照商品评价数进行筛选";
            var div7 = document.createElement("div");
            var commentArr = ["10万+", "50万+", "100万+", "150万+", "200万+", "250万+", "300万+"];
            for (let i = 0; i < commentArr.length; i++) {
                let a = document.createElement("a");
                a.innerText = commentArr[i];
                a.href = "javascript:void(0);";
                a.style.marginLeft = "25px";
                a.onclick = function () {
                    let links = this.parentNode.querySelectorAll("a");
                    for (let i = 0; i < links.length; i++) {
                        links[i].style.border = "none";
                    }
                    this.style.border = "1px solid red";
                    let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                    let len = items.length;
                    for (let i = 0; i < len; i++) {
                        let li = items[i];
                        li.style.display = "list-item";//先显示出全部商品
                        let commentNode = li.querySelector("div.p-commit > strong > a");
                        //不存在评价节点
                        if (!commentNode) { li.style.display = "none"; }
                        else if (!commentNode.innerText.includes("万+")) {
                            //不包含万+字符串
                            li.style.display = "none";
                        } else {
                            let n1 = parseInt(this.innerText, 10);
                            let n2 = parseInt(commentNode.innerText, 10);
                            if (n1 > n2) {
                                li.style.display = "none";//筛选的数字大于评价的数字
                            }
                        }

                    }
                    return false;
                }
                div7.appendChild(a);
            }
            var div8 = document.createElement("h3");
            div8.innerHTML = "4.按照商品标签进行筛选";
            var div9 = document.createElement("div");
            // var tagArr = ["自营", "京东物流", "放心购", "闪购", "秒杀", "赠", "免邮", "险", "券", "满", "新品"];
            var tagListObj = getTagList();
            tagListObj = tagListObj.tagListObj;
            for (let key in tagListObj) {
                let a = document.createElement("a");
                // a.innerText = key + ("(100)".replace("100", shopListWrapper.shopNameTimes[key]));
                a.innerText = key;
                a.title = tagListObj[key];
                a.href = "javascript:void(0);";
                a.style.marginLeft = "25px";
                a.onclick = function () {
                    let links = this.parentNode.querySelectorAll("a");
                    for (let i = 0; i < links.length; i++) {
                        links[i].style.border = "none";
                    }
                    this.style.border = "1px solid red";
                    let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                    let len = items.length;
                    for (let i = 0; i < len; i++) {
                        let li = items[i];
                        li.style.display = "list-item";//先显示出全部商品
                        let iconNode = li.querySelector("div.p-icons");
                        if (iconNode.innerText.includes(this.innerText)) {
                            li.style.display = "list-item";
                        }
                        else { li.style.display = "none"; }
                    }

                    return false;
                }
                div9.appendChild(a);
            }



            addDiv(div3);
            addDiv(div4);
            addDiv(div5);
            addDiv(div6);
            addDiv(div7);
            addDiv(div8);
            addDiv(div9);
        }
        createShopList();
    }



    if (location.href.includes("https://search.jd.com/Search?keyword=")) {
        var div = document.createElement("div");
        div.id = "ecommerce_filter_wrapper";
        var ecommerce_filter = document.createElement("div");
        ecommerce_filter.id = "ecommerce_filter";
        var button1 = document.createElement("input");
        button1.type = "button";
        button1.value = "重新生成筛选列表";
        button1.onclick = function () {
            document.querySelector("#ecommerce_filter").innerHTML = "";
            setJDHelper();
        }
        div.appendChild(button1);
        div.appendChild(ecommerce_filter);
        document.querySelector("#J_filter").appendChild(div);

    }
    // Your code here...
})();
