using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postDeleteUser
    {
        public static ActionResult<UserModel> Execute(Guid webSessionId, Guid userId, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // authenticate web session
                    if (!WebSessionCheck.Check(webSessionId, connection, command))
                    {
                        return new UnauthorizedResult();
                    }

                    // delete passwords associated with given user
                    command.CommandText = @$"
                        DELETE FROM passwords
                         WHERE passwords.user_id = '{userId}'
                    ";
                    command.ExecuteNonQuery();

                    // delete user
                    command.CommandText = @$"
                        DELETE FROM users
                        OUTPUT deleted.*
                         WHERE users.id = '{userId}'
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned then user was not deleted
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get deleted user
                    reader.Read();
                    var deletedUser = new UserModel(reader);
                    reader.Close();

                    return new OkObjectResult(deletedUser);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new BadRequestResult();
            }
        }
    }
}