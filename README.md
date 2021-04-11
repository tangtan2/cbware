# cbware
### Real-time ordering app

*This application was not built for commercial use. Download at your own risk.*

cbware is a real-time ordering app that allows users to place orders that will then appear on any warehouse personnel's screens. When an order is completed by the warehouse, users will see that order disappear off their screen as well. 

---

### Installation instructions

1. Create virtual machine using desired software (if using Hyper-V, make sure to create an external switch for the virtual machine so it can be access from other computers on the network)
2. Set a static IP address for the virtual machine
3. Install Windows Server 2012+ on virtual machine
4. Install Microsoft SQL Server and run database scripts
5. Publish dotnet application
    1. Create basic appsettings.json file
    2. Add database connection string to appsettings.json
    3. Change REACT_APP_API_URL parameter in .env file to be the static IP address of the virtual machine
    4. Install [ASP.NET](http://asp.NET) Core 5.0 SDK if not already installed and run "dotnet publish -c Release"
6. (From this step, all actions are done on the VM) Activate the following roles/features:
    1. Server Roles - Web Server (IIS) - Management Tools
    2. Server Roles - Web Server (IIS) - Web Server - Common HTTP Features - Default Document
    3. Server Roles - Web Server (IIS) - Web Server - Common HTTP Features - Directory Browsing
    4. Server Roles - Web Server (IIS) - Web Server - Common HTTP Features - HTTP Errors
    5. Server Roles - Web Server (IIS) - Web Server - Common HTTP Features - Static Content
    6. Server Roles - Web Server (IIS) - Web Server - Health and Diagnostics - HTTP Logging
    7. Server Roles - Web Server (IIS) - Web Server - Performance - Static Content Compression
    8. Server Roles - Web Server (IIS) - Web Server - Security - Request Filtering
    9. Server Roles - Web Server (IIS) - Web Server - Application Development - .NET Extensibility 4.7
    10. Server Roles - Web Server (IIS) - Web Server - Application Development - [ASP.NET](http://asp.NET) 4.7
    11. Server Roles - Web Server (IIS) - Web Server - Application Development - ISAPI Extensions
    12. Server Roles - Web Server (IIS) - Web Server - Application Development - ISAPI Filters
    13. Server Roles - Web Server (IIS) - Web Server - Application Development - WebSocket Protocol
    14. Features - .NET Framework 4.7 Features - .NET Framework 4.7
    15. Features - .NET Framework 4.7 Features - [ASP.NET](http://asp.NET) 4.7
    16. Features - WCF Services - TCP Port Sharing
7. Install [ASP.NET](http://asp.NET) Core 5.0 hosting bundle
8. Copy the published application files from "bin/Release/net5.0/publish" over to a folder on the virtual machine
9. Give the following users full control over folder containing published application files
    1. IIS_IUSRS
    2. NETWORK
    3. NETWORK_SERVICE
10. Add a website to IIS
    1. Point to folder containing the published application files
    2. Add binding to "All Unassigned IPs" and desired port
    3. Start website
11. Add incoming rule to Windows Firewall exposing your application's port
12. (Optional) Add Reverse Proxy rule on IIS to redirect from port 80 to your application's port
13. (Optional) Create hostname on local DNS server to access website

---

### Version history

2021-04-10: Beta version b1.00
