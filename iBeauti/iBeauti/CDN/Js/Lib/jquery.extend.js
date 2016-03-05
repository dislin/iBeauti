/// <reference path="../Common.js" />
/// <reference path="jquery-1.7.2.js" />
/// <reference path="jsrender.js" />
/*global alert,$,Enumerable,console,dialog,l,document,
location,Utility,setTimeout,jQuery,require,window,arguments,navigator*/

//#region String.Format
String.Format = function () {
    if (arguments.length === 0) {
        return null;
    }
    var str = arguments[0], i = 1, reg = null;
    for (i = 1; i < arguments.length; i += 1) {
        reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(reg, arguments[i]);
    }
    return str;
};
//#endregion

//#region String.RightPad
String.RightPad = function (obj, str, num) {
    var RtStr = "", i = 0, j = 0,
        tmpStr = "";
    tmpStr += obj;
    for (i = 0; i < num; i += 1) {
        tmpStr += str;
    }
    for (j = 0; j < num; j += 1) {
        RtStr += tmpStr.charAt(j);
    }
    return RtStr;
};
//#endregion

//#region String.LeftPad
String.LeftPad = function (obj, str, num) {
    var objLength = 0, i = 0, j = 0,
        RtStr = "",
        tmpStr = "";
    for (i = 0; i < num; i += 1) {
        tmpStr += str;
    }
    tmpStr += obj;
    objLength = tmpStr.length;
    for (j = 0; j < num; j += 1) {
        RtStr = tmpStr.charAt(objLength - j - 1) + RtStr;
    }
    return RtStr;
};
//#endregion

//#region jQuery extend
(function ($) {
    $.fn.extend({

        //#region serializeJSon
        serializeJSon: function () {
            var formObj$ = $(this),
                jsonArray = formObj$.serializeArray(),
                jsonObj = {},
                i = 0;
            for (i = 0; i < jsonArray.length; i += 1) {
                jsonObj[jsonArray[i].name.toString()] = jsonArray[i].value;
            }

            //console.log(jsonObj);
            jsonObj = JSON.stringify(jsonObj);
            return jsonObj;
        },
        //#endregion

        //#region PopWindow
        PopWindow: function (options) {
            var defaultVal = {
                WindowObject: null,
                IsShow: true,
                IsShowByBrowser: true,
                IsShowByBrowserWidthLimit: true,
                IsSetPosition: false,
                IsFixHorizontal: false,
                InitFunction: null,
                OnClickFunction: null,
                SubmitFunction: null,
                CloseFunction: null,
                SubmitBtn: null,
                CloseBtn: null,
                FocusObj: null,
                ShowSpeed: 0,
                HideSpeed: 0,
                OffsetTop: 0,
                OffsetLeft: 0
            },
                obj = $.extend(defaultVal, options);

            return this.each(function () {
                obj.WindowObject.attr("ispopup", "false");
                if (obj.IsShow) {
                    var Target$ = $(this),
                        targetCoordinates = Target$.offset(),
                        windowObj$ = obj.WindowObject,
                        targetHeight = targetCoordinates.top + Target$.height() + windowObj$.height(),
                        targetWidth = targetCoordinates.left + windowObj$.width(),
                        browserHeight = $(window).height() + $(document).scrollTop(),
                        browserWidth = $(window).width() + $(document).scrollLeft(),
                        closeBtn = obj.CloseBtn,
                        initFlag = 0;

                    windowObj$.css("position", "absolute");
                    windowObj$.css("left", targetCoordinates.left);

                    if(!obj.IsSetPosition) {
                        if (targetHeight >= browserHeight && obj.IsShowByBrowser) {
                            windowObj$.css("top",
                                targetCoordinates.top - windowObj$.height() + obj.OffsetTop
                                );
                        } else {
                            windowObj$.css("top",
                                targetCoordinates.top + Target$.height() + obj.OffsetTop
                                );
                        }

                        if (!obj.IsFixHorizontal) {
                            if (targetWidth >= browserWidth && obj.IsShowByBrowserWidthLimit) {
                                windowObj$.css("left",
                                    targetCoordinates.left - windowObj$.width() + obj.OffsetLeft
                                    );
                            } else {
                                windowObj$.css("left",
                                    targetCoordinates.left + obj.OffsetLeft
                                    );
                            }
                        }
                    } else {
                        windowObj$.css("top", obj.OffsetTop);
                        if (!obj.IsFixHorizontal) {
                            windowObj$.css("left", obj.OffsetLeft);
                        }
                    }

                    if (obj.InitFunction && typeof obj.InitFunction === "function" && Number(initFlag) === 0) {
                        obj.InitFunction();
                        initFlag += 1;
                    }

                    if (obj.SubmitBtn) {
                        obj.SubmitBtn.removeAttr("disabled");
                        obj.SubmitBtn.unbind("click").bind("click", function () {
                            if (obj.SubmitFunction && typeof obj.SubmitFunction === "function") {
                                $.when(obj.SubmitFunction()).done(function () {
                                    obj.SubmitBtn.attr("disabled", "disabled");
                                    windowObj$.fadeOut(obj.HideSpeed);
                                    windowObj$.attr("ispopup", "false");
                                    initFlag = 0;
                                });
                            }
                        });
                    }

                    windowObj$.fadeIn(obj.ShowSpeed);
                    windowObj$.attr("ispopup", "true");
                    if (obj.FocusObj) {
                        obj.FocusObj.focus();
                    }

                    if (obj.OnClickFunction && typeof obj.OnClickFunction === "function") {
                        obj.OnClickFunction();
                    }

                    if (closeBtn) {
                        closeBtn.one("click", function () {
                            windowObj$.fadeOut(obj.HideSpeed);
                            windowObj$.attr("ispopup", "false");
                            initFlag = 0;
                            if (obj.CloseFunction && typeof obj.CloseFunction === "function") {
                                obj.CloseFunction();
                            }
                        });
                    }

                } else {
                    obj.WindowObject.fadeOut(obj.HideSpeed);
                    obj.WindowObject.attr("ispopup", "false");
                    initFlag = 0;
                }
            });
        },
        //#endregion

        hasHide: function () {
            var $Dom = $(this);
            return ($Dom.css("display").toString().toLowerCase() === "none");
        }
    });
})(jQuery);
//#endregion

