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
    public class QueryState : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string ShipName = HttpContext.Current.Request.Params["ShipName"]; //获取参数
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
            string sql = string.Format("select 相关州 from t_war where 舰名='{0}'",ShipName);
            DataTable dt = SQLHelper.Instance.GetDataTable(sql);
            string sjson = string.Empty;

            List<string> listrs = new List<string>();
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    try
                    {
                        string[] arrtemp = dr["相关州"].ToString().Split('，');
                        if (arrtemp != null && arrtemp.Length > 0)
                        {
                            foreach (string s in arrtemp)
                            {
                                if (!listrs.Contains(s))
                                {
                                    listrs.Add(s);
                                }
                            }
                        }
                    }
                    catch
                    { }
                }
            }

            if (dt != null && dt.Rows.Count > 0)
            {
                sjson = JsonConvert.SerializeObject(listrs);
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