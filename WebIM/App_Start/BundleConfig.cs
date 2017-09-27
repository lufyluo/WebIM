using System.Web;
using System.Web.Optimization;

namespace WebIM
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/js/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/js/modernizr").Include(
                        "~/Scripts/modernizr-*"));
            //js/websdk
            bundles.Add(new ScriptBundle("~/js/websdk").Include(
                        "~/Scripts/webim.config.js",
                        "~/Scripts/websdk.shim.js",
                        "~/Scripts/strophe-{version}.js",
                        "~/Scripts/websdk-{version}.js"
                        

                       ));
            //js/amr
            bundles.Add(new ScriptBundle("~/js/amr").Include(
                "~/Scripts/pcmdata.min.js",
                "~/Scripts/libamr-nb.js",
                "~/Scripts/util.js",
                "~/Scripts/amr.js",
                "~/Scripts/decoder.js",
                "~/Scripts/encoder.js",
                "~/Scripts/io.js"
                       ));

            bundles.Add(new ScriptBundle("~/js/webapi").Include(
                         "~/Scripts/webapi.js"));
            //js/webIM/Index
            bundles.Add(new ScriptBundle("~/js/WebIM/Index").Include(
                       "~/Scripts/WebIM/index.js"));
            //js/webIM/Manager
            bundles.Add(new ScriptBundle("~/js/WebIM/Manager").Include(
                      "~/Scripts/WebIM/manager.js"));
            //js/webIM/Chat
            bundles.Add(new ScriptBundle("~/js/WebIM/Chat").Include(
                      "~/Scripts/WebIM/chat.js"));
            //js/webIM/Login
            bundles.Add(new ScriptBundle("~/js/WebIM/Login").Include(
                      "~/Scripts/WebIM/login.js"));

            bundles.Add(new ScriptBundle("~/js/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/css/bootstrap").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
            //css/webIM/Index
            bundles.Add(new StyleBundle("~/css/WebIM/Index").Include(
                      "~/Content/WebIM/index.css"));
            //css/webIM/Manager
            bundles.Add(new StyleBundle("~/css/WebIM/Manager").Include(
                      "~/Content/WebIM/manager.css"));
            //css/webIM/Chat
            bundles.Add(new StyleBundle("~/css/WebIM/Chat").Include(
                      "~/Content/WebIM/chat.css"));
            //css/webIM/Login
            bundles.Add(new StyleBundle("~/css/WebIM/Login").Include(
                      "~/Content/WebIM/Login.css"));
            //css/webimui
            bundles.Add(new StyleBundle("~/css/webimui").Include(
                      "~/Content/iconfont.css"));
        }
    }
}
