# 1. Adım: Projeyi build etmek (derlemek) için .NET SDK'sını kullan
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# DEĞİŞİKLİK: Proje dosyasını doğru yoldan kopyala (ana dizine göre)
COPY backend/aiapi/*.csproj ./
RUN dotnet restore

# DEĞİŞİKLİK: Projenin geri kalan tüm dosyalarını doğru yoldan kopyala
COPY backend/aiapi/. ./

# Publish ederken proje adını belirtmek daha güvenilirdir
RUN dotnet publish "aiapi.csproj" -c Release -o /app/publish

# 2. Adım: Uygulamayı çalıştırmak için daha küçük olan runtime imajını kullan
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AiApi.dll"]
