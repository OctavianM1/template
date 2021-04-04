using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace project.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ActivityController : ControllerBase
    {
        private readonly ProjectContext _context;

        public ActivityController(ProjectContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            var activities = await _context.Activities.ToListAsync();

            return Ok(activities);
        }

        [HttpGet("{activityId}")]
        public async Task<ActionResult<Activity>> GetActivityById(int activityId)
        {
            var activity = await _context.Activities.FindAsync(activityId);

            if (activity == null)
            {
                return NotFound();
            }

            return Ok(activity);
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityRequest request)
        {
            var newActivity = new Activity
            {
                Name = request.Name
            };

            _context.Activities.Add(newActivity);

            await _context.SaveChangesAsync();

            return Ok("Created");
        }

        [HttpPut("{activityId}")]
        public async Task<ActionResult<Activity>> UpdateActivity(int activityId, CreateActivityRequest request)
        {
            var activity = await _context.Activities.FindAsync(activityId);
            if (activity == null)
            {
                return NotFound();
            }

            activity.Name = request.Name;

            await _context.SaveChangesAsync();

            return Ok(activity);
        }

        [HttpDelete("{activityId}")]
        public async Task<ActionResult> DeleteActivity(int activityId)
        {
            var activity = await _context.Activities.FindAsync(activityId);
            if (activity == null)
            {
                return NotFound();
            }
            _context.Activities.Remove(activity);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateActivityRequest
    {
        public string Name { get; set; }
    }
}