//#region TmplHelper
// use ajax to request the tmpl, need to use with client side template
var TmplHelper = {
    Instance: function () {
        var tmplHelper = {},
            transferType = "Post",
            paramData = null;

        tmplHelper.url = "";

        tmplHelper.tag = "";

        tmplHelper.setType = function (t) {
            transferType = t;
        };

        tmplHelper.getTmpl = function () {
            var html = "", that = this;
            if (transferType.toString().toLowerCase() === "post") {
                paramData = JSON.stringify({ Tag: that.tag });
            } else {
                paramData = "Tag=" + that.tag;
            }
            Utility.service(this.url, paramData,
                { type: transferType, cache: false, dataType: "html", async: false },
                function (data) {
                    html = data;
                });
            return html;
        };

        return tmplHelper;
    }
};
//#endregion

//#region PagerHelper
// produce drop down list pagination
var PagerHelper = {
    TotalPage: 1,
    CurrentPage: 1,
    PageDomId: "Pager",
    PageDomClass: "combo fr",
    TargetObject: null, //set pagination in this object
    Instance: function () {
        var pg = {};

        //#region Set Property
        pg.SetTotalPage = function (v) {
            PagerHelper.TotalPage = Number(v);
        };

        pg.SetCurrentPage = function (v) {
            PagerHelper.CurrentPage = Number(v);
        };

        pg.SetPageDomId = function (v) {
            PagerHelper.PageDomId = v.toString();
        };

        pg.SetPageDomClass = function (v) {
            PagerHelper.PageDomClass = v.toString();
        };

        pg.SetTargetObject = function ($v) {
            PagerHelper.TargetObject = $v;
        };
        //#endregion

        pg.GetDropDownList = function () {
            var pgnum = 1,
                tmpl = "",
                isSelected = "",
                pageText = "";

            if (Number(PagerHelper.TotalPage) > 1 && PagerHelper.TargetObject) {
                tmpl += String.Format("<select Id='{0}' class='{1}'>",
                    PagerHelper.PageDomId, PagerHelper.PageDomClass);

                for (pgnum; pgnum <= PagerHelper.TotalPage; pgnum += 1) {
                    if (Number(PagerHelper.CurrentPage) === Number(pgnum)) {
                        isSelected = "selected='selected'";
                    } else {
                        isSelected = "";
                    }
                    pageText = String.Format(l.PaginationNumber, pgnum, PagerHelper.TotalPage);
                    tmpl += String.Format("<option {0} value='{1}'>{2}</option>",
                        isSelected, pgnum, pageText);
                }
                tmpl += "</select>";
            }
            PagerHelper.TargetObject.html(tmpl);
        };
        return pg;
    }
};
//#endregion

