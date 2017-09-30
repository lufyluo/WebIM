var C;
var M;
var basepicurl = "http://116.62.232.164:9898/picimage/";
var defaultImage = "/Img/WebIM/Manager_UserImg_Default.jpg";
var webapi;
var maxlogin = 3;
var nowlogin = 0;
var Me = {};
var enterprise = "";
var dragObject = "";


$(document).ready(function () {
    tab_click();
    Form_move();
    prompt_show();
    member_show();
    creategroup();
    min();
    chatWindowMin();
    Me["userid"] = $("#Manager-wrap").attr("userid");
    enterprise = $("#Manager-user-name").text().split('_')[0] + "_";
    $("#Manager-user-name").text($("#Manager-user-name").text().split('_')[1]);
    M = new Manager();
    M.SetFriendsBox("#Manager-contactbox");
    M.SetGroupsBox("#Manager-groupbox");
    M.SetMessagePromptBox(".Manager-msg-prompt-box");
    M.SetMessagePromptMinBox("#Manager-prompt-box-details-min");
    M.SetFriendsSelectitemBox(".Manager-friends-selectbox-friendbox");
    M.SetFriendsSelectedBox(".Manager-friends-selectbox-selected ul");
    M.SetFriendsSelectedSurebtn(".Manager-friends-selectbox-sure");
    M.SetFriendsSelectedClosebtn(".Manager-friends-selectbox-close");
    M.SetFriendsSelectTitleBox(".Manager-friends-selectbox-title");
    M.SetFriendsSelectBox("#Manager-friends-selectbox");
    M.Config.FriendsView = function (data) {
        if (data.userid !== Me.userid) {
            if (data.userid !== null && typeof (data.userid) !== "undefined" && data.userid != "") {
                //用户
                var view = '<div class="Manager-group Manager-contact">' +
                    ' <img class="img-circle pull-left" width="40" height="40" style="margin:5px" src="{0}" />' +
                    ' <div style="margin-left:50px;margin-top:5px;">{1}</div> ' +
                    ' <div class="Manager-sign" style="margin-left:50px;margin-top:2px;">{2}</div> ' +
                    '</div >';
                view = view.replace("{0}", data.PicName == null ? defaultImage : basepicurl + data.PicName);
                view = view.replace("{1}", data.userid + "(" + data.username + ")");
                view = view.replace("{2}", data.job);
                return { view: view, isFriend: true, parent: data.parent, id: data.Hxid };
            }
            else {
                //分类
                var view = '<div class="Manager-group">' +
                    '<span class="glyphicon glyphicon-menu-right" ></span >' +
                    '<span>{0}</span>' +
                    '</div >';
                view = view.replace("{0}", data.name);
                return { view: view, parent: data.parent, id: data.id };
            }
        }
        else {
            Me = data;
            M.SetMe(data);
            $("#Manager-user-bm").text(Me.job);
            $("#Manager-user-img").attr("src", Me.PicName == null ? defaultImage : basepicurl + Me.PicName);
            $("#Manager-user-img-min").attr("src", Me.PicName == null ? defaultImage : basepicurl + Me.PicName);
            $("#Manager-user-name").html(Me.username);
        }
    }
    M.Config.FriendsSelectedView = function (data) {
        var view = '<li>' +
            ' <img class="img-circle" width= "35" src= "{0}" />' +
            '<br />' +
            '<span>{1}</span>' +
            '</li>';
        view = view.replace("{0}", data.PicName == null ? defaultImage : basepicurl + data.PicName);
        view = view.replace("{1}", data.username);
        return { view: view };
    }
    M.Config.Friends_Selected = function (id, data) {
        if (id == "CreateGroup") {
            var s = "";
            data.forEach(function (v, k, m) {
                s += k + ",";
            });
            $("#groupmember").val(s);
        }
    }
    M.Config.FriendsView_Click = function (data) {
        C.AddListItem(data);
    }
    M.Config.FriendsClass_Click = function (view) {
        if ($(view).children(".glyphicon").hasClass("glyphicon-menu-right")) {
            $(view).children(".glyphicon").removeClass("glyphicon-menu-right");
            $(view).children(".glyphicon").addClass("glyphicon-menu-down");
        }
        else {
            $(view).children(".glyphicon").removeClass("glyphicon-menu-down");
            $(view).children(".glyphicon").addClass("glyphicon-menu-right");
        }
    }
    M.Config.GroupsView = function (data) {
        var view = '<div class="Manager-group Manager-contact">' +
            ' <img class="img-circle pull-left" width="40" height="40" style="margin:5px" src="{0}" />' +
            ' <div style="margin-left:50px;margin-top:5px;">{1}</div> ' +
            ' <div class="Manager-sign" style="margin-left:50px;margin-top:2px;"></div> ' +
            '</div >';
        view = view.replace("{0}", data.PicName == null ? defaultImage : basepicurl + data.PicName);
        view = view.replace("{1}", data.groupname);
        return { view: view, isGroup: true, id: data.groupid };
    }
    M.Config.GroupsView_Click = function (data) {
        data["isGroup"] = true;
        C.AddListItem(data);
    }
    M.Config.GroupsClass_Click = function (view) {
        if ($(view).children(".glyphicon").hasClass("glyphicon-menu-right")) {
            $(view).children(".glyphicon").removeClass("glyphicon-menu-right");
            $(view).children(".glyphicon").addClass("glyphicon-menu-down");
        }
        else {
            $(view).children(".glyphicon").removeClass("glyphicon-menu-down");
            $(view).children(".glyphicon").addClass("glyphicon-menu-right");
        }
    }
    M.Config.MessagePromptView = function (data) {
        $(".Manager-msg-number").html(data.allcount);
        $(".Manager-msg-number").show();
        if (data.isFriend) {
            var view = '<div class="Manager-contact">' +
                '<img class="img-circle pull-left" width= "30" height= "30" style= "margin:5px" src= "{0}" >' +
                '  <div class="pull-left msg-Prompt-only" style="margin-top:5px;">{1}</div>' +
                ' <div style="max-width:90px;height:20px;overflow: hidden; " class="Manager-sign pull-left">{2}</div>' +
                ' <div class="Manager-msg-number img-circle" style="margin-top:10px;">{3}</div>' +
                ' </div >';
            view = view.replace("{0}", data.Friend.PicName == null ? defaultImage : basepicurl + data.Friend.PicName);
            view = view.replace("{1}", data.Friend.username);
            view = view.replace("{2}", data.Friend.job);
            view = view.replace("{3}", data.count);
            try {
                data.Friend.msg.push({ id: data.id, isFriend: data.isFriend, text: data.text, time: data.time });
            }
            catch (ex) {
                data.Friend["msg"] = new Array();
                data.Friend.msg.push({ id: data.id, isFriend: data.isFriend, text: data.text, time: data.time });
            }
            return { view: view }
        }
        else if (data.isGroup) {
            var view = '<div class="Manager-contact">' +
                '<img class="img-circle pull-left" width= "30" height= "30" style= "margin:5px" src= "{0}" >' +
                '  <div class="pull-left" style="margin-top:5px;">{1}</div>' +
                ' <div style="max-width:90px;height:20px;overflow: hidden; " class="Manager-sign pull-left">{2}</div>' +
                ' <div class="Manager-msg-number img-circle" style="margin-top:10px;">{3}</div>' +
                ' </div >';
            view = view.replace("{0}", data.Group.PicName == null ? defaultImage : basepicurl + data.Group.PicName);
            view = view.replace("{1}", data.Group.groupname);
            view = view.replace("{2}", data.from.username + "发来消息");
            view = view.replace("{3}", data.count);
            try {
                data.Group.msg.push({ id: data.id, isGroup: true, text: data.text, time: data.time, from: data.from });
            }
            catch (ex) {
                data.Group["msg"] = new Array();
                data.Group.msg.push({ id: data.id, isGroup: true, text: data.text, time: data.time, from: data.from });
            }
            return { view: view }
        }
    }
    M.Config.MessagePromptMinView = function (data) {
        $("#Manager-prompt-box-titile-min").html("你有" + data.allcount + "条新的消息");
        if (data.isFriend) {
            var view = '<li class="Manager-contact">' +
                '<img class="img-circle pull-left" width= "30" height= "30" style= "margin:5px" src= "{0}" >' +
                '  <div class="pull-left" style="margin-top:5px;">{1}</div>' +
                ' <div class="Manager-msg-number img-circle" style="margin-top:10px;">{3}</div>' +
                ' </li >';
            view = view.replace("{0}", data.Friend.PicName == null ? defaultImage : basepicurl + data.Friend.PicName);
            view = view.replace("{1}", data.Friend.username);
            view = view.replace("{3}", data.count);
            return { view: view }
        }
        else if (data.isGroup) {
            var view = '<li class="Manager-contact">' +
                '<img class="img-circle pull-left" width= "30" height= "30" style= "margin:5px" src= "{0}" >' +
                '  <div class="pull-left" style="margin-top:5px;">{1}</div>' +
                ' <div class="Manager-msg-number img-circle" style="margin-top:10px;">{3}</div>' +
                ' </li >';
            view = view.replace("{0}", data.Group.PicName == null ? defaultImage : basepicurl + data.Group.PicName);
            view = view.replace("{1}", data.Group.groupname);
            view = view.replace("{3}", data.count);
            try {
                data.Group.msg.push({ id: data.id, isGroup: true, text: data.text, time: data.time, from: data.from });
            }
            catch (ex) {
                data.Group["msg"] = new Array();
                data.Group.msg.push({ id: data.id, isGroup: true, text: data.text, time: data.time, from: data.from });
            }
            return { view: view }
        }
    }
    M.Config.MessagePromptView_Click = function (data) {
        $(".Manager-msg-number").html(data.allcount);
        $("#Manager-prompt-box-titile-min").html("你有" + data.allcount + "条新的消息");
        if (data.allcount == 0) {
            $(".Manager-msg-number").hide();
            $("#Manager-prompt-box-titile-min").html("没有新的消息");
        }
        if (data.isFriend) {
            C.AddListItem(data.Friend);
        }
        else if (data.isGroup) {
            data.Group["isGroup"] = true;
            C.AddListItem(data.Group);
        }
    }
    C = new Chat();
    C.SetChatWrap("#Chat-wrap");
    C.SetChatListBox("#Chat-friendbox");
    C.SetSendBtn("#Chat-btn-send");
    C.SetPictrueBtn(".webim-picture-icon");
    C.SetFileBtn(".webim-file-icon");
    C.SetVoiceBtn(".webim-audio-icon");
    C.SetChatContentBox("#Chat-messagebox");
    C.SetChatGroupMemberBox("#Chat-group-member-box");
    C.SetAudioClass(".Chat-audio");
    C.SetCloseAllBtn("#CloseAll");
    C.Config = {
        ChatListItemView: function (data) {
            var view = '<div class="pull-left Chat-user-card">' +
                ' <img class="img-circle pull-left" src= "{0}" width= "40" height= "40" />' +
                '     <span class="img-circle Manager-msg-position"></span>' +
                '     <div class="Chat-user-card-name pull-left">' +
                '         <span>{1}</span>' +
                '     </div>' +
                '     <span class="close" style="margin-top:10px;" aria-hidden="true">&times;</span>' +
                ' </div >';
            if (data.isGroup) {
                view = view.replace("{0}", data.PicName == null ? defaultImage : basepicurl + data.PicName);
                view = view.replace("{1}", data.userid + "(" + data.groupname + ")");
                return { view: view, id: data.groupid, closebtn: ".close" }

            }
            view = view.replace("{0}", data.PicName == null ? defaultImage : basepicurl + data.PicName);
            view = view.replace("{1}", data.userid + "(" + data.username + ")");
            return { view: view, id: data.Hxid, closebtn: ".close" }
        },//聊天列表item
        ChatListItem_Click: function (view, beforeview) {
            view.addClass("activity");
            view.find(".Manager-msg-position").html("");
            view.find(".Manager-msg-position").hide();
            if (beforeview != null) {
                beforeview.removeClass("activity");
            }
        },//聊天列表item点击
        ChatMessageSend_Click: function (data) {

            if (data.isGroup) {
                webapi.sendGroupText(encode($("#Chat-sendmessage-msg")), data.groupid, function () {
                    C.AddContent({ time: getNowFormatDate(), text: $("#Chat-sendmessage-msg").html(), isMe: true }, data.groupid);
                    $("#Chat-sendmessage-msg").html("");
                });
            }
            else {
                webapi.sendPrivateText(encode($("#Chat-sendmessage-msg")), data.Hxid, function () {
                    C.AddContent({ time: getNowFormatDate(), text: $("#Chat-sendmessage-msg").html(), isMe: true }, data.Hxid);
                    $("#Chat-sendmessage-msg").html("");
                });
            }

        },//发送按钮点击
        ChatFaceItem_Selected: function (data) {

        },//表情选择
        ChatImg_Selected: function (data, input) {
            if (data.isGroup) {
                webapi.sendGroupText($("#Chat-sendmessage-msg").val(), data.groupid, function () {
                    C.AddContent({ time: getNowFormatDate(), text: $("#Chat-sendmessage-msg").val(), isMe: true }, data.groupid);
                });
            }
            else {
                webapi.sendPrivateImg(input, data.Hxid, function (data) {
                    C.AddContent({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + data.value.url + "' />", isMe: true }, data.body.to);
                });
            }
        },//图片选择
        ChatAuio_Selected: function (data, input) {
            if (data.isGroup) {
                webapi.sendGroupAudio(input, data.groupid, function () {
                    C.AddContent({ time: getNowFormatDate(), text: "<img class='Chat-audio' data-src='" + data.value.url + "' src='/img/webim/audio.png'>", isMe: true }, data.groupid);
                });
            }
            else {
                webapi.sendPrivateAudio(input, data.Hxid, function (data) {
                    C.AddContent({ time: getNowFormatDate(), text: "<img class='Chat-audio' data-src='" + data.value.url + "' src='/img/webim/audio.png'>", isMe: true }, data.body.to);
                });
            }
        },//音乐选择
        ChatFile_Selected: function (data, input) {
            if (data.isGroup) {
                webapi.sendGroupFile($("#Chat-sendmessage-msg").val(), data.groupid, function () {
                    C.AddContent({ time: getNowFormatDate(), text: $("#Chat-sendmessage-msg").val(), isMe: true }, data.groupid);
                });
            }
            else {
                webapi.sendPrivateFile(input, data.Hxid, function (data) {
                    C.AddContent({ time: getNowFormatDate(), text: "文件发送成功", isMe: true }, data.body.to);
                });
            }
        },//文件选择
        ChatImg_Pasted: function (data) { },//图片粘贴
        ChatChangeObj: function (data) {
            if (data.isGroup) {
                $("#Chat-header img").attr("src", data.PicName == null ? defaultImage : basepicurl + data.PicName);
                $("#Chat-header .Chat-user-card-name span").html(data.groupname);
            }
            else {
                $("#Chat-header img").attr("src", data.PicName == null ? defaultImage : basepicurl + data.PicName);
                $("#Chat-header .Chat-user-card-name span").html(data.userid + "(" + data.username + ")");
            }
            $("#Chat-header .Chat-user-card-name p").html(data.job || "职务");
            $("#Chat-messagebox").html("");
            try {
                for (var i = 0; i < data.msg.length; i++)
                    C.ShowContent(data.msg[i], data.Hxid);
            }
            catch (ex) { }
            webapi.openPasteSend(data.Hxid, function (data) {
                if (data.isGroup) {
                    C.AddContent({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + data.value.url + "' />", isMe: true }, data.groupid);
                }
                else {
                    C.AddContent({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + data.value.url + "' />", isMe: true }, data.body.to);
                }
            });
        },//切换聊天对象
        ChatGroupMemberView: function (data) {
            var view = '<li>' +
                ' <img class="img-circle" width= "35" src= "{0}" />' +
                '<br />' +
                '<span class="usernamespan">{1}</span><span class="bannedspan">禁言</span><span class="shieldingspan">拉黑</span>' +
                '</li>';
            if (typeof (data.owner) != "undefined") {
                //群主
                if (data.owner == Me.userid) {
                    //本人是群主
                    view = view.replace("{0}", Me.PicName == null ? defaultImage : basepicurl + Me.PicName);
                    view = view.replace("{1}", Me.userid);

                }
                else {
                    var info = M.GetFriendsInfo().get(data.owner);
                    view = view.replace("{0}", info.PicName == null ? defaultImage : basepicurl + info.PicName);
                    view = view.replace("{1}", info.userid);
                }
            }
            else {
                //组员
                if (data.member == Me.userid) {
                    //本人
                    view = view.replace("{0}", Me.PicName == null ? defaultImage : basepicurl + Me.PicName);
                    view = view.replace("{1}", Me.userid);
                }
                else {
                    var info = M.GetFriendsInfo().get(data.member);
                    view = view.replace("{0}", info.PicName == null ? defaultImage : basepicurl + info.PicName);
                    view = view.replace("{1}", info.userid);
                }
            }
            return { view: view, talk: ".bannedspan", black: ".shieldingspan" };
        },//群成员视图
        ChatContentView: function (msg, data) {
            if (msg.isMe) {
                var view = '<div class="Chat-mebox">' +
                    '<img class="img-circle pull-right" width= "35" height= "35" src= "{0}" />' +
                    '   <div class="pull-right">' +
                    '       <span class="Chat-messagebox-username pull-right">{1}</span>' +
                    '       <span class="Chat-messagebox-time pull-right">{2}</span>' +
                    '       <pre class="Chat-messagebox-msg">{3}</pre>' +
                    '   </div>' +
                    '   </div>';
                view = view.replace("{0}", Me.PicName == null ? defaultImage : basepicurl + Me.PicName);
                view = view.replace("{1}", Me.userid + "(" + Me.username + ")");
                view = view.replace("{2}", msg.time);
                view = view.replace("{3}", msg.text);
                return { view: view };
            }
            else if (msg.isGroup) {
                var view = '<div class="Chat-otherbox">' +
                    '<img class="img-circle pull-left" width= "35" height= "35" src= "{0}" />' +
                    '    <div class="pull-left">' +
                    '        <span class="Chat-messagebox-username pull-left">{1}</span>' +
                    '        <span class="Chat-messagebox-time pull-left">{2}</span>' +
                    '        <pre class="Chat-messagebox-msg">{3}</pre>' +
                    '    </div>' +
                    '    </div >';
                view = view.replace("{0}", msg.from.PicName == null ? defaultImage : basepicurl + msg.from.PicName);
                view = view.replace("{1}", msg.from.userid + "(" + msg.from.username + ")");
                view = view.replace("{2}", msg.time);
                view = view.replace("{3}", msg.text);
                return { view: view };
            }
            else {
                var view = '<div class="Chat-otherbox">' +
                    '<img class="img-circle pull-left" width= "35" height= "35" src= "{0}" />' +
                    '    <div class="pull-left">' +
                    '        <span class="Chat-messagebox-username pull-left">{1}</span>' +
                    '        <span class="Chat-messagebox-time pull-left">{2}</span>' +
                    '        <pre class="Chat-messagebox-msg">{3}</pre>' +
                    '    </div>' +
                    '    </div >';
                view = view.replace("{0}", data.PicName == null ? defaultImage : basepicurl + data.PicName);
                view = view.replace("{1}", data.userid + "(" + data.username + ")");
                view = view.replace("{2}", msg.time);
                view = view.replace("{3}", msg.text);
                return { view: view };
            }
        },//获取聊天内容视图
        ChatContentSave: function (msg, data) {
            try {
                data["msg"].push(msg);
            }
            catch (ex) {
                data["msg"] = new Array();
                data["msg"].push(msg);
            };
        },//聊天数据保存
        ChatGroupMember: function (data) {
            return data.members;
        },//api获取成员并保存
        ChatGroupTalk_Click: function (view, id, groupid) {
            var userid = "";
            if (typeof (id.owner) != "undefined")
                userid = id.owner;
            else
                userid = id.member;
            if (view.html() == "禁言") {
                webapi.noTalk(userid, groupid,
                    function (rest) {
                        view.html("解除禁言");
                    },
                    function (e) {

                    });
            }
            else {
                webapi.Talk(userid, groupid,
                    function (rest) {
                        view.html("禁言");
                    },
                    function (e) {

                    });
            }
        },//禁言点击
        ChatGroupBlack_Click: function (view, id, groupid) {
            var userid = "";
            if (typeof (id.owner) != "undefined") {
                userid = id.owner;
                console.log("管理员不能禁言");
                return;
            }
            else
                userid = id.member;
            if (view.html() == "拉黑") {
                webapi.addBlackMembers(userid, groupid,
                    function (rest) {
                        view.html("取消拉黑");
                    },
                    function (e) {

                    });
            }
            else {
                webapi.removeBlackMembers(userid, groupid,
                    function (rest) {
                        view.html("拉黑");
                    },
                    function (e) {

                    });
            }
        },//黑名单点击
        ChatListItemPrompt: function (view) {
            view.find(".Manager-msg-position").show();
            var number = parseInt(view.find(".Manager-msg-position").html()) + 1 || 1;
            if (number > 9) {
                number = "..";
            }
            view.find(".Manager-msg-position").html(number.toString());
        }
    }

    $.post("/api/user/GetAllUser",
        {},
        function (data) {
            M.FriendsData(data);
            webapi = new webim_api(enterprise + Me.userid, enterprise + Me.userid, listen);
            webapi.login();
        },
        "json");//这里返回的类型有：json,html,xml,text

    $(".webim-emoji-icon").click(function (e) {
        $(".Chat-face-box").show();
    });

    $(".Chat-face-box li").click(function (e) {
        $(".Chat-face-box").hide();

        var c = $(this).clone();
        c.find("img").attr("key", c.attr("key"));
        $("#Chat-sendmessage-msg").focus();
        insertimg(c.html());

    });
    console.log(window.WebIM);
});

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

