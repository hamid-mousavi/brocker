using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Brocker.Api.Migrations
{
    public partial class AddAgentPhones : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Mobile",
                table: "Agents",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string[]>(
                name: "PhoneNumbers",
                table: "Agents",
                type: "text[]",
                nullable: false,
                defaultValue: new string[] { });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mobile",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "PhoneNumbers",
                table: "Agents");
        }
    }
}
