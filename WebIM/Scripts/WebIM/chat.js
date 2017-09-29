function Chat() {
    var _this = this;
    var ChatWrap;
    var ChatListBox;
    var ChatContentBox;
    var ChatMessageSendBtn;
    var ChatPictrueBtn;
    var ChatFileBtn;
    var ChatVoiceBtn;
    var ChatGroupMemberBox;
    var ChatAudioClass;
    var ChatListItemView = new Map();//记录列表对象
    var ChatListItemData = new Map();//记录列表数据
    var ChatGroupMemberData = new Map();//记录群成员数据
    var ChatNowObj;
    var ChatNowId;
    var audio = new Audio();
    var input = $(document.createElement("input"));
    this.Config = {
        ChatListItemView: function (data) { },//聊天列表item
        ChatListItem_Click: function (view, beforeview) { },//聊天列表item点击
        ChatMessageSend_Click: function (data) { },//发送按钮点击
        ChatFaceItem_Selected: function (data) { },//表情选择
        ChatImg_Selected: function (data, input) { },//图片选择
        ChatAuio_Selected: function (data, input) { },//音乐选择
        ChatFile_Selected: function (data, input) { },//文件选择
        ChatImg_Pasted: function (data) { },//图片粘贴
        ChatChangeObj: function (data) { },//切换聊天对象
        ChatGroupMemberView: function (data) { },//群成员视图
        ChatContentView: function (msg, data) { },//获取聊天内容视图
        ChatContentSave: function (msg, data) { },//聊天数据保存
        ChatGroupMember: function (data) { },//api获取成员并保存
        ChatGroupTalk_Click: function (view, id, groupid) { },//禁言点击
        ChatGroupBlack_Click: function (view, id, groupid) { },//黑名单点击
        ChatListItemPrompt: function (view) {
            view.find(".Manager-msg-position").show();
            var number = parseInt(view.find(".Manager-msg-position").html()) + 1 || 1;
            view.find(".Manager-msg-position").html(number.toString());
        }//消息提示
    }
    this.SetCloseAllBtn = function (jquery) {
        $(jquery).click(function (e) {
            ChatListBox.html("");
            ChatListItemView = new Map();//清空列表对象
            ChatListItemData = new Map();//清空列表数据
            ChatGroupMemberData = new Map();//清空群成员数据
            ChatWrap.hide();
        });
    }
    this.SetSendBtn = function (jquery) {
        ChatMessageSendBtn = $(jquery);
        ChatMessageSendBtn.click(function (e) {
            _this.Config.ChatMessageSend_Click(ChatListItemData.get(ChatNowId));
            e.stopPropagation();
        });
    }
    this.SetChatWrap = function (jquery) {
        ChatWrap = $(jquery);
    }
    this.SetPictrueBtn = function (jquery) {
        ChatPictrueBtn = $(jquery);
    }
    this.SetFileBtn = function (jquery) {
        ChatFileBtn = $(jquery);
    }
    this.SetVoiceBtn = function (jquery) {
        ChatVoiceBtn = $(jquery);
    }
    this.SetAudioClass = function (Class) {
        ChatAudioClass = Class;
    }
    this.SetChatContentBox = function (box) {
        ChatContentBox = $(box);
    }
    this.SetChatListBox = function (box) {
        ChatListBox = $(box);
    }
    this.SetChatGroupMemberBox = function (box) {
        ChatGroupMemberBox = $(box);
    }
    this.AddListItem = function (data) {
        ChatWrap.show();
        var obj = _this.Config.ChatListItemView(data);
        var view = $(obj.view);
        if (data.isGroup) {
            ChatGroupMemberData.set(obj.id, _this.Config.ChatGroupMember(data));
        }
        view.children(obj.closebtn).click({ id: obj.id }, function (e) {
            ChatListItemView.get(e.data.id).remove();
            ChatListItemView.delete(e.data.id);
            ChatListItemData.delete(e.data.id);
            ChatContentBox.html("");
            if (ChatNowId == e.data.id) {
                ChatNowId = null;
                ChatNowObj = null;
                _this.Config.ChatListItem_Click(ChatListBox.children(":first"), null);
                if (ChatListBox.children().length <= 0)
                    ChatWrap.hide();
            }
        });
        view.click({ id: obj.id }, function (e) {
            if (e.data.id !== ChatNowId) {
                _this.Config.ChatListItem_Click($(this), ChatListItemView.get(ChatNowId));
                ChatNowObj = ChatListItemData.get(e.data.id);
                ChatNowId = obj.id;
                _this.Config.ChatChangeObj(ChatNowObj);
                ChatPictrueBtn.unbind("click");
                ChatFileBtn.unbind("click");
                ChatVoiceBtn.unbind("click");
                ChatPictrueBtn.click({ data: ChatNowObj }, function (e) {
                    input.attr("type", "file");
                    input.attr("accept", "image/*");
                    input.unbind("change");
                    input.change({ data: data }, function (ev) {
                        _this.Config.ChatImg_Selected(ev.data.data, $(this)[0]);
                        ev.stopPropagation();
                    });
                    input.click();
                    e.stopPropagation();
                });
                ChatFileBtn.click({ data: ChatNowObj }, function (e) {
                    input.attr("type", "file");
                    input.attr("accept", "*/*");
                    input.unbind("change");
                    input.change({ data: data }, function (ev) {
                        _this.Config.ChatFile_Selected(ev.data.data, $(this)[0]);
                        ev.stopPropagation();
                    });
                    input.click();
                    e.stopPropagation();
                });
                ChatVoiceBtn.click({ data: ChatNowObj }, function (e) {
                    input.attr("type", "file");
                    input.attr("accept", "audio/*");
                    input.unbind("change");
                    input.change({ data: data }, function (ev) {
                        _this.Config.ChatAuio_Selected(ev.data.data, $(this)[0]);
                        ev.stopPropagation();
                    });
                    input.click();
                    e.stopPropagation();
                });
                if (ChatNowObj.isGroup) {
                    var member = ChatGroupMemberData.get(e.data.id);
                    ChatGroupMemberBox.html("");
                    for (var i = 0; i < member.length; i++) {
                        var o = _this.Config.ChatGroupMemberView(member[i]);
                        var ov = $(o.view);
                        ov.find(o.talk).click({ id: member[i], groupid: e.data.id }, function (e) {
                            _this.Config.ChatGroupTalk_Click($(this), e.data.id, e.data.groupid);
                            e.stopPropagation();
                        });
                        ov.find(o.black).click({ id: member[i], groupid: e.data.id }, function (e) {
                            _this.Config.ChatGroupBlack_Click($(this), e.data.id, e.data.groupid);
                            e.stopPropagation();
                        });
                        ChatGroupMemberBox.append(ov);
                    }
                }
            } else {
                ChatNowObj = ChatListItemData.get(e.data.id);
                ChatNowId = obj.id;
                _this.Config.ChatChangeObj(ChatNowObj); 
            }
            e.stopPropagation();
        });
        if (ChatListItemView.get(obj.id) == null) {
            ChatListItemView.set(obj.id, view);
            ChatListItemData.set(obj.id, data);
            ChatListBox.append(view);
        }
        view.click();
    }
    this.AddContent = function (msg, id) {
        //读取所有消息
        _this.Config.ChatContentSave(msg, ChatListItemData.get(id));//保存聊天记录
        if (id == ChatNowId) {//如果正在聊天，则输出聊天记录
            _this.ShowContent(msg, id);
        }
        else {
            var view = ChatListItemView.get(id);
            _this.Config.ChatListItemPrompt(view);
        }
    }
    this.HasUser = function (id) {
        return ChatListItemView.get(id);
    }
    this.ShowContent = function (msg, id) {
        var obj = _this.Config.ChatContentView(msg, ChatListItemData.get(id));//获取视图
        var view = $(obj.view);
        ChatContentBox.append(view);
        view.find(ChatAudioClass).click(function (e) {
            playamr($(this).attr("data-src"));
            //if (audio.src != $(this).attr("data-src")) {
            //    audio.src = $(this).attr("data-src");
            //    audio.play();
            //} else
            //{
            //    if (audio.paused) {
            //        audio.play();
            //    } else
            //    {
            //        audio.pause();
            //    }
            //}
        });
    }
}