var listen = {
    onOpened: function (message) {          //连接成功回调
        nowlogin = 0;
        webapi.getList(function (data) {
            getmember(data.data, 0);
        }, function (ex) {
            console.log(ex);
        });
        //Chatbox.sendpic = function (n, i) {
        //    webapi.sendPrivateImg(i, n.userid, function (id) {
        //        var msg = webapi.messageQueue.get(id).body;
        //        if (Chatbox.hasOther(msg.to)) {
        //            var user = Chatbox.getOther(msg.to);
        //            user.msg.push({ time: getNowFormatDate(), text: "<img style='width:100%' src='" + msg.file.url + "'/>", userid: Chatbox.getMeId() });
        //            Chatbox.addmessage(user);
        //        }
        //    });
        //}
        //Chatbox.sendaud = function (n, i) {
        //    webapi.sendPrivateAudio(i, n.userid, function (id) {
        //        var msg = webapi.messageQueue.get(id).body;
        //        if (Chatbox.hasOther(msg.to)) {
        //            var user = Chatbox.getOther(msg.to);
        //            user.msg.push({ time: getNowFormatDate(), text: "<img class='Chat-audio' audio-src='" + msg.file.url + "' src='/img/webim/audio.png'>", userid: Chatbox.getMeId() });
        //            Chatbox.addmessage(user);
        //        }
        //    });
        //}
        //Chatbox.sendfile= function (n, i) {
        //    webapi.sendPrivateFile(i, n.userid, function (id) {
        //        var msg = webapi.messageQueue.get(id).body;
        //        if (Chatbox.hasOther(msg.to)) {
        //            var user = Chatbox.getOther(msg.to);
        //            user.msg.push({ time: getNowFormatDate(), text: "<span>文件:" + msg.filename + "</span><br /> <span>发送成功</span>", userid: Chatbox.getMeId() });
        //            Chatbox.addmessage(user);
        //        }
        //    });
        //}
    },
    onClosed: function (message) {
        if (nowlogin < maxlogin) {
            webapi.login();
            nowlogin += 1;
        }
        //连接关闭回调
        console.log("关闭回调");
    },
    onTextMessage: function (message) {
        if (message.type == "groupchat") {
            var from = M.GetFriendsInfo().get(message.from);
            //群消息
            if (!C.HasUser(message.to))
                M.Prompt({ time: getNowFormatDate(), text: WebIM.utils.parseEmoji(message.data), isGroup: true, id: message.to, from: from });
            else
                C.AddContent({ time: getNowFormatDate(), text: WebIM.utils.parseEmoji(message.data), isGroup: true, from: from }, message.to);
        }
        else {
            //收到文本消息
            if (!C.HasUser(message.from))
                M.Prompt({ time: getNowFormatDate(), text: WebIM.utils.parseEmoji(message.data), isFriend: true, id: message.from });
            else
                C.AddContent({ time: getNowFormatDate(), text: WebIM.utils.parseEmoji(message.data), isFriend: true }, message.from);
        }
        console.log("文本消息" + message);
    },
    onEmojiMessage: function (message) {
        //收到表情消息
        var md = "";
        var data = message.data;
        for (var i = 0, l = data.length; i < l; i++) {
            if (data[i].type == "emoji")
                md += "<img src='" + data[i].data + "'/>";
            else
                md += data[i].data;
        }
        if (message.type == "groupchat") {
            var from = M.GetFriendsInfo().get(message.from);
            //群消息
            if (!C.HasUser(message.to))
                M.Prompt({ time: getNowFormatDate(), text: md, isGroup: true, id: message.to, from: from });
            else
                C.AddContent({ time: getNowFormatDate(), text: md, isGroup: true, from: from }, message.to);
        }
        else {
            //收到文本消息
            if (!C.HasUser(message.from))
                M.Prompt({ time: getNowFormatDate(), text: md, isFriend: true, id: message.from });
            else
                C.AddContent({ time: getNowFormatDate(), text: md, isFriend: true }, message.from);
        }
    },
    onPictureMessage: function (message) {
        if (message.type == "groupchat") {
            var from = M.GetFriendsInfo().get(message.from);
            //群消息
            if (!C.HasUser(message.to))
                M.Prompt({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + message.url + "' />", isGroup: true, id: message.to, from: from });
            else
                C.AddContent({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + message.url + "' />", isGroup: true, from: from }, message.to);
        }
        else {
            //收到文本消息
            if (!C.HasUser(message.from))
                M.Prompt({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + message.url + "' />", isFriend: true, id: message.from });
            else
                C.AddContent({ time: getNowFormatDate(), text: "<img style='max-width:200px'  src='" + message.url + "' />", isFriend: true }, message.from);
        }
        console.log("文本消息" + message);
    },
    onCmdMessage: function (message) {
        //收到命令消息
    },
    onAudioMessage: function (message) {
        if (message.type == "groupchat") {
            var from = M.GetFriendsInfo().get(message.from);
            //群消息
            if (!C.HasUser(message.to))
                M.Prompt({ time: getNowFormatDate(), text: "<img class='Chat-audio' data-src='" + message.url + "' src='/img/webim/audio.png'>", isGroup: true, id: message.to, from: from });
            else
                C.AddContent({ time: getNowFormatDate(), text: "<img class='Chat-audio' data-src='" + message.url + "' src='/img/webim/audio.png'>", isGroup: true, from: from }, message.to);
        }
        else {
            //收到文本消息
            if (!C.HasUser(message.from))
                M.Prompt({ time: getNowFormatDate(), text: "<img class='Chat-audio' data-src='" + message.url + "' src='/img/webim/audio.png'>", isFriend: true, id: message.from });
            else
                C.AddContent({ time: getNowFormatDate(), text: "<img class='Chat-audio' data-src='" + message.url + "' src='/img/webim/audio.png'>", isFriend: true }, message.from);
        }
        console.log("文本消息" + message);
        //收到音频消息
        //console.log("音频消息");
        //console.log(message);
        //var other = CB.other.get(message.from);
        //other.msg.push({ time: getNowFormatDate(), text: "<img class='Chat-audio' audio-src='" + message.url + "' src='/img/webim/audio.png'>", userid: message.from });
        //    if (!Chatbox.hasOther(message.from))
        //        CB.wait(message.from, "");
        //    else
        //        Chatbox.addmessage(other);
    },
    onLocationMessage: function (message) {
        //收到位置消息
        console.log("位置消息");
        console.log(message);
    },
    onFileMessage: function (message) {
        if (message.type == "groupchat") {
            var from = M.GetFriendsInfo().get(message.from);
            //群消息
            if (!C.HasUser(message.to))
                M.Prompt({ time: getNowFormatDate(), text: "<span>文件:" + message.filename + "</span><br /> <span><a target='_blank' href='" + message.url + "'>点击下载</a></span>", isGroup: true, id: message.to, from: from });
            else
                C.AddContent({ time: getNowFormatDate(), text: "<span>文件:" + message.filename + "</span><br /> <span><a target='_blank' href='" + message.url + "'>点击下载</a></span>", isGroup: true, from: from }, message.to);
        }
        else {
            //收到文本消息
            if (!C.HasUser(message.from))
                M.Prompt({ time: getNowFormatDate(), text: "<span>文件:" + message.filename + "</span><br /> <span><a target='_blank' href='" + message.url + "'>点击下载</a></span>", isFriend: true, id: message.from });
            else
                C.AddContent({ time: getNowFormatDate(), text: "<span>文件:" + message.filename + "</span><br /> <span><a target='_blank' href='" + message.url + "'>点击下载</a></span>", isFriend: true }, message.from);
        }
        console.log("文本消息" + message);
        //收到文件消息
        //var other = CB.other.get(message.from);
        //other.msg.push({
        //    time: getNowFormatDate(), text: "<span>文件:" + message.filename + "</span><br /> <span><a target='_blank' href='" + message.url + "'>点击下载</a></span>", userid: message.from
        //});
        //if (!Chatbox.hasOther(message.from))
        //    CB.wait(message.from, "");
        //else
        //    Chatbox.addmessage(other);
    },
    onVideoMessage: function (message) {

        //var node = document.getElementById('privateVideo');
        //var option = {
        //    url: message.url,
        //    headers: {
        //        'Accept': 'audio/mp4'
        //    },
        //    onFileDownloadComplete: function (response) {
        //        var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
        //        node.src = objectURL;
        //    },
        //    onFileDownloadError: function () {
        //        console.log('File down load error.')
        //    }
        //};
        //WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function (message) {
        //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    },
    onRoster: function (message) {
        //处理好友申请
    },
    onInviteMessage: function (message) {
        //处理群组邀请
    },
    onOnline: function () {
        //本机网络连接成功
        console.log("本机网络连接成功");
    },
    onOffline: function () {
        //本机网络掉线
        console.log("本机网络掉线");
    },
    onError: function (message) {
        console.log(message);
        //失败回调
    },
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    }
};

