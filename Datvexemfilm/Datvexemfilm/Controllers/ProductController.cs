using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class ProductController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();
        [HttpGet]
        public JsonResult GetProduct()
        {
            try
            {
                var products = _dbContext.products
                    .Where(p => p.Status == "Active")
                    .Select(p => new
                    {
                        p.Product_ID,
                        p.Name,
                        p.Description,
                        p.Price,
                        p.img,
                        p.Status
                    })
                    .ToList();
                return Json(products, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}