using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebIM.Models.WebIM;

namespace WebIM.Controllers
{
    public class WebIMController : Controller
    {
        public ActionResult Index()
        {
            Index model = new Index();
            if (System.Web.HttpContext.Current.Session["userid"] == null)
            {
                Response.Redirect("/WebIM/Login");
                return View(model);
            }
            model.userid = System.Web.HttpContext.Current.Session["userid"].ToString();
            model.username = System.Web.HttpContext.Current.Session["username"].ToString();
            return View(model);
        }

        public ActionResult Login()
        {
            return View();
        }

    }
}