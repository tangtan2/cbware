using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OrderUp.Hubs;
using OrderUp.Models;
using OrderUp.Controllers.Routes;

namespace OrderUp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private IHubContext<OrderHub, IOrderClient> _hub;
        private IConfiguration _configuration;

        public OrderController(IHubContext<OrderHub, IOrderClient> hub, IConfiguration configuration)
        {
            _hub = hub;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("")]
        public ActionResult<string> GetRoot()
        {
            return new OkObjectResult("You are at the order controller root page!");
        }

        [HttpGet]
        [Route("parts")]
        public ActionResult<List<string>> GetAllOrderParts([FromHeader(Name = "X-websession")] Guid webSessionId)
        {
            return getAllOrderParts.Execute(webSessionId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("parts/new")]
        public ActionResult<List<string>> PostNewOrderParts([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] List<string> newParts)
        {
            return postNewOrderParts.Execute(webSessionId, newParts, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("parts/delete")]
        public ActionResult<string> PostDeleteOrderPart([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] string deletedPart)
        {
            return postDeleteOrderPart.Execute(webSessionId, deletedPart, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("active")]
        public ActionResult<List<OrderModel>> GetActiveOrdersPerUser([FromHeader(Name = "X-websession")] Guid webSessionId)
        {
            return getActiveOrdersPerUser.Execute(webSessionId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("active/all")]
        public ActionResult<List<OrderModel>> GetActiveOrdersAllUsers([FromHeader(Name = "X-websession")] Guid webSessionId)
        {
            return getActiveOrdersAllUsers.Execute(webSessionId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("historical/date")]
        public ActionResult<List<OrderModel>> GetHistoricalOrdersByDatePerUser([FromHeader(Name = "X-websession")] Guid webSessionId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return getHistoricalOrdersByDatePerUser.Execute(webSessionId, startDate, endDate, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("historical/all/date")]
        public ActionResult<List<OrderModel>> GetHistoricalOrdersByDateAllUsers([FromHeader(Name = "X-websession")] Guid webSessionId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return getHistoricalOrdersByDateAllUsers.Execute(webSessionId, startDate, endDate, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("historical/limit/{limit}")]
        public ActionResult<List<OrderModel>> GetHistoricalOrdersByLimitPerUser([FromHeader(Name = "X-websession")] Guid webSessionId, [FromRoute] int limit)
        {
            return getHistoricalOrdersByLimitPerUser.Execute(webSessionId, limit, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("historical/all/limit/{limit}")]
        public ActionResult<List<OrderModel>> GetHistoricalOrdersByLimitAllUsers([FromHeader(Name = "X-websession")] Guid webSessionId, [FromRoute] int limit)
        {
            return getHistoricalOrdersByLimitAllUsers.Execute(webSessionId, limit, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("new")]
        public ActionResult<List<OrderModel>> PostNewOrders([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] List<PostNewOrdersType> data)
        {
            var actionResult = postNewOrders.Execute(webSessionId, data, _configuration["ConnectionStrings:DefaultConnection"]);
            // send update to warehouse clients
            _hub.Clients
                .Group("warehouse")
                .ReceiveNewOrders((List<OrderModel>)((OkObjectResult)actionResult.Result).Value);
            return actionResult;
        }

        [HttpPost]
        [Route("update")]
        public ActionResult<OrderModel> PostUpdateOrder([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] PostUpdateOrderType data)
        {
            var actionResult = postUpdateOrder.Execute(webSessionId, data, _configuration["ConnectionStrings:DefaultConnection"]);
            // send update to user client
            _hub.Clients
                .Group(((OrderModel)((OkObjectResult)actionResult.Result).Value).userId.ToString())
                .ReceiveOrderCompletionUpdate((OrderModel)((OkObjectResult)actionResult.Result).Value);
            return actionResult;
        }
    }
}
