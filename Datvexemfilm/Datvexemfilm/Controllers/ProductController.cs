using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
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
        [HttpPost]
        public JsonResult OrderProduct(List<Order_Product> _order)
        {
            if (_order == null || !_order.Any())
            {
                return Json(new { success = false, message = "Không có sản phẩm nào để đặt hàng." });
            }
            foreach (var item in _order)
            {
                var orderproduct = new Order_Product
                {
                    Booking_ID = item.Booking_ID,
                    Product_ID = item.Product_ID,
                    quantity = item.quantity,
                    total = item.total
                };
                _dbContext.order_Products.Add(orderproduct);
            }
            _dbContext.SaveChanges();
            return Json(new {success = true });
        }
        [HttpGet]
        public JsonResult getallproduct()
        {
                var products = _dbContext.products.ToList();
                return Json(products, JsonRequestBehavior.AllowGet);
            }

        }
        [HttpPost]
        public JsonResult addProduct(Product _product)
        { }
    }
