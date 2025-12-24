using Brocker.Api.DTOs;
using FluentValidation;

namespace Brocker.Api.Validators;

public class ReviewValidator : AbstractValidator<ReviewDto>
{
    public ReviewValidator()
    {
        RuleFor(x=>x.ReviewerName).NotEmpty().WithMessage("Reviewer name is required");
        RuleFor(x=>x.Rating).InclusiveBetween(1,5).WithMessage("Rating must be between 1 and 5");
        RuleFor(x=>x.Comment).MaximumLength(1000);
    }
}