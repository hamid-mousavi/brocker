using Brocker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Brocker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Agent> Agents { get; set; } = null!;
    public DbSet<License> Licenses { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<AgentAnalytics> AgentAnalytics { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Reviews are separate entities with FK AgentId
        modelBuilder.Entity<Review>()
            .HasOne<Agent>()
            .WithMany(a => a.Reviews)
            .HasForeignKey(r => r.AgentId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}