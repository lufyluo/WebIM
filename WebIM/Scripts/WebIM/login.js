$(document).ready(function () {
    $("#btn-login").click(function (e) {
        $.post("/api/user/Login",
            {
                UserId:$("#userid").val(),
                Password: $("#password").val()
            },
            function (data) {
                data = jQuery.parseJSON(data);
                if (data.back !== "密码错误")
                {
                    window.location.href = "/WebIM/Index";
                }
            },
            "json");//这里返回的类型有：json,html,xml,text
    });
});