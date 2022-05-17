using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using WebGIS.Common;

namespace WebGIS
{
    /// <summary>
    /// QueryData 的摘要说明
    /// </summary>
    public class QueryWar : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string where = HttpContext.Current.Request.Params["id"]; //获取参数
            //if (string.IsNullOrEmpty(where))
            //{
            //    context.Response.Write("");
            //    context.Response.End();
            //    return;
            //}
            //else
            //{
            //    context.Response.Write(where);
            //    context.Response.End();
            //}

            //Asppro.Data.DAL.B_SSSB_SBXX dal = new B_SSSB_SBXX();
            //System.Data.DataSet ds = dal.GetList(string.Format("SBDL='{0}'", sblx));
            //[舰名]
            //,[编号]
            //,[所属级别]
            //,[战舰类型]
            //,[服役时间]
            //,[所属国家]
            //,[战舰简介]
            string sql = "SELECT * from t_War";
            if (!string.IsNullOrEmpty(where))
            {
                sql += " where 战役名称 ='" + where+"'";
            }
            DataTable dt = SQLHelper.Instance.GetDataTable(sql);
            string sjson = string.Empty;

            if (dt != null && dt.Rows.Count > 0)
            {
                sjson = JsonConvert.SerializeObject(dt);
            }

            context.Response.Write(sjson); //jsonObj
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}