//#region LogHelper object
//this function is print the log in console of browser, below IE9 not support
//please remember to remove after debug, because it will popup error in IE
//ex: LogHelper.Info("xxx").print();
var LogHelper = {
    Message: null,
    Info: function (message) {
        var me = {},
            roots = this;
        roots.Message = message;

        me.getDateTime = function () {
            var dt = new Date();
            return dt;
        };

        me.print = function () {
            var dt = this.getDateTime(),
                msg = String.Format("log info::{0} - {1}-{2}",
                    roots.Message,
                    Utility.GetDateTime_yyyyMMdd_HHmmss(dt, "-"),
                    dt.getMilliseconds());
            console.log(msg);
        };

        return me;
    }
};
//#endregion

//#region EventHelper
function EventHelper() {
    var instance;
    EventHelper = function EventHelper() {
        return instance;
    };
    EventHelper.prototype = this;
    instance = new EventHelper();
    instance.constructor = EventHelper;
    return instance;
};

EventHelper.prototype.factory = function (type) {
    var constr = type,
        myevent;

    if (typeof this[constr] !== "function") {
        throw new Error(constr.toString() + " doesn't exist in Event");
    }
    myevent = new this[constr]();
    return myevent;
};
//#endregion

//#region Myfunction
//this one is a function base, can not inherit this one
var MyFunction = {

    //#region inherit
    inherit: function (_child, _parent) {
        var _tempObj = function () { };
        _tempObj.prototype = _parent.prototype;
        _child.prototype = new _tempObj();
        _child.superclassical = _parent.superclassical || _parent.prototype;
        _child.prototype.constructor = _child;
    },
    //#endregion

    //#region isExist
    isExist: function (_val) {
        if (_val === null || _val === undefined) {
            return false;
        } else {
            return true;
        }
    },
    //#endregion

    //#region extend
    extend: function (_parent, _child) {
        var p;
        _child = _child || {};
        for (p in _parent) {
            if (_parent.hasOwnProperty(p)) {
                _child[p] = _parent[p];
            }
        }
        return _child;
    },
    //#endregion

    //#region extendAll
    extendAll: function (_parent, _child) {
        var p,
            toStr = Object.prototype.toString,
            astr = "[object Array]";
        _child = _child || {};
        for (p in _parent) {
            if (_parent.hasOwnProperty(p)) {
                if (typeof _parent[p] === "object") {
                    _child[p] = (toStr.call(_parent[p]) === astr) ? [] : {};
                    this.extendAll(_parent[p], _child[p]);
                } else {
                    _child[p] = _parent[p];
                }
            }
        }
        return _child;
    },
    //#endregion

    //#region validator
    validator: {
        types: {},
        messages: [],
        config: {},
        isUserMessage: false,
        userMessageFunction: null,
        validate: function (_data) {
            var i, msg, type, checker, result;
            this.messages = [];

            for (i in _data) {

                if (i.toString() === "constructor") {
                    continue;
                }

                type = this.config[i];
                checker = this.types[type];

                if (!type) {
                    continue;
                }

                if (!checker) {
                    msg = String.Format("No handle this kind of validation: {0}", type.toString());
                    throw new Error(msg);
                }

                result = checker.validate(_data[i]);
                if (!result) {
                    msg = String.Format("InValid value for {0}, Error Message: {1}, Constructor: {2}\n",
                        i.toString(),
                        checker.instructions.toString(),
                        MyFunction.getConstructorName(_data));
                    this.messages.push(msg);
                }
            }
            return this.hasErrors();
        },
        hasErrors: function () {
            if (this.messages.length !== 0 && !this.isUserMessage) {
                throw new Error(this.messages.join("\n"));
            }
            if (this.messages.length !== 0 && this.isUserMessage) {
                if (typeof this.userMessageFunction === "function") {
                    this.userMessageFunction(this.messages.join("\n"));
                } else {
                    alert(this.messages.join("\n"));
                }
            }
        }
    },
    //#endregion

    //#region getBrowserVersion
    getBrowserVersion: function () {
        var txtBrowserName = "",
            intArrayIndex = 0,
            isValid = true,
            objBrowser = null;

        for (txtBrowserName in myBrowserVersion) {
            objBrowser = myBrowserVersion[txtBrowserName];
            if (objBrowser !== undefined || objBrowser !== null) {
                if (objBrowser.Key instanceof Array) {
                    isValid = true;
                    for (intArrayIndex = 0; intArrayIndex < objBrowser.Key.length; intArrayIndex += 1) {
                        if (navigator.userAgent.search(objBrowser.Key[intArrayIndex]) <= -1) {
                            isValid = false;
                        }
                    }

                    if (isValid) {
                        return objBrowser.Value;
                    }
                } else {
                    if (navigator.userAgent.search(objBrowser.Key) > -1) {
                        return objBrowser.Value;
                    }
                }
            }
        }

        return "other";
    },
    //#endregion

    //#region getConstructorName
    getConstructorName: function (obj) {
        var browser = this.getBrowserVersion(),
            reg = /\s{2,}/g,
            strConstructor = obj.constructor.toString().replace(reg, " "),
            arrConstructor = [],
            arrSubConstructor = [];
        if (browser.toString().indexOf("ie") > -1) {
            arrConstructor = strConstructor.split("(");
            if (arrConstructor[0].length > 0) {
                arrSubConstructor = arrConstructor[0].split("function ");
                return arrSubConstructor[1];
            }
        } else {
            return obj.constructor.name;
        }
    },
    //#endregion

    //#region mySession
    mySession: {
        set: function (txtKey, oValue) {
            if (!this.isSupportHTML5() || MyFunction.getBrowserVersion() === myBrowserVersion.Safari.Value) {
                $.jStorage.set(txtKey, JSON.stringify(oValue))
            } else {
                localStorage.setItem(txtKey, JSON.stringify(oValue));
            }
        },

        get: function (txtKey) {
            var oValue = null, txt;

            if (!this.isSupportHTML5()) {
                oValue = $.jStorage.get(txtKey) != null ? jQuery.parseJSON($.jStorage.get(txtKey)) : null;
            } else {
                oValue = localStorage[txtKey] != null ? jQuery.parseJSON(localStorage[txtKey]) : null;
            }
            return oValue;
        },

        clearAll: function () {
            if (!this.isSupportHTML5()) {
                $.jStorage.flush();
            } else {
                localStorage.clear();
            }
        },

        removeItem: function (txtKey) {
            if (!this.isSupportHTML5()) {
                $.jStorage.deleteKey(txtKey);
            } else {
                localStorage.removeItem(txtKey);
            }
        },

        isSupportHTML5: function () {
            var txtBrowserVersion = MyFunction.getBrowserVersion();
            if (txtBrowserVersion == myBrowserVersion.IE6.Value || txtBrowserVersion == myBrowserVersion.IE7.Value) {
                if ($.jStorage == null) {
                    new Error("Your browser not support HTML5, please use Chrome or FireFox, or import jStorage.js in your IE.")
                }
                return false;
            } else {
                return true;
            }
        }
    },
    //#endregion

    //#region formatHelper
    formatHelper: {

        //#region decimal
        decimal: function (num) {
            if (isNaN(num) && num != 0) {
                throw Error("Please enter a number. Data type should be Number");
            }
            num = num.toFixed(5);
            num = parseFloat(num);
            num = Math.floor((num * 1000).toFixed(5)) / 1000; // truncate and get first 3 decimal, 3.66666666 -> 3.666
            num = num + "";

            if (num.indexOf(".") != -1) {
                if (num.substr(-1) == "0") { num = num.slice(0, -1); }
                if (num.substr(-1) == "0") { num = num.slice(0, -1); }
                if (num.substr(-1) == "0") { num = num.slice(0, -1); }
                if (num.substr(-1) == "0") { num = num.slice(0, -1); }
                if (num.substr(-2) == ".0") { num = num.slice(0, -2); }
            }

            return num;
        },
        //#endregion

        //#region dateTime
        dateTime: function (dt, sign) {
            var txtDt = "",
                dtTime = null;
            if (typeof (dt) !== "object") {
                throw Error("Please check your data type should be Date");
            }

            if (sign === "" || sign === undefined || sign === null) {
                sign = "/"
            }

            dtTime = new Date(dt);
            txtDt = dtTime.getFullYear() + sign + String.LeftPad((dtTime.getMonth() + 1), "0", 2) + sign + String.LeftPad(dtTime.getDate(), "0", 2) + " " + String.LeftPad(dtTime.getHours(), "0", 2) + ":" + String.LeftPad(dtTime.getMinutes(), "0", 2) + ":" + String.LeftPad(dtTime.getSeconds(), "0", 2);
            return txtDt;
        },
        //#endregion

        //#region AddCommaToNumber
        addCommaToNumber: function (number, noOfDecimal) {
            number += "";
            number = number.replace(/\,/g, ""); // remove comma first
            number = parseFloat(number); // make sure is float
            //number = number.toFixed(2); // round up down, not truncate
            number = Utility.RoundNumber(number, 2);
            number += "";

            if (number.indexOf(".") != -1) { // contains .
                if (noOfDecimal == undefined || noOfDecimal == 0) { // no specify noOfDecimal, default is 0
                    number = number.split(".")[0];
                }
                else { // contains . and has specified noOfDecimal
                    number += "000"; // added 3 more zero behind, so if number is 1.8 and noOfDecimal is 2, it will return 1.80
                    number = number.split(".")[0] + "." + number.split(".")[1].substr(0, noOfDecimal);
                }
            }
            else {
                if (noOfDecimal > 0) {
                    number += ".000"; // added 3 more zero behind, so if number is 1.8 and noOfDecimal is 2, it will return 1.80
                    number = number.split(".")[0] + "." + number.split(".")[1].substr(0, noOfDecimal);
                }
            }

            x = number.split(".");
            x1 = x[0];
            x2 = x.length > 1 ? "." + x[1] : "";
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, "$1" + "," + "$2");
            }
            return x1 + x2;
        },
        //#endregion


        //#region isDateTime
        isDateTime: function (datetime) {
            //correct format is yyyy/mm/dd hh:MM:ss or yyyy/mm/dd
            var oMatches1 = /^(\d{4})[-\/](\d{2})[-\/](\d{2}) (\d{2})[:](\d{2})[:](\d{2})$/.exec(datetime),
                oMatches2 = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(datetime),
                isValid = false;

            if (oMatches1 != null) {
                isValid = true;
            }

            if (oMatches2 != null) {
                isValid = true;
            }

            return isValid;
        }
        //#endregion
    },
    //#endregion

    //#region foumulaHelper
    formulaHelper: function () {
        var me = {};

        //#region factorial
        me.factorial = function (num) {
            var that = this;
            if (num == 1 || num == 0) {
                return 1;
            } else {
                return num * that.factorial(num - 1);
            }
        };
        //#endregion

        //#region permutation
        me.permutation = function (num1, num2) {
            var that = this;
            return (that.factorial(num1) / that.factorial((num1 - num2)));
        };
        //#endregion

        //#region combination
        me.combination = function (num1, num2) {
            var that = this;
            return (that.permutation(num1, num2) / that.factorial(num2));
        };
        //#endregion

        return me;
    }
    //#endregion
    
};

