using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebIM.Models.Api.User
{
    public class Login
    {
        private string _Ran;
        private string _Sign = "123";
        private string _Password;
        public string UserId { get; set; }
        public string Password
        {
            get
            {
                return _Password;
            }
            set
            {
                _Password = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(value, "MD5").ToUpper();
            }
        }
        public string Ran
        {
            get
            {
                Random R = new Random(9999);
                _Ran = R.Next().ToString();
                return _Ran;
            }
        }
        public string Sign => System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(_Sign + _Ran, "MD5").ToUpper();
    }
}