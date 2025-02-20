using backend_dotnet.src;

var startup = new StartupFactory().GetStartup(args);

await startup.StartAsync(args);
