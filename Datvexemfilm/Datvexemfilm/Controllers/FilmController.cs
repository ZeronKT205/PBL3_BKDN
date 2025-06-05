using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Management;
using System.Web.Mvc;
using Datvexemfilm.Models;
namespace Datvexemfilm.Controllers
{
    public class FilmController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();

        [HttpGet]
        public JsonResult GetFilm()
        {
            try
            {
                var films = _dbContext.Films
               .Where(p => p.Status != "OFF")
               .Include(f => f.Film_Type)
               .Select(f => new
               {
                   f.ID_Movie,
                   f.src,
                   f.name,
                   Type = f.Film_Type.Name,
                   f.releaseDay,
                   f.Director,
                   f.Language,
                   f.Duration,
                   f.ShortDescription,
                   f.FullDescription,
                   f._Cast,
                   f.Status,
                   f.Poster,
                   f.Trailer
               })
               .ToList();
                return Json(films, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetFilm_On()
        {
            var films = _dbContext.Films
                .Where(p => p.Status == "ON")
                .Include(f => f.Film_Type)
                .Select(f => new
                {
                    f.ID_Movie,
                    f.src,
                    f.name,
                    Type = f.Film_Type.Name,
                    f.releaseDay,
                    f.Director,
                    f.Language,
                    f.Duration,
                    f.ShortDescription,
                    f.FullDescription,
                    f._Cast
                })
                .ToList();

            return Json(films, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilm_Next()
        {
            var films = _dbContext.Films
            .Where(p => p.Status == "NEXT")
            .Include(f => f.Film_Type)
            .Select(f => new
            {
                f.ID_Movie,
                f.src,
                f.name,
                Type = f.Film_Type.Name,
                f.releaseDay,
                f.Director,
                f.Language,
                f.Duration,
                f.ShortDescription,
                f.FullDescription,
                f._Cast
            })
            .ToList();
            return Json(films, JsonRequestBehavior.AllowGet);
        }
        public ActionResult detailmovie(int id)
        {
            var film = _dbContext.Films
                .Include(f => f.Film_Type)
                .FirstOrDefault(f => f.ID_Movie == id);
            if (film == null)
            {
                return HttpNotFound();
            }
            return View("~/Views/Home/detailmovie.cshtml", film);
        }

        [HttpPut]
        public JsonResult UpdateFilm(int id, Film movieData)
        {
            try
            {
                // Kiểm tra xem phim có tồn tại không
                var existingMovie = _dbContext.Films.Find(id);
                if (existingMovie == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy phim!" }, JsonRequestBehavior.AllowGet);
                }

                // Cập nhật thông tin phim
                existingMovie.name = movieData.name;
                existingMovie.src = movieData.src;
                existingMovie.releaseDay = movieData.releaseDay;
                existingMovie.ID_Type = movieData.ID_Type;
                existingMovie.Status = movieData.Status;
                existingMovie.Duration = movieData.Duration;
                existingMovie.Language = movieData.Language;
                existingMovie.Director = movieData.Director;
                existingMovie.FullDescription = movieData.FullDescription;
                existingMovie.ShortDescription = movieData.ShortDescription;
                existingMovie.Poster = movieData.Poster;
                existingMovie._Cast = movieData._Cast;
                existingMovie.Trailer = movieData.Trailer;

                // Lưu thay đổi vào database
                _dbContext.SaveChanges();

                return Json(new { success = true, message = "Cập nhật phim thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult gettype()
        {
            var _type = _dbContext.Film_Types.ToList();
            return Json(_type, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddFilm(Film moviedata)
        {
            _dbContext.Films.Add(moviedata);
            _dbContext.SaveChanges();
            return Json(new { success = false });
        }
        [HttpDelete]
        public JsonResult DeleteFilm(int id)
        {
            try
            {
                // Tìm phim cần xóa
                var film = _dbContext.Films.Find(id);
                if (film == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy phim!" }, JsonRequestBehavior.AllowGet);
                }

                // Lấy tất cả suất chiếu của phim
                var shows = _dbContext.Shows.Where(s => s.ID_Movie == id).ToList();

                foreach (var show in shows)
                {
                    // Lấy tất cả ghế của suất chiếu
                    var seats = _dbContext.Seats.Where(s => s.Show_ID == show.Show_ID).ToList();
                    foreach (var seat in seats)
                    {
                        // Xóa các đơn đặt ghế
                        var seatOrders = _dbContext.seatOrders.Where(so => so.Seat_ID == seat.Seat_ID).ToList();
                        _dbContext.seatOrders.RemoveRange(seatOrders);
                    }
                    _dbContext.Seats.RemoveRange(seats);

                    // Lấy tất cả đặt vé của suất chiếu
                    var bookings = _dbContext.Bookings.Where(b => b.Show_ID == show.Show_ID).ToList();
                    foreach (var booking in bookings)
                    {
                        // Xóa các đơn đặt đồ ăn
                        var orderProducts = _dbContext.order_Products.Where(op => op.Booking_ID == booking.Booking_ID).ToList();
                        _dbContext.order_Products.RemoveRange(orderProducts);

                        // Xóa thanh toán
                        var payment = _dbContext.payments.FirstOrDefault(p => p.Booking_ID == booking.Booking_ID);
                        if (payment != null)
                        {
                            _dbContext.payments.Remove(payment);
                        }
                    }
                    _dbContext.Bookings.RemoveRange(bookings);
                }

                // Xóa tất cả suất chiếu
                _dbContext.Shows.RemoveRange(shows);

                // Xóa phim
                _dbContext.Films.Remove(film);

                // Lưu thay đổi
                _dbContext.SaveChanges();

                return Json(new { success = true, message = "Xóa phim thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