function tab_click() {
    $(".Manager-tab li").click(function (e) {
        $(".Manager-tab li").removeClass("activity");
        $(this).addClass("activity");
        var container = $(".Manager-tabbox");
        var scrollTo = $(".Manager-tabbox ul li:eq(" + $(this).index() + ")");
        container.animate({
            scrollLeft: scrollTo.offset().left - container.offset().left + container.scrollLeft()
        }, 300);
    });
}

function Form_move() {
    $("#Manager-friends-selectbox").draggable();
    $("#Manager-creategroupbox").draggable();
    $(".MoveFrom").draggable({ containment: [2, 2, $("body").width(), $("body").width(), $("body").height()]});
    $(".MoveFrom").draggable("disable");
    $("#Manager-userbox").mousedown(function (e) {
        $(".MoveFrom").draggable("enable");
    });
    $("#Manager-userbox").mouseleave(function () {
        $(".MoveFrom").draggable("disable");
    });

    $("#Manager-userbox").mouseup(function (e) {
        $(".MoveFrom").draggable("disable");
    });

    $("#Chat-header-movefrom").mousedown(function (e) {
        $(".MoveFrom").draggable("enable");
    });
    $("#Chat-header-movefrom").mouseup(function (e) {
        $(".MoveFrom").draggable("disable");
    });
    $("#Chat-wrap-min").mousedown(function (e) {
        $(".MoveFrom").draggable("enable");
    });
    $("#Chat-wrap-min").mouseup(function (e) {
        $(".MoveFrom").draggable("disable");
    });
    $("#Manager-user-img-min").mousedown(function (e) {
        $(".MoveFrom").draggable("enable");
    });
    $("#Manager-user-img-min").mouseup(function (e) {
        $(".MoveFrom").draggable("disable");
    });
    $(".MoveFrom").mousedown(function (e) {
        $(".MoveFrom").css("z-index", 0);
        $(this).css("z-index", 999);
        e.stopPropagation();
    });
}

