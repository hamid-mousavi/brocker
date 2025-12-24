using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Brocker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRegistrationRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegistrationRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    CompanyName = table.Column<string>(type: "text", nullable: false),
                    LegalType = table.Column<int>(type: "integer", nullable: false),
                    Mobile = table.Column<string>(type: "text", nullable: false),
                    OfficePhone = table.Column<string>(type: "text", nullable: false),
                    HomePhone = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: true),
                    Longitude = table.Column<double>(type: "double precision", nullable: true),
                    Customs = table.Column<List<string>>(type: "text[]", nullable: false),
                    GoodsTypes = table.Column<List<string>>(type: "text[]", nullable: false),
                    YearsOfExperience = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegistrationAttachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RegistrationRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrationAttachments_RegistrationRequests_RegistrationRe~",
                        column: x => x.RegistrationRequestId,
                        principalTable: "RegistrationRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationAttachments_RegistrationRequestId",
                table: "RegistrationAttachments",
                column: "RegistrationRequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistrationAttachments");

            migrationBuilder.DropTable(
                name: "RegistrationRequests");
        }
    }
}
