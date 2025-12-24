using Brocker.Api.DTOs;
using FluentValidation;

namespace Brocker.Api.Validators;

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x=>x.Phone).NotEmpty().WithMessage("Phone is required");
    }
}