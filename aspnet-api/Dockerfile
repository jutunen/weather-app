from mcr.microsoft.com/dotnet/core/sdk:3.1

WORKDIR /jussi
COPY . .
RUN dotnet publish -c Release -o out
EXPOSE 5000
CMD dotnet bin/Release/netcoreapp3.1/aspnet-api.dll
