using Brocker.Api.Models;

namespace Brocker.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Agents.Any()) return;

        var agents = new List<Agent>
        {
            new Agent
            {
                FullName = "علی رضایی",
                CompanyName = "شرکت حمل و نقل رضایی",
                City = "تهران",
                YearsOfExperience = 8,
                RatingAverage = 4.6,
                NumberOfReviews = 12,
                Customs = new List<string>{"گمرک غرب", "گمرک جنوب"},
                GoodsTypes = new List<string>{"الکترونیک", "لباس"},
                IsVerified = true,
                Bio = "بیوگرافی نمونه با فرمت HTML یا markdown.",
                WorkingHours = "شنبه تا چهارشنبه 9-17",
                IsApproved = true
            },
            new Agent
            {
                FullName = "سارا محمدی",
                CompanyName = "شرکت ترخیص سارا",
                City = "اصفهان",
                YearsOfExperience = 3,
                RatingAverage = 4.2,
                NumberOfReviews = 5,
                Customs = new List<string>{"گمرک اصفهان"},
                GoodsTypes = new List<string>{"قطعات خودرو"},
                IsVerified = false,
                Bio = "توضیحات درباره خدمات.",
                WorkingHours = "شنبه تا سه شنبه 10-16",
                IsApproved = false
            }
        };

        db.Agents.AddRange(agents);

        var user = new User
        {
            Phone = "+989120000001",
            Name = "Admin",
            Role = UserRole.Admin,
            IsAgentApproved = true,
            IsProfileCompleted = true
        };

        db.Users.Add(user);

        // reviews
        db.Reviews.Add(new Review { AgentId = agents[0].Id, ReviewerName = "مشتری 1", Rating = 5, Comment = "عالی" });
        db.Reviews.Add(new Review { AgentId = agents[0].Id, ReviewerName = "مشتری 2", Rating = 4, Comment = "خوب" });

        db.AgentAnalytics.Add(new AgentAnalytics { AgentId = agents[0].Id, ProfileViews = 120 });

        db.SaveChanges();
    }
}