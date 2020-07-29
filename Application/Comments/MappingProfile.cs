using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(destionation => destionation.Username, option => option.MapFrom(source => source.Author.UserName))
                .ForMember(destionation => destionation.DisplayName, option => option.MapFrom(source => source.Author.DisplayName))
                .ForMember(destionation => destionation.Image, option => option.MapFrom(source => source.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}