using Microsoft.AspNetCore.Mvc;

namespace Audio2Text.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {

            return View();
        }
    }
}
