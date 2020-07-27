Alternatively to use Eager Loading method that use the keywords 'Include' and 'ThenInclude', we can use Lazy Loading to achieve the samething to load the related data

1/ Install-package Microsoft.EntityFrameworkCore.Proxies (to Persistence.csproj)

2/ ConfigureServices (in Startup.cs), right before opt.SQlite as:
    opt.UseLazyLoadingProxies();

3/ Use 'virtual' keyword in:
    - Activity.cs 
        FROM (public ICollection<UserActivity>UserActivities{get; set;})
        TO   (public virtual ICollection<UserActivity>UserActivities{get; set;})

    - AppUser.cs 
        FROM (public ICollection<UserActivity>UserActivities{get; set;})
        TO   (public virtual ICollection<UserActivity>UserActivities{get; set;})

    - UserActivity.cs (to the navigation properties)
        FROM (public AppUser AppUser {get; set;}) AND (public Activity Activity {get; set;})
        TO   (public virtual AppUser AppUser {get; set;}) AND (public virtual Activity Activity {get; set;})

4/ Replace Eager Loading with Lazy Loading in:
    - List.cs:
        FROM (var activities = await _context.Activities.Include(a=>a.UserActivities)).ThenInclude(a=>a.AppUser).ToListAsync())
        TO   (var activities = await _context.Activities.ToListAsync())

    - Details.cs:
        FROM (var activity = await _context.Activities.Include(a=>a.UserActivities)).ThenInclude(a=>a.AppUser).SingleOrDefaultAsync(a=>a.Id == request.Id))
        TO   (var activity = await _context.Activities.FindAsync(request.Id))