function webim_api(userid, password, listen) {
    var _this = this;
    var connect = new WebIM.connection({
        https: WebIM.config.https,
        url: WebIM.config.xmppURL,
        apiUrl: WebIM.config.apiURL,
        isAutoLogin: WebIM.config.isAutoLogin,
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions
    });
    connect.listen(listen);
    this.login = function () {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: userid,
            pwd: password,
            appKey: WebIM.config.appkey
        };
        connect.open(options);
    }
    this.messageQueue = new Map();
    // 单聊发送文本消息
    this.sendPrivateText = function (content, touserid, success) {
        var id = connect.getUniqueId();                 // 生成本地消息id
        var msg = new WebIM.message('txt', id);      // 创建文本消息
        _this.messageQueue.set(id, msg);
        msg.set({
            msg: content,                  // 消息内容
            to: touserid,                          // 接收消息对象（用户id）
            roomType: false,
            success: function (id, serverMsgId) {
                success(id, serverMsgId);
                _this.messageQueue.delete(id);
            }
        });
        msg.body.chatType = 'singleChat';
        connect.send(msg.body);
    };
    // 单聊发送图片消息
    this.sendPrivateImg = function (input, touserid, success, onFileUploadComplete, onFileUploadError) {
        var id = connect.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message('img', id);        // 创建图片消息
        _this.messageQueue.set(id, msg);
        var file = WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
        var allowType = {
            'jpg': true,
            'gif': true,
            'png': true,
            'bmp': true
        };
        if (file.filetype.toLowerCase() in allowType) {
            var option = {
                apiUrl: WebIM.config.apiURL,
                file: file,
                to: touserid,                       // 接收消息对象
                roomType: false,
                chatType: 'singleChat',
                onFileUploadError: function (error) {    // 消息上传失败
                    try {
                        onFileUploadError();
                    }
                    catch (ex) {

                    }
                    _this.messageQueue.delete(id);
                },
                onFileUploadComplete: function (data) {  // 消息上传成功
                    try {
                        onFileUploadComplete();
                    }
                    catch (ex) {

                    }
                },
                success: function (id) {              // 消息发送成功
                    success(_this.messageQueue.get(id));
                    _this.messageQueue.delete(id);
                },
                flashUpload: WebIM.flashUpload
            };
            msg.set(option);
            connect.send(msg.body);
        }
        else {
            alert("请选择有效图片");
        }
    };
    // 单聊发送文件消息
    this.sendPrivateFile = function (input, touserid, success, onFileUploadComplete, onFileUploadError) {
        var id = connect.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message('file', id);        // 创建文件消息
        _this.messageQueue.set(id, msg);
        //var input = document.getElementById('file');  // 选择文件的input
        var file = WebIM.utils.getFileUrl(input);      // 将文件转化为二进制文件
        if (true) {
            var option = {
                apiUrl: WebIM.config.apiURL,
                file: file,
                to: touserid,                       // 接收消息对象
                roomType: false,
                chatType: 'singleChat',
                onFileUploadError: function (error) {    // 消息上传失败
                    try {
                        onFileUploadError();
                    }
                    catch (ex) {

                    }
                    _this.messageQueue.delete(id);
                },
                onFileUploadComplete: function (data) {  // 消息上传成功
                    try {
                        onFileUploadComplete();
                    }
                    catch (ex) {

                    }
                },
                success: function (id) {              // 消息发送成功
                    success(_this.messageQueue.get(id));
                    _this.messageQueue.delete(id);
                },
                flashUpload: WebIM.flashUpload
            };
            msg.set(option);
            connect.send(msg.body);
        }
    };
    // 单聊发送音频消息
    this.sendPrivateAudio = function (input, touserid, success, onFileUploadComplete, onFileUploadError) {
        var id = connect.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message('audio', id);      // 创建音频消息
        _this.messageQueue.set(id, msg);
        // var input = document.getElementById('audio');  // 选择音频的input
        var file = WebIM.utils.getFileUrl(input);      // 将音频转化为二进制文件
        var allowType = {
            'mp3': true,
            'amr': true,
            'wmv': true
        };
        if (file.filetype.toLowerCase() in allowType) {
            var option = {
                apiUrl: WebIM.config.apiURL,
                file: file,
                to:touserid,                       // 接收消息对象
                roomType: false,
                chatType: 'singleChat',
                onFileUploadError: function (error) {    // 消息上传失败
                    try {
                        onFileUploadError();
                    }
                    catch (ex) {

                    }
                    _this.messageQueue.delete(id);
                },
                onFileUploadComplete: function (data) {  // 消息上传成功
                    try {
                        onFileUploadComplete();
                    }
                    catch (ex) {

                    }
                },
                success: function (id) {              // 消息发送成功
                    success(_this.messageQueue.get(id));
                    _this.messageQueue.delete(id);
                },
                flashUpload: WebIM.flashUpload
            };
            msg.set(option);
            connect.send(msg.body);
        }
        else {
            alert("请选择有效音频文件");
        }
    };
    //开启贴图发送
    this.openPasteSend = function (touserid, success, onFileUploadComplete, onFileUploadError) {
        document.removeEventListener('paste', arguments.callee);
        // 单聊贴图发送
        document.addEventListener('paste', function (e) {
            if (e.clipboardData && e.clipboardData.types) {
                if (e.clipboardData.items.length > 0) {
                    if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
                        var blob = e.clipboardData.items[0].getAsFile();
                        var url = window.URL.createObjectURL(blob);
                        var id = connect.getUniqueId();             // 生成本地消息id
                        var msg = new WebIM.message('img', id);  // 创建图片消息
                        _this.messageQueue.set(id, msg);
                        msg.set({
                            apiUrl: WebIM.config.apiURL,
                            file: { data: blob, url: url },
                            to: touserid,                      // 接收消息对象
                            roomType: false,
                            chatType: 'singleChat',
                            onFileUploadError: function (error) {    // 消息上传失败
                                try {
                                    onFileUploadError();
                                }
                                catch (ex){

                                }
                                _this.messageQueue.delete(id);
                            },
                            onFileUploadComplete: function (data) {  // 消息上传成功
                                try {
                                    onFileUploadComplete();
                                }
                                catch (ex) {

                                }
                            },
                            success: function (id) {              // 消息发送成功
                                success(_this.messageQueue.get(id));
                                _this.messageQueue.delete(id);
                            }
                        });
                        connect.send(msg.body);
                    }
                }
            }
        });
    }
    // 群组发送文本消息
    this.sendGroupText = function (content, groupid, success) {
        var id = connect.getUniqueId();            // 生成本地消息id
        var msg = new WebIM.message('txt', id); // 创建文本消息
        var option = {
            msg: content,             // 消息内容
            to: groupid,                     // 接收消息对象(群组id)
            roomType: false,
            chatType: 'chatRoom',
            success: success,
            fail: function () {
                console.log('failed');
            }
        };
        msg.set(option);
        msg.setGroup('groupchat');
        connect.send(msg.body);
    };
    //获取群组列表
    this.getList = function (success,error) {
        // 列出当前登录用户加入的所有群组
        var options = {
            success: success,
            error:error
        }
            connect.getGroup(options);
    }
    //获取群成员表
    this.getMemberList = function (data,success) {
        var pageNum = 1,
            pageSize = 1000;
        var options = {
            pageNum: pageNum,
            pageSize: pageSize,
            groupId:data.groupid,
            success: success,
            error: function (e) { }
        };
        connect.listGroupMember(options);
    }
    // 获取群组黑名单
    this.getBlackList = function () {
        var option = {
            roomId: '1480758709661',
            success: function (list) {
                console.log('Get group black list: ', list);
            },
            error: function () {
                console.log('Get group black list error.');
            }
        };
        conn.getGroupBlacklist(option);
    };
    //建群
    this.create = function (data,success,error) {
        var options = {
            data: data,
            success: success,
            error: error
        };
        connect.createGroupNew(options);
    }
    //获取群信息
    this.getInfo = function () {
        var options = {
            groupId: gid,
            success: function (resp) {
                console.log("Response: ", resp);
            },
            error: function () { }
        };
        conn.getGroupInfo(options);
    }
    //修改群信息
    this.changeInfo = function () {
        var option = {
            roomId: '1480756943693',
            subject: 'ChangeTest',    // 群组名称
            description: 'Change group information test',  // 群组简介
            success: function () {
                console.log('Change Group Names Success!');
            }
        };
        conn.changeGroupSubject(option);
    }
    //拉好友进群
    this.addMembers = function () {
        var option = {
            list: ['asdfghj', 'wjy6'],
            roomId: '1480841456167'
        };
        conn.addGroupMembers(option);
    };
    //禁言
    this.noTalk = function (userid,groupid,success,error) {
        var options = {
            username:userid,
            muteDuration: 886400000,
            groupId: groupid,
            success: success,
            error: error
        };
        connect.mute(options);
    }
    //解除禁言
    this.Talk = function (userid,groupid,success,error) {
        var options = {
            groupId: groupid,
            username: userid,
            success: success,
            error: error
        };
        connect.removeMute(options);
    }
    //获取禁言名单
    this.getNoTalklist = function () {
        var options = {
            groupId: "groupId",
            success: function (resp) { },
            error: function (e) { }
        };
        conn.getMuted(options);
    }
    //设置群管理
    this.setAdmin = function () {
        var options = {
            groupId: "groupId",
            username: "user",
            success: function (resp) { },
            error: function (e) { }
        };
        conn.setAdmin(options);
    }
    //删除管理员
    this.removeAdmin = function () {
        var options = {
            groupId: "groupId",
            username: "user",
            success: function (resp) { },
            error: function (e) { }
        };
        conn.removeAdmin(options);
    }
    //获取管理员列表
    this.getAdminList = function () {
        var options = {
            groupId: "groupId",
            success: function (resp) { },
            error: function (e) { }
        };
        conn.getGroupAdmin(options);
    }
    //拉黑某成员
    this.addBlackMembers = function (userid,groupid,success,error) {
        var options = {
            groupId: groupid,
            username: userid,
            success: success,
            error: error
        };
        connect.groupBlockSingle(options);
    }
    //将某成员移除黑名单
    this.removeBlackMembers = function (userid, groupid, success, error) {
        var options = {
            groupId:groupid,
            username: userid,
            success: success,
            error: error
        }
        connect.removeGroupBlockSingle(options);
    }
    //解散群
    this.dissolve = function () {
        // 解散一个群组
        var dissolveGroup = function () {
            var option = {
                groupId: '1480840256052',
                success: function () {
                    console.log('Destroy group success!');
                }
            };
            conn.dissolveGroup(option);
        };
    }
    //离开群
    this.leave = function () {
        // 成员主动退出群
        var option = {
            to: 'asdfghj',
            roomId: '1480747027186',
            success: function () {
                console.log('You leave room succeed!');
            },
            error: function () {
                console.log('Leave room faild');
            }
        };
        conn.leaveGroupBySelf(option);
    }
    //获取公开群
    this.getOpenList = function () {
        var limit = 20,
            cursor = globalCursor;
        var options = {
            limit: limit,
            cursor: cursor,
            success: function (resp) {
                console.log("Response: ", resp);
                globalCursor = resp.cursor;
            },
            error: function (e) { }
        };
        conn.listGroups(options);
    }
    //加群
    this.join = function () {
        var options = {
            groupId: "groupId",
            success: function (resp) {
                console.log("Response: ", resp);
            },
            error: function (e) {
                if (e.type == 17) {
                    console.log("您已经在这个群组里了");
                }
            }
        };
        conn.joinGroup(options);
    }
    //同意申请
    this.agreeJoin = function () {
        var options = {
            applicant: applicant,
            groupId: groupId,
            success: function (resp) {
                console.log(resp);
            },
            error: function (e) { }
        };
        conn.agreeJoinGroup(options);
    }
    //拒绝申请
    this.rejectJoin = function () {
        var options = {
            applicant: applicant,
            groupId: groupId,
            success: function (resp) {
                console.log(resp);
            },
            error: function (e) { }
        };
        conn.rejectJoinGroup(options);
    }
}