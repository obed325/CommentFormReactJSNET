using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommentForm.Models;

namespace CommentForm.Controllers
{
    public class HomeController : Controller
    {
        private static readonly IList<CommentModel> _comments;
        static HomeController()
        {
            _comments = new List<CommentModel>
            {
                new CommentModel
                {
                    Id= 1,
                    Author = "Börje Lundin",
                    Text = "ReactJS.Net "
                },
                new CommentModel
                {
                     Id = 2,
                    Author = "Torsten Bengtsson",
                    Text = "Mera kommentarer"
                },
                new CommentModel
                {
                    Id = 3,
                    Author ="Roger",
                    Text = "Ännu en *kommentar*"
                },
            };
        }
        public IActionResult Index()
        {
            return View(_comments);
        }
        [Route("comments")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Comments()
        {
            return Json(_comments);
        }

        [Route("comments/new")]
        [HttpPost]
        public ActionResult AddComment(CommentModel comment)
        {
            //create fake id
            comment.Id = _comments.Count + 1;
            _comments.Add(comment);
            return Content("Success :)");
        }
    }
}