var myBrowserVersion = {
    IE6: {
        Key: "MSIE 6",
        Value: "ie6"
    },

    IE7: {
        Key: "MSIE 7",
        Value: "ie7"
    },

    IE8: {
        Key: "MSIE 8",
        Value: "ie8"
    },

    IE9: {
        Key: "MSIE 9",
        Value: "ie9"
    },

    IE10: {
        Key: "MSIE 10",
        Value: "ie10"
    },

    IE11: {
        Key: ["Trident", "rv:11.0"],
        Value: "ie11"
    },

    Chrome: {
        Key: ["Chrome", "Safari"],
        Value: "chrome"
    },

    Firefox: {
        Key: "Firefox",
        Value: "firefox"
    },

    Safari: {
        Key: "Safari",
        Value: "safari"
    },

    Opera: {
        Key: "Opera",
        Value: "opera"
    }
};

var mySessionTopic = {
    ch_isHot: "ch_isHot",
    cn_emStock: "cn_emStock",
    urlHistory_list: "urlHistory_list"
};

//#region MyFunction.validator.type extend
// when add new validation extend, please don't forget add new one in enum
var EnumValidation = {
    isExist: "isExist",
    isNumber: "isNumber",
    isBoolean: "isBoolean",
    isEmpty: "isEmpty",
    isSevenStarNumber: "isSevenStarNumber",
    isSevenStarNumberEnum: "isSevenStarNumberEnum",
    isSevenStarThousandNumber: "isSevenStarThousandNumber",
    isSevenStarHundredNumber: "isSevenStarHundredNumber",
    isSevenStarTenNumber: "isSevenStarTenNumber",
    isSevenStarUnitNumber: "isSevenStarUnitNumber"
};

