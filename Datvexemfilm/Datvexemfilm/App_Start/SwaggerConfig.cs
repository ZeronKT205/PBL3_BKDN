using Swashbuckle.Application;
using System.Web.Http;

namespace Datvexemfilm
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            var thisAssembly = typeof(SwaggerConfig).Assembly;

            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                {
                    c.SingleApiVersion("v1", "Datvexemfilm API");
                })
                .EnableSwaggerUi();
        }

    }
}