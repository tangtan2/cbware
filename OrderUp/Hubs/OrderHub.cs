using System;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace OrderUp.Hubs
{
    public class OrderHub : Hub<IOrderClient>
    {
        private IConfiguration _configuration;

        public OrderHub(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public override async Task OnConnectedAsync()
        {
            // get web session id from http request
            var httpContext = Context.GetHttpContext();
            var webSessionId = httpContext.Request.Headers["X-websession"];

            using (var connection = new SqlConnection(_configuration["ConnectionStrings:DefaultConnection"]))
            {
                var command = new SqlCommand();
                command.Connection = connection;
                command.Connection.Open();

                // get user id associated with given web session id
                command.CommandText = @$"
                    SELECT users.*
                      FROM users
                      JOIN web_sessions
                        ON users.id = web_sessions.user_id
                     WHERE web_sessions.id = '{webSessionId}'
                ";
                var reader = command.ExecuteReader();

                // if no rows returned, web session id is not valid
                if (!reader.HasRows)
                {
                    reader.Close();
                    return;
                }
                else
                {
                    // get user id and add connection to group
                    reader.Read();
                    var userId = reader["id"].ToString();
                    var userRole = reader["user_role"].ToString();
                    reader.Close();

                    // add to warehouse group if necessary
                    if (userRole == "warehouse" || userRole == "administrator")
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, "warehouse");
                    }

                    // start hub connection
                    await Groups.AddToGroupAsync(Context.ConnectionId, userId);
                    await base.OnConnectedAsync();
                }
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // get web session id from http request
            var httpContext = Context.GetHttpContext();
            var webSessionId = httpContext.Request.Headers["X-websession"];

            using (var connection = new SqlConnection(_configuration["ConnectionStrings:DefaultConnection"]))
            {
                var command = new SqlCommand();
                command.Connection = connection;
                command.Connection.Open();

                // get user id associated with given web session id
                command.CommandText = @$"
                    SELECT users.*
                      FROM users
                      JOIN web_sessions
                        ON users.id = web_sessions.user_id
                     WHERE web_sessions.id = '{webSessionId}'
                ";
                var reader = command.ExecuteReader();

                // if no rows returned, web session id is not valid
                if (!reader.HasRows)
                {
                    reader.Close();
                    return;
                }
                else
                {
                    // get user id and remove connection from group
                    reader.Read();
                    var userId = reader["id"].ToString();
                    var userRole = reader["user_role"].ToString();
                    reader.Close();

                    // add to warehouse group if necessary
                    if (userRole == "warehouse" || userRole == "administrator")
                    {
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "warehouse");
                    }

                    // start hub connection
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
                    await base.OnDisconnectedAsync(exception);
                }
            }
        }
    }
}