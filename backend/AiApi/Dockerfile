# 1. Adım: Projeyi build etmek (derlemek) için .NET SDK'sını kullan
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Proje dosyasını kopyala ve bağımlılıkları yükle
COPY *.csproj .
RUN dotnet restore

# Tüm proje dosyalarını kopyala ve publish et (yayınla)
COPY . .
RUN dotnet publish -c Release -o /app/publish

# 2. Adım: Uygulamayı çalıştırmak için daha küçük olan runtime imajını kullan
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Uygulamanın hangi portta çalışacağını belirt (Render bunu otomatik yönetir)
EXPOSE 80

# Uygulamayı çalıştıracak son komut
ENTRYPOINT ["dotnet", "aiapi.dll"]