MyFunction.validator.types.isExist = {
    validate: function (_val) {
        //exist is mean the value can not equal null or undefined
        if (_val == null) {
            return false;
        } else {
            return true;
        }
    },
    instructions: "the value cannot be null or empty"
};

MyFunction.validator.types.isNumber = {
    validate: function (_val) {
        return !isNaN(_val);
    },
    instructions: "the value must be number"
};

MyFunction.validator.types.isBoolean = {
    validate: function (_val) {
        return (typeof _val === "boolean");
    },
    instructions: "the value must be boolean"
};

MyFunction.validator.types.isEmpty = {
    validate: function (_val) {
        return (_val.toString() !== "");
    },
    instructions: "the value is empty"
};

MyFunction.validator.types.isSevenStarNumberEnum = {
    validate: function (_val) {
        if (_val === "thousand" || _val === "hundred" || _val === "ten" || _val === "unit") {
            return true;
        } else {
            return false;
        }
    },
    instructions: "the value is not seven star enum number format"
};

MyFunction.validator.types.isSevenStarNumber = {
    validate: function (_val) {
        if (!isNaN(_val) && Number(_val) >= -1 && Number(_val) <= 9) {
            return true;
        } else {
            return false;
        }
    },
    instructions: "the value is not seven star number format"
};

