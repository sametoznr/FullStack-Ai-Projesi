# 1. Adım: Projeyi build etmek (derlemek) için .NET SDK'sını kullan
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# DÜZELTME: Klasör adı büyük/küçük harfe duyarlıdır. "AiApi" olarak güncellendi.
COPY backend/AiApi/*.csproj ./
RUN dotnet restore

# DÜZELTME: Klasör adı "AiApi" olarak güncellendi.
COPY backend/AiApi/. ./

# DÜZELTME: Proje dosyası adı "AiApi.csproj" olarak güncellendi.
RUN dotnet publish "AiApi.csproj" -c Release -o /app/publish

# 2. Adım: Uygulamayı çalıştırmak için daha küçük olan runtime imajını kullan
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
# DÜZELTME: DLL adı "AiApi.dll" olarak güncellendi.
ENTRYPOINT ["dotnet", "AiApi.dll"]

