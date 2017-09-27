using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebIM.Models.Api.User;

namespace WebIM.Controllers
{
    public class UserController : ApiController
    {
        [HttpPost]
        public async System.Threading.Tasks.Task<object> GetAllUser()
        {
            GetAllUser GAU = new GetAllUser();
            GAU.UserId = System.Web.HttpContext.Current.Session["userid"].ToString();
            string Password = System.Web.HttpContext.Current.Session["password"].ToString();
            using (var client = new HttpClient())
            {
                var values = new List<KeyValuePair<string, string>>();
                values.Add(new KeyValuePair<string, string>("UserId", GAU.UserId));
                values.Add(new KeyValuePair<string, string>("Password",Password));
                values.Add(new KeyValuePair<string, string>("Ran", GAU.Ran));
                values.Add(new KeyValuePair<string, string>("Sign", GAU.Sign));
                var content = new FormUrlEncodedContent(values);

                var response = await client.PostAsync("http://116.62.232.164:9898/api/user/GetAllUser", content);

                var responseString = await response.Content.ReadAsStringAsync();
                Dictionary<int, string> Branch = new Dictionary<int, string>();
                Dictionary<int, string> Department = new Dictionary<int, string>();
                JObject jo = (JObject)JsonConvert.DeserializeObject(responseString);
                List<JToken> newjo=new List<JToken>();
                JToken[] fristmenu = jo["back"]["menufirst"].ToArray();
                JObject headoffice = new JObject();
                headoffice.Add("id", 0);
                headoffice.Add("name", "总公司");
                newjo.Add(headoffice);
                Branch.Add(0, "总公司");
                foreach(JObject item in fristmenu)
                {
                    Branch.Add((int)item["id"],item["name"].ToString());
                    newjo.Add(item);
                }               
                JToken[] secendmenu = jo["back"]["menusecend"].ToArray();
                foreach(JObject item in secendmenu)
                {
                    JObject i = new JObject();
                    i.Add("id", item["BranchId"] + "," + item["id"]);
                    i.Add("name", item["name"]);
                    i.Add("parent", item["BranchId"]);
                    newjo.Add(i);
                    Department.Add((int)item["id"], item["name"].ToString());
                }
                JToken[] usermenu = jo["back"]["userallmenu"].ToArray();
                foreach (JObject item in usermenu)
                {
                    try
                    {
                        JObject i = item;
                        i.Add("parent", item["BranchId"] + "," + item["DeptId"]);
                        i.Add("job", Branch[(int)item["BranchId"]] + "/" + Department[(int)item["DeptId"]]);
                        newjo.Add(i);
                    }
                    catch (Exception ex)
                    {

                    }
                }
                
                return newjo.ToArray();
            }
        }
        [HttpPost]
        public async System.Threading.Tasks.Task<object> Login(Login L)
        {
            using (var client = new HttpClient())
            {
                var values = new List<KeyValuePair<string, string>>();
                values.Add(new KeyValuePair<string, string>("UserId", L.UserId));
                values.Add(new KeyValuePair<string, string>("Password", L.Password));
                values.Add(new KeyValuePair<string, string>("Ran", L.Ran));
                values.Add(new KeyValuePair<string, string>("Sign", L.Sign));
                var content = new FormUrlEncodedContent(values);

                var response = await client.PostAsync("http://116.62.232.164:9898/api/user/gethx", content);

                var responseString = await response.Content.ReadAsStringAsync();
                JObject jo = (JObject)JsonConvert.DeserializeObject(responseString);
                if (jo["back"].ToString()!="密码错误") {
                    System.Web.HttpContext.Current.Session.Add("userid",L.UserId);
                    System.Web.HttpContext.Current.Session.Add("password", L.Password);
                    System.Web.HttpContext.Current.Session.Add("username", jo["back"].ToString());
                }
                return responseString;
            }
        }
    }
}
