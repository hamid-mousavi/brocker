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
    public DbSet<RegistrationRequest> RegistrationRequests { get; set; } = null!;
    public DbSet<RegistrationAttachment> RegistrationAttachments { get; set; } = null!;
    public DbSet<RegistrationPhone> RegistrationPhones { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Reviews are separate entities with FK AgentId
        modelBuilder.Entity<Review>()
            .HasOne<Agent>()
            .WithMany(a => a.Reviews)
            .HasForeignKey(r => r.AgentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RegistrationAttachment>()
            .HasOne<RegistrationRequest>()
            .WithMany(r => r.Attachments)
            .HasForeignKey(a => a.RegistrationRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RegistrationPhone>()
            .HasOne<RegistrationRequest>()
            .WithMany(r => r.Phones)
            .HasForeignKey(p => p.RegistrationRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}