function moveFormReposition(view) {
    var result = 0;
    if (view.position().left < 0) {
        view.animate({ left: 3 }, 300);
        result += 1;
    }
    if (view.position().top < 0) {
        view.animate({ top: 3 }, 300);
        result += 2;
    }
    return reuslt;
}

function prompt_show() {
    $("#Manager-msg-box").mouseenter(function (e) {
        $(".Manager-msg-prompt-box").show();
    });
    $("#Manager-msg-box").mouseleave(function (e) {
        $(".Manager-msg-prompt-box").hide();
    });
    $("#Manager-wrap-min").mouseenter(function (e) {
        $("#Manager-prompt-box-details-min").show();
    });
    $("#Manager-wrap-min").mouseleave(function (e) {
        $("#Manager-prompt-box-details-min").hide();
    });
}

function min() {
    $("#Manager-header .close").click(function (e) {
        $("#Manager-wrap").hide(300, function (e) {
            $("#Manager-wrap-min").show(500);
        });
    });
    $("#Manager-user-img-min").dblclick(function (e) {
        $("#Manager-wrap-min").hide(300, function (e) {
            $("#Manager-wrap").show(500);
        });
    });
}

function chatWindowMin() {
    $("#Chat-wrap .layui-layer-min").click(function (e) {
        $("#Chat-wrap").hide(300, function (e) {
            $("#Chat-wrap-min").show(500);
        });
    });
    $("#Chat-wrap-min").dblclick(function (e) {
        $("#Chat-wrap-min").hide(300, function (e) {
            $("#Chat-wrap").show(500);
        });
    });
}

