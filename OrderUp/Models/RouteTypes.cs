using System;

namespace OrderUp.Models
{
    public class PostUserLoginType
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class PostNewUserType
    {
        public string username { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string userRole { get; set; }
        public string password { get; set; }
    }

    public class PostVerifyUserType
    {
        public string username { get; set; }
        public Guid webSessionId { get; set; }
    }

    public class PostUpdateUserPasswordType
    {
        public string username { get; set; }
        public string oldPassword { get; set; }
        public string newPassword { get; set; }
    }

    public class PostResetUserPasswordType
    {
        public string username { get; set; }
        public string newPassword { get; set; }
    }

    public class PostUpdateUserRoleType
    {
        public string username { get; set; }
        public string newUserRole { get; set; }
    }

    public class PostNewOrdersType
    {
        public string part { get; set; }
        public double quantity { get; set; }
        public string orderer { get; set; }
        public string workOrder { get; set; }
        public string notes { get; set; }
    }

    public class PostUpdateOrderType
    {
        public Guid id { get; set; }
        public string completedNotes { get; set; }
    }
}