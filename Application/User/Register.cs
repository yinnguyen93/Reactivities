using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidor : AbstractValidator<Command>
        {
            public CommandValidor()
            {
                RuleFor(c => c.DisplayName).NotEmpty();
                RuleFor(c => c.Username).NotEmpty();
                RuleFor(c => c.Email).NotEmpty().EmailAddress();
                RuleFor(c => c.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _context = context;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(appUser => appUser.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exist" });

                if (await _context.Users.AnyAsync(appUser => appUser.UserName == request.Username))
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Username already exist" });

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    {
                        return new User
                        {
                            DisplayName = user.DisplayName,
                            Token = _jwtGenerator.CreateToken(user),
                            Username = user.UserName,
                            Image = null
                        };
                    }
                }

                throw new Exception("Problem creating user");
            }
        }
    }
}