# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . ./
RUN dotnet restore "Brocker.Api.csproj"
RUN dotnet publish "Brocker.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
# Ensure wwwroot/uploads exists so StaticFileMiddleware can serve uploaded files
RUN mkdir -p /app/wwwroot/uploads && chmod -R 755 /app/wwwroot
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "Brocker.Api.dll"]
