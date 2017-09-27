function GroupApi(user) {
    var currentUser=user;
    //获取群组列表
    this.getList = function () {
        // 列出当前登录用户加入的所有群组
        var options = {
            success: function (resp) {
                console.log("Response: ", resp)
            },
            error: function (e) { }            
        }
        conn.getGroup(options);
    }
    //获取群成员表
    this.getMemberList = function () {
        var pageNum = 1,
            pageSize = 1000;
        var options = {
            pageNum: pageNum,
            pageSize: pageSize,
            groupId: 'yourGroupId',
            success: function (resp) { console.log("Response: ", resp) },
            error: function (e) { }
        };
        conn.listGroupMember(options);
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
    this.create = function () {
        var options = {
            data: {
                groupname: value,
                desc: info,
                members: friendsSelected,
                public: pub,
                approval: approval,
                allowinvites: allowInvites
            },
            success: function (respData) { },
            error: function () { }
        };
        conn.createGroupNew(options);
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
    this.noTalk = function () {
        var options = {
            username: "user",
            muteDuration: 886400000,
            groupId: "groupId",
            success: function (resp) { },
            error: function (e) { }
        };
        conn.mute(options);
    }
    //解除禁言
    this.Talk = function () {
        var options = {
            groupId: "groupId",
            username: "user",
            success: function (resp) { },
            error: function (e) { }
        };
        conn.removeMute(options);
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
    this.addBlackMembers = function () {
        var options = {
            groupId: 'Your groupId',
            username: ['user1', 'user2', ...users],
            success: function (resp) {
                console.log("Response: ", resp);
            },
            error: function (e) { }
        };
        conn.groupBlockMulti(options);
    }
    //将某成员移除黑名单
    this.removeBlackMembers = function () {
        var options = {
            groupId: "Your Group ID",
            username: ["user1", "user2"],
            success: function (resp) {
                console.log("Response: ", resp);
            },
            error: function (e) { };
        }
        conn.removeGroupBlockMulti(options);
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