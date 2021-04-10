using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postUpdateUserPassword
    {
        public static ActionResult<UserModel> Execute(Guid webSessionId, PostUpdateUserPasswordType data, string connectionString)
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

                    // get user and password details for user with given username
                    command.CommandText = @$"
                        SELECT users.*
                             , passwords.hashed_password
                             , passwords.salt
                          FROM users
                          JOIN passwords
                            ON users.id = passwords.user_id
                         WHERE users.username = '{data.username}'
                           AND passwords.expired IS NULL
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, no user found with given username
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned rows to get user details
                    reader.Read();
                    var user = new UserModel(reader);
                    var passwordSalt = reader["salt"].ToString();
                    var passwordHashed = reader["hashed_password"].ToString();
                    reader.Close();

                    // check old password is the same as password in database
                    var oldHashedPassword = UserController.ApplyHash(
                        Convert.FromBase64String(passwordSalt),
                        data.oldPassword
                    );
                    if (oldHashedPassword != passwordHashed)
                    {
                        return new UnauthorizedResult();
                    }

                    // hash new password
                    var newSalt = UserController.NewSalt();
                    var newSaltString = UserController.EncodeSalt(newSalt);
                    var newHashedPassword = UserController.ApplyHash(
                        newSalt,
                        data.newPassword
                    );

                    // insert new password
                    command.CommandText = @$"
                        INSERT INTO passwords ( user_id
                                              , hashed_password
                                              , salt
                                              )
                             VALUES ( '{user.id}'
                                    , '{newHashedPassword}'
                                    , '{newSaltString}'
                                    )
                    ";
                    var rowsAffected = command.ExecuteNonQuery();

                    // if no rows affected, password was not inserted
                    if (rowsAffected != 1)
                    {
                        return new BadRequestResult();
                    }

                    // expire old password
                    command.CommandText = @$"
                        UPDATE passwords
                           SET expired = GETDATE()
                         WHERE user_id = '{user.id}'
                           AND hashed_password = '{oldHashedPassword}'
                    ";
                    rowsAffected = command.ExecuteNonQuery();

                    // if no rows affected, password to be expired was not found
                    if (rowsAffected != 1)
                    {
                        return new BadRequestResult();
                    }

                    return new OkObjectResult(user);
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