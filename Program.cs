using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Serilog;
using Serilog.Events;
using System;

namespace ERP
{
    public class Program
    { //CreateWebHostBuilder(args).Build().Run();
        public static int Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext()
          .WriteTo.File(@"f:\log\log.txt", rollingInterval: RollingInterval.Day)
          .CreateLogger();
            try
            {
                Log.Information("Starting web host");
                CreateWebHostBuilder(args).Build().Run();
                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseSerilog().UseStartup<Startup>();
    }
}
