using System;
using System.Collections.Generic;

namespace Brocker.Api.DTOs
{
    public class RegistrationRequestSummaryDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class RegistrationAttachmentDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class RegistrationPhoneDto { public string Type { get; set; } = string.Empty; public string Number { get; set; } = string.Empty; }

    public class RegistrationRequestDto : RegistrationRequestSummaryDto
    {
        public string Address { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string> Customs { get; set; } = new();
        public List<string> GoodsTypes { get; set; } = new();
        public int YearsOfExperience { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<RegistrationAttachmentDto> Attachments { get; set; } = new();
        public List<RegistrationPhoneDto> Phones { get; set; } = new();
    }
}
