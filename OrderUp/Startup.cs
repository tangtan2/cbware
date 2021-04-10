using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OrderUp.Hubs;

namespace OrderUp
{
    public class Startup
    {
        public IConfiguration Configuration;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // add services
        public void ConfigureServices(IServiceCollection services)
        {
            // add signalr
            services.AddSignalR();

            // add controllers to the container
            services.AddControllers();

            // in production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "Client/build";
            });
        }

        // configure http request pipeline
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // set up error handling
            if (env.IsDevelopment())
            {
                // display developer exception page for development environment
                app.UseDeveloperExceptionPage();
            }

            // use react app static files
            app.UseSpaStaticFiles();

            // match requests to endpoints
            app.UseRouting();

            // use api controller when making api calls
            app.MapWhen(x => x.Request.Path.Value.StartsWith("/api"), _ =>
            {
                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapHub<OrderHub>("api/hubs/order");
                });
            });

            // show react app for all other urls
            app.MapWhen(x => !x.Request.Path.Value.StartsWith("/api"), _ =>
            {
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "Client";
                    if (env.IsDevelopment())
                    {
                        spa.UseReactDevelopmentServer(npmScript: "start");
                    }
                });
            });
        }
    }
}
