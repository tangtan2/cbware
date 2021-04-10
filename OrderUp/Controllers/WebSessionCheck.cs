using System;
using Microsoft.Data.SqlClient;

public static class WebSessionCheck
{
    public static bool Check(Guid webSessionId, SqlConnection connection, SqlCommand command)
    {
        // check webSessionId is active
        command.CommandText = @$"
            SELECT web_sessions.*
              FROM web_sessions
             WHERE web_sessions.id = '{webSessionId}'
               AND web_sessions.expired IS NULL
        ";
        var webSessionFound = command.ExecuteNonQuery();

        // if nothing was returned, then web session is inactive
        if (webSessionFound == 0)
        {
            return false;
        }

        return true;
    }
}