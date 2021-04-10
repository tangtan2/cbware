using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postUserLogin
    {
        public static ActionResult<WebSessionModel> Execute(PostUserLoginType data, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // get user with the same username as given value
                    command.CommandText = @$"
                        SELECT users.id
                             , passwords.hashed_password
                             , passwords.salt
                          FROM users
                          JOIN passwords
                            ON users.id = passwords.user_id
                         WHERE users.username = '{data.username}'
                           AND passwords.expired IS NULL
                    ";
                    var reader = command.ExecuteReader();

                    // if nothing was returned, user does not exist with given username
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get user id and password
                    reader.Read();
                    var userId = reader["id"].ToString();
                    var passwordSalt = reader["salt"].ToString();
                    var passwordHashed = reader["hashed_password"].ToString();
                    reader.Close();

                    // hash given password
                    var credentialsHashedPassword = UserController.ApplyHash(
                        UserController.DecodeSalt(passwordSalt),
                        data.password
                    );

                    // if given password does not match database, unauthorized
                    if (credentialsHashedPassword != passwordHashed)
                    {
                        return new UnauthorizedResult();
                    }

                    // if here, the password is correct and a web session can be made
                    command.CommandText = @$"
                        INSERT INTO web_sessions ( user_id )
                             OUTPUT inserted.*
                             VALUES ( '{userId}' )
                    ";
                    reader = command.ExecuteReader();

                    // if nothing was returned, web session was not created
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // reader return row to get web session id
                    reader.Read();
                    var webSession = new WebSessionModel(reader);
                    reader.Close();

                    // if here, everything ran properly
                    return new OkObjectResult(webSession);
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