function getmember(data, i) {
    webapi.getMemberList(data[i], function (members) {
        data[i]["members"] = members.data;
        i++;
        if (i >= data.length) {
            M.GroupsData(data);
        }
        else {
            getmember(data, i);
        }
    });
}

function member_show() {
    $("#Chat-group-tools span").click(function (e) {
        var index = $(this).index();
        if (!$(this).hasClass("activity")) {
            $("#Chat-group-tools span").removeClass("activity");
            $("#Chat-group-tools-box ul").hide();
            $("#Chat-group-tools-box ul:eq(" + index + ")").show();
            $("#Chat-group-tools-box").show(300);
            $(this).addClass("activity");
            $("#Chat-group-member-box li").mouseenter(function (e) {
                $(this).find(".bannedspan").show();
                $(this).find(".shieldingspan").show();
            });
            $("#Chat-group-member-box li").mouseleave(function (e) {
                $(this).find(".bannedspan").hide();
                $(this).find(".shieldingspan").hide();
            });
        }
        else {
            $("#Chat-group-tools-box ul:eq(" + index + ")").hide();
            $("#Chat-group-tools-box").hide(300);
            $(this).removeClass("activity");
        }
    });
}

function creategroup() {
    $(".Manager-creatgroup-selectmember").click(function (e) {
        M.SelectFriend("CreateGroup", "选择入群的成员");
    });

    $("#creategroup").click(function (e) {
        $("#Manager-creategroupbox").show();
    });

    $("#Manager-creategroup-sure").click(function (e) {
        var groupname = $("#groupname").val();
        var groupjj = $("#groupjj").val();
        var groupmember = $("#groupmember").val().split(",");
        var pub = $("#grouppub").is(":checked");
        var apply = $("#groupapply").is(":checked");
        var allow = $("#groupallow").is(":checked");
        var opt = {
            groupname: groupname,
            desc: groupjj,
            members: groupmember.slice(0, groupmember.length - 1),
            public: pub,
            approval: apply,
            allowinvites: allow
        }
        webapi.create(opt, function (rest) {
            alert("建群成功");
        }, function (ex) {
            alert(ex);
        });
    });
    $("#Manager-creategroup-close").click(function (e) {
        $("#Manager-creategroupbox").hide();
    });
}

function encode(jquery) {
    var jc = $(jquery).clone();
    $(jc).find("img").each(function () {
        $(this).prop("outerHTML", $(this).attr("key"));
    });
    return jc.html();
}

function insertimg(str) {

    var selection = window.getSelection ? window.getSelection() : document.selection;

    var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);

    if (!window.getSelection) {

        document.getElementById('Chat-sendmessage-msg').focus();

        selection = window.getSelection ? window.getSelection() : document.selection;

        range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);

        range.pasteHTML(str);

        range.collapse(false);

        range.select();

    } else {

        document.getElementById('Chat-sendmessage-msg').focus();

        selection = window.getSelection ? window.getSelection() : document.selection;

        range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);

        range.collapse(false);

        var hasR = range.createContextualFragment(str);

        var hasR_lastChild = hasR.lastChild;

        while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {

            var e = hasR_lastChild;

            hasR_lastChild = hasR_lastChild.previousSibling;

            hasR.removeChild(e);

        }

        range.insertNode(hasR);

        if (hasR_lastChild) {

            range.setEndAfter(hasR_lastChild);

            range.setStartAfter(hasR_lastChild);

        }

        selection.removeAllRanges();

        selection.addRange(range);

    }

}

