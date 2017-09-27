function Manager() {
    var audio = new Audio("/Audio/tishi.wav");
    var _this = this;
    var defaultImage = "/Img/WebIM/Manager_UserImg_Default.jpg";
    var Me;//记录登陆者信息
    var MessagePrompt = new Map();//提示信息
   // var ChatObject = new Map();//聊天对象
    var FriendsSelectBox;
    var FriendsSelectitemBox;
    var FriendsSelectedBox;
    var FriendsSelectedData = new Map();
    var FriendsSelectitemBoxView = new Map();
    var FriendsSelectedSurebtn;
    var FriendsSelectedClosebtn;
    var FriendsSelectId;
    var FriendsSelectTitleBox;
    var FriendsBox;//好友容器
    var FriendsBoxView = new Map();//记录friendsbox中视图
    var FriendsInfo = new Map();//记录好友信息
    var GroupsBox;//群容器
    var GroupsBoxView=new Map();//groupsbox视图
    var GroupsInfo = new Map();
    var MessagePromptBox;//消息提示容器
    var MessagePromptMinBox;//缩小后的提示容器
    var MessagePromptCountAll=0;
    var MessagePromptCountFriends = new Map();
    var MessagePromptCountGroups = new Map();
    var MessagePromptCountSystems = new Map();
    var MessagePromptBoxView = new Map();//记录消息提示容器的所有对象
    var MessagePromptBoxMinView = new Map();
    this.Config = {
        FriendsSelectedView: function (data) { },//选择后的视图
        FriendsView: function (data) { },//好友样式
        GroupsView: function (data) { },//群样式
        MessagePromptView: function (data) { },//消息提示样式
        MessagePromptMinView: function (data) { },//缩小版提示视图
        FriendsClass_Click: function (view) { },//好友分类点击
        FriendsView_Click: function (data) { },//好友点击
        GroupsClass_Click: function (view) { },//群分类点击
        GroupsView_Click: function (data) { },//群点击
        MessagePromptView_Click: function (data) { },//消息提示card点击
        Friends_Selected:function(id,data){},//
    }
    this.SetMe = function (o) {
        Me = o;
    }
    this.GetMe = function () {
        return Me;
    }
    this.SetFriendsSelectBox = function (box) {
        FriendsSelectBox = $(box);
    }
    this.SetFriendsSelectTitleBox = function (box) {
        FriendsSelectTitleBox = $(box);
    }
    this.SetFriendsSelectedBox = function (box) {
        FriendsSelectedBox = $(box);
    }
    this.SetFriendsSelectitemBox = function (box) {
        FriendsSelectitemBox = $(box);
    }
    this.SetFriendsBox = function (box) {
        FriendsBox = $(box);
    }
    this.SetGroupsBox = function (box) {
        GroupsBox = $(box);
    }
    this.SetMessagePromptBox = function (box) {
        MessagePromptBox = $(box);
    }
    this.SetMessagePromptMinBox = function (box) {
        MessagePromptMinBox = $(box);
    }
    this.SetFriendsSelectedSurebtn = function (jquery) {
        FriendsSelectedSurebtn = $(jquery);
        FriendsSelectedSurebtn.click(function (e) {
            _this.Config.Friends_Selected(FriendsSelectId, FriendsSelectedData);
            FriendsSelectedClosebtn.click();
            e.stopPropagation();
        });

    }
    this.SetFriendsSelectedClosebtn = function (jquery) {
        FriendsSelectedClosebtn = $(jquery);
        FriendsSelectedClosebtn.click(function (e) {
            FriendsSelectBox.hide();
            FriendsSelectedData = new Map();
            e.stopPropagation();
        });
    }
    this.FriendsData = function (data) {//加载好友数据
        FriendsInfo = new Map();//清楚好友消息
        $(FriendsBox).children().remove();//移除所有dom
        for (var i = 0; i < data.length; i++) {
            var obj = _this.Config.FriendsView(data[i]);
            try{
                var view = $(obj.view);
                var sview;
                if (!obj.isFriend) {
                    //不是用户card
                    view.append("<div class='FriendsBoxChild'></div>");
                    view.children(".FriendsBoxChild").hide();
                    sview = view.clone();
                    view.click(function (e) {
                        _this.Config.FriendsClass_Click(this);
                        if ($(this).children(".FriendsBoxChild").is(":hidden")) {
                            $(this).children(".FriendsBoxChild").show();
                        }
                        else {
                            $(this).children(".FriendsBoxChild").hide();
                        }
                        e.stopPropagation();
                    });//绑定点击事件
                    sview.click(function (e) {
                        _this.Config.FriendsClass_Click(this);
                        if ($(this).children(".FriendsBoxChild").is(":hidden")) {
                            $(this).children(".FriendsBoxChild").show();
                        }
                        else {
                            $(this).children(".FriendsBoxChild").hide();
                        }
                        e.stopPropagation();
                    });//绑定点击事件
                }
                else {//用户card
                    sview = view.clone();
                    FriendsInfo.set(obj.id, data[i]);
                    MessagePromptCountFriends.set(obj.id, 0);
                    view.click(data[i], function (e) {
                        _this.Config.FriendsView_Click(e.data);
                        e.stopPropagation();
                    });//绑定点击事件
                    sview.click({ id: obj.id }, function (e) {
                        if (typeof (FriendsSelectedData.get(e.data.id)) == "undefined") {
                            FriendsSelectedData.set(e.data.id, FriendsInfo.get(e.data.id));
                            var sedo = _this.Config.FriendsSelectedView(FriendsInfo.get(e.data.id));
                            var sedview = $(sedo.view);
                            sedview.click({ id: e.data.id }, function (ev) {
                                $(this).remove();
                                FriendsSelectedData.delete(ev.data.id);
                            });
                            FriendsSelectedBox.append(sedview);
                        }
                        e.stopPropagation();
                    });//绑定点击事件
                }
                FriendsBoxView.set(obj.id, view);
                FriendsSelectitemBoxView.set(obj.id, sview);
                if (obj.parent == null || typeof (obj.parent) === "undefined") {
                    FriendsBox.append(view);
                    FriendsSelectitemBox.append(sview);
                }
                else {
                    try {
                        FriendsBoxView.get(obj.parent).children(".FriendsBoxChild").append(view);
                        FriendsSelectitemBoxView.get(obj.parent).children(".FriendsBoxChild").append(sview);
                    }
                    catch (ex) {

                    }
                }
            }
            catch (ex) {

            }
        }
    }
    this.GroupsData = function (data) {
        GroupsInfo = new Map();//清楚好友消息
        $(GroupsBox).children().remove();//移除所有dom
        for (var i = 0; i < data.length; i++) {
            var obj = _this.Config.GroupsView(data[i]);
            try {
                var view = $(obj.view);
                if (!obj.isGroup) {
                    view.append("<div class='GroupsBoxChild'></div>");
                    view.children(".GroupsBoxChild").hide();
                    view.click(function (e) {
                        _this.Config.GroupsClass_Click(this);
                        if ($(this).children(".GroupsBoxChild").is(":hidden")) {
                            $(this).children(".GroupsBoxChild").show();
                        }
                        else {
                            $(this).children(".GroupsBoxChild").hide();
                        }
                        e.stopPropagation();
                    });//绑定点击事件
                }
                else {//用户card
                    GroupsInfo.set(obj.id, data[i]);
                    MessagePromptCountGroups.set(obj.id, 0);
                    view.click(data[i], function (e) {
                        _this.Config.GroupsView_Click(e.data);
                        e.stopPropagation();
                    });//绑定点击事件
                }
                GroupsBoxView.set(obj.id, view);
                if (obj.parent == null || typeof (obj.parent) === "undefined") {
                    GroupsBox.append(view);
                }
                else {
                    try {
                        GroupsBoxView.get(obj.parent).children(".GroupsBoxChild").append(view);
                    }
                    catch (ex) {

                    }
                }
            }
            catch (ex) {

            }
        }
    }
    this.Prompt = function (data) {//消息提示
        
        audio.play();
        var count;
        if (data.isFriend) {
            count = MessagePromptCountFriends.get(data.id) + 1;
            MessagePromptCountFriends.set(data.id, count);
            data["Friend"] = FriendsInfo.get(data.id);
        }
        else if (data.isGroup) {
            count = MessagePromptCountGroups.get(data.id) + 1;
            MessagePromptCountGroups.set(data.id, count);
            data["Group"] = GroupsInfo.get(data.id);
        }
        else if (data.isSystem) {
            count = MessagePromptCountSystems.get(data.id) + 1;
            MessagePromptCountSystems.set(data.id, count);
        }
        else {
            return;
        }
        data["count"] = count;
        MessagePromptCountAll += 1;
        data["allcount"] = MessagePromptCountAll;
        var obj = _this.Config.MessagePromptView(data);
        var view = $(obj.view);
        var mobj = _this.Config.MessagePromptMinView(data);
        var mview = $(mobj.view);
        if (MessagePromptBoxView.get(data.id) == null) {
            MessagePromptBox.append(view);            
        }
        else {
            MessagePromptBoxView.get(data.id).after(view)
            MessagePromptBoxView.get(data.id).remove();
        }
        if (MessagePromptBoxMinView.get(data.id) == null) {
            MessagePromptMinBox.append(mview);
        }
        else {
            MessagePromptBoxMinView.get(data.id).after(mview)
            MessagePromptBoxMinView.get(data.id).remove();
        }
        MessagePromptBoxView.set(data.id, view);
        MessagePromptBoxMinView.set(data.id, mview);
        view.click({ id: data.id, isFriend: data.isFriend, isGroup: data.isGroup, isSystem: data.isSystem }, function (e) {
            if (e.data.isFriend) {
                e.data["Friend"] = FriendsInfo.get(e.data.id);
                MessagePromptCountAll -= MessagePromptCountFriends.get(e.data.id);
                e.data["allcount"] = MessagePromptCountAll;
                _this.Config.MessagePromptView_Click(e.data);               
                MessagePromptCountFriends.set(e.data.id, 0);
                MessagePromptBoxView.delete(e.data.id);
                MessagePromptBoxMinView.get(e.data.id).remove();
                MessagePromptBoxMinView.delete(e.data.id);
            }
            else if (e.data.isGroup) {
                e.data["Group"] = GroupsInfo.get(data.id);
                MessagePromptCountAll -= MessagePromptCountGroups.get(e.data.id);
                e.data["allcount"] = MessagePromptCountAll;
                _this.Config.MessagePromptView_Click(e.data);              
                MessagePromptCountGroups.set(e.data.id, 0);
                MessagePromptBoxView.delete(e.data.id);
                MessagePromptBoxMinView.get(e.data.id).remove();
                MessagePromptBoxMinView.delete(e.data.id);
            }
            $(this).remove();           
        });
        mview.click({ id: data.id, isFriend: data.isFriend, isGroup: data.isGroup, isSystem: data.isSystem }, function (e) {
            MessagePromptBoxView.get(e.data.id).click();
        });
    }
    this.GetFriendsInfo = function () {
        var Info = new Map();
        FriendsInfo.forEach(function (v, k, m) {
            Info.set(k, v);
        });
        return Info;
    }
    this.SelectFriend=function(id, title){
        FriendsSelectId = id;
        FriendsSelectTitleBox.html(title);
        FriendsSelectTitleBox.val(title);
        FriendsSelectBox.show();
    }
}