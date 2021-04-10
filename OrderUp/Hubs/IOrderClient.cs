using System.Collections.Generic;
using System.Threading.Tasks;
using OrderUp.Models;

namespace OrderUp.Hubs
{
    public interface IOrderClient
    {
        Task ReceiveOrderCompletionUpdate(OrderModel broadcastObject);
        Task ReceiveNewOrders(List<OrderModel> broadcastObject);
    }
}