MyFunction.validator.types.isSevenStarThousandNumber = {
    validate: function (_val) {
        if (MyFunction.getConstructorName(_val) === "SevenStarNumber" && _val.type === "thousand") {
            return true;
        } else {
            return false;
        }
    },
    instructions: "the value is not seven star number format (Thousand)"
};

MyFunction.validator.types.isSevenStarHundredNumber = {
    validate: function (_val) {
        if (MyFunction.getConstructorName(_val) === "SevenStarNumber" && _val.type === "hundred") {
            return true;
        } else {
            return false;
        }
    },
    instructions: "the value is not seven star number format (Hundred)"
};

MyFunction.validator.types.isSevenStarTenNumber = {
    validate: function (_val) {
        if (MyFunction.getConstructorName(_val) === "SevenStarNumber" && _val.type === "ten") {
            return true;
        } else {
            return false;
        }
    },
    instructions: "the value is not seven star number format (Ten)"
};

MyFunction.validator.types.isSevenStarUnitNumber = {
    validate: function (_val) {
        if (MyFunction.getConstructorName(_val) === "SevenStarNumber" && _val.type === "unit") {
            return true;
        } else {
            return false;
        }
    },
    instructions: "the value is not seven star number format (Unit)"
};

//#endregion

//#endregion

//#region RenderData Object
function RenderData() { };

RenderData.prototype = {
    url: null,
    response: null, //ex: $("#SearchForm").serializeJSon()
    responsetype: "POST",
    iscache: false,
    datacontentType: "application/json; charset=utf-8",
    requestType: "json",
    isasync: false,
    successFunction: null,
    failFunction: null,
    isConvertJson: false,
    dataSource: null,
    validationConfig: function () {
        var v1 = EnumValidation.isExist,
            v2 = EnumValidation.isBoolean,
            v = {
                url: v1,
                responsetype: v1,
                iscache: v2,
                datacontentType: v1,
                requestType: v1,
                isasync: v2,
                isConvertJson: v2
            };
        return v;
    },
    getData: function () {
        var my = this, datasource = null;
        MyFunction.validator.config = my.validationConfig();
        MyFunction.validator.validate(my);

        Utility.service(
                my.url,
                my.response,
                {
                    type: my.responsetype,
                    cache: my.iscache,
                    contentType: my.datacontentType,
                    dataType: my.requestType,
                    async: my.isasync
                },
                function (data) {
                    var Dfd = $.Deferred(), getdata = null;
                    //assign isConvertJson = true, if want to convert string to json format
                    if (my.isConvertJson) {
                        data = $.parseJSON(data);
                    }
                    getdata = function (dfd) {
                        if (data) {
                            datasource = data;
                            my.dataSource = datasource;
                            dfd.resolve();
                        } else {
                            dfd.reject();
                        }
                    };

                    $.when(getdata(Dfd)).done(function () {
                        if (typeof my.successFunction === "function") {
                            my.successFunction();
                        }
                    }).fail(function () {
                        if (typeof my.failFunction === "function") {
                            my.failFunction();
                        }
                    });
                },
                function () {
                    my.failFunction();
                });
    }

};

RenderData.prototype.constructor = RenderData;
//#endregion

//#region RenderTmpl Object
function RenderTmpl() { };

RenderTmpl.prototype = {
    url: null,
    transferType: "POST",
    dataTag: null,
    dataSource: null,
    requestType: "html",
    iscache: false,
    isasync: false,
    validationConfig: function () {
        var v1 = EnumValidation.isExist,
            v2 = EnumValidation.isBoolean,
            v = {
                url: v1,
                dataTag: v1,
                transferType: v1,
                requestType: v1,
                iscache: v2,
                isasync: v2
            };

        return v;
    },
    getTmpl: function () {
        var my = this, parameter = null;
        MyFunction.validator.config = my.validationConfig();
        MyFunction.validator.validate(my);

        if (my.transferType.toString().toLowerCase() === "post") {
            parameter = JSON.stringify({ Tag: my.dataTag });
        } else {
            parameter = "Tag=" + my.dataTag;
        }
        Utility.service(my.url, parameter,
        { type: my.transferType, cache: my.iscache, dataType: my.requestType, async: my.isasync },
        function (data) {
            my.dataSource = data;
        });
    }
};

RenderTmpl.prototype.constructor = RenderTmpl;
//#endregion

//#region RenderObject
function RenderObject() { };

RenderObject.prototype = {
    displayID: null,
    initFunction: null, //before render callback
    successFunction: null,
    failFunction: null,
    render: function (dataitem, tmplitem) {
        var errmsg = [], my = this,
            displayDOM = $("#" + my.displayID), content,
            _tmpl = null,
            _data = null,
            renderData = null,
            Dfd = $.Deferred();

        if (typeof my.displayID !== "string") {
            errmsg.push("Please set displayID, and displayID only allow string format.");
        }

        if ((!dataitem.constructor.superclassical && MyFunction.getConstructorName(dataitem) !== "RenderData") ||
                (dataitem.constructor.superclassical && MyFunction.getConstructorName(dataitem.constructor.superclassical) !== "RenderData")) {
            errmsg.push("Please set RenderData Object");
        }

        if ((!tmplitem.constructor.superclassical && MyFunction.getConstructorName(tmplitem) !== "RenderTmpl") ||
                (tmplitem.constructor.superclassical && MyFunction.getConstructorName(tmplitem.constructor.superclassical) !== "RenderTmpl")) {
            errmsg.push("Please set RenderTmpl Object");
        }

        if (errmsg.length > 0) {
            throw new Error(errmsg.join("\n"));
        }

        if (typeof my.initFunction === "function") {
            my.initFunction();
        }

        content = $.templates(tmplitem.dataSource);
        if (!dataitem.dataSource || dataitem.dataSource.length <= 0) {
            displayDOM.html(content.render());
        }
        else {
            renderData = function (dfd) {
                displayDOM.html(content.render(dataitem.dataSource));
                dfd.resolve();
                return dfd;
            };

            $.when(renderData(Dfd)).done(function () {
                if (typeof my.successFunction === "function") {
                    my.successFunction();
                }
            }).fail(function () {
                if (typeof my.failFunction === "function") {
                    my.failFunction();
                }
            });
        }

    }
};
RenderObject.prototype.constructor = RenderObject;
//#endregion

//#region SoundSetting
function SoundSetting(txtId, txtSrc, intWidth, intHeight) {
    this.id = txtId;
    this.src = txtSrc;
    
//    if(isAutoStart != null) {
//        this.autostart = isAutoStart;
//    }

    if(intWidth != null) {
        this.width = intWidth;
    }

    if(intHeight != null) {
        this.height = intHeight;
    }

    this.validation();
}

SoundSetting.prototype = {
    id: "",
    src: "",
    autostart: false,
    width: 1,
    height: 1,
    validation: function () {
        var roots = this,
            v = {
                id: EnumValidation.isExist,
                src: EnumValidation.isExist,
                //autostart: EnumValidation.isBoolean,
                width: EnumValidation.isNumber,
                height: EnumValidation.isNumber
            };
            MyFunction.validator.config = v;
            MyFunction.validator.validate(roots);
    }
};
SoundSetting.prototype.constructor = SoundSetting;
//#endregion

//#region SoundService
function SoundService(soundSetting) {
    var txtSettingName = "";
    if(soundSetting == null){
        new Error("SoundSetting can not be null or undefined in SoundService");
    }

    txtSettingName = MyFunction.getConstructorName(soundSetting);
    if(txtSettingName != "SoundSetting"){
        new Error("soundSetting should be use 'SoundSetting' type in SoundService");
    } else{
        this.setting = soundSetting;
    }
}

SoundService.prototype = {
    setting: null,
    browserVersion: MyFunction.getBrowserVersion(),
    create: function() {
    var roots = this,
        oAudioElement = null,
        me = {};

        me.init = function(){
            if(roots.browserVersion.indexOf("ie") > -1) {
                oAudioElement = document.createElement('embed');
                for(var prop in roots.setting){
                    if(typeof roots.setting[prop] != "object" && typeof roots.setting[prop] != "function") {
                        oAudioElement.setAttribute(prop, roots.setting[prop]);
                    }
                }

                if ($("#" + roots.setting.id).length <= 0) {
                    oAudioElement.setAttribute("autostart", true);
                    $("body").append(oAudioElement);
                } else{
                    $("#" + roots.setting.id).attr("autostart", false);
                    this.play();
                }
            } else{
                oAudioElement = document.createElement('audio');
                for(var prop in roots.setting){
                    if(typeof roots.setting[prop] != "object" && typeof roots.setting[prop] != "function") {
                        if(prop == "autostart"){
                            //oAudioElement.setAttribute("autoplay", roots.setting[prop] ? "autoplay" : roots.setting[prop]);
                        } else {
                            oAudioElement.setAttribute(prop, roots.setting[prop]);
                        }
                    }
                }
                //oAudioElement.setAttribute("preload", "auto");
                if ($("#" + roots.setting.id).length <= 0) {
                    $("body").append(oAudioElement);
                    this.play();
                } else{
                    //$("#" + roots.setting.id).removeAttr("autoplay", false);
                    this.play();
                }
            }
        };

        me.play = function(){
            if($("#" + roots.setting.id).length > 0) {
               document.getElementById(roots.setting.id).play();
            }
        };

        return me;
    }
};
SoundService.prototype.constructor = SoundService;
//#endregion

//#region myCurry
function myCurry() { }

myCurry.prototype = {
    init: function (fn) {
        var oSlice = Array.prototype.slice,
            saveArgs = oSlice.call(arguments, 1);
        return function () {
            var newArgs = oSlice.call(arguments),
                oArgs = saveArgs.concat(newArgs);
            return fn.apply(null, oArgs);
        };
    }
};

myCurry.prototype.constructor = myCurry;

//#endregion