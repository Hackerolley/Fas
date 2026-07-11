import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminNav from "./AdminNav";
import api from "../../api/axios";


// Admin order details page displays a complete order record.
const AdminOrderDetails = () => {

  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const { data } = await api.get(`/admin/orders/${id}`);

        setOrder(data);


      } catch (error) {

        console.error(
          "Failed to fetch order:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrder();


  }, [id]);



  if (loading) {

    return (

      <section className="mx-auto max-w-7xl px-4 py-12">

        <AdminNav />

        <p className="mt-8 text-sm text-gray-500">
          Loading order details...
        </p>

      </section>

    );

  }



  if (!order) {

    return (

      <section className="mx-auto max-w-7xl px-4 py-12">

        <AdminNav />

        <p className="mt-8 text-red-500">
          Order not found
        </p>

      </section>

    );

  }



  return (

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">


      <AdminNav />


      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-bold uppercase text-clay">
            Order Details
          </p>

          <h1 className="text-4xl font-extrabold">
            #{order._id.slice(-6)}
          </h1>

        </div>


        <Link
          to="/admin/orders"
          className="
            rounded-md
            bg-black
            px-4
            py-2
            text-sm
            font-semibold
            text-white
          "
        >
          Back
        </Link>


      </div>




      <div className="mt-8 grid gap-6 lg:grid-cols-3">


        {/* Customer Information */}
        <div className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">


          <h2 className="text-lg font-bold">
            Customer
          </h2>


          <div className="mt-4 space-y-2 text-sm">


            <p>
              <span className="font-semibold">
                Name:
              </span>{" "}
              {order.user?.name ||
              order.shippingAddress?.fullName}
            </p>


            <p>
              <span className="font-semibold">
                Email:
              </span>{" "}
              {order.user?.email}
            </p>


          </div>


        </div>





        {/* Payment Information */}
        <div className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">


          <h2 className="text-lg font-bold">
            Payment
          </h2>


          <div className="mt-4 space-y-2 text-sm">


            <p>
              Method: {order.paymentMethod}
            </p>


            <p>

              Status:

              <span className={
                order.isPaid
                  ? "ml-2 text-green-600"
                  : "ml-2 text-gray-500"
              }>

                {order.isPaid
                  ? "Paid"
                  : "Pending"}

              </span>

            </p>


          </div>


        </div>





        {/* Delivery Information */}
        <div className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">


          <h2 className="text-lg font-bold">
            Delivery
          </h2>


          <div className="mt-4 space-y-2 text-sm">


            <p className="capitalize">
              Status: {order.status}
            </p>


            <p>
              Delivered:

              {" "}

              {order.isDelivered
                ? "Yes"
                : "No"}

            </p>


          </div>


        </div>


      </div>





      {/* Products */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">


        <h2 className="text-xl font-bold">
          Products Ordered
        </h2>



        <div className="mt-6 space-y-4">


          {order.orderItems.map((item) => (


            <div
              key={item.product}
              className="
                flex
                items-center
                justify-between
                border-b
                border-linen
                pb-4
              "
            >


              <div className="flex items-center gap-4">


                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    h-20
                    w-20
                    rounded-md
                    object-contain
                  "
                />


                <div>

                  <p className="font-semibold">
                    {item.name}
                  </p>


                  <p className="text-sm text-gray-500">

                    Quantity: {item.qty}

                  </p>


                </div>


              </div>




              <div className="text-right">


                <p className="font-bold">

                  ₦{item.price.toLocaleString()}

                </p>


                <p className="text-sm text-gray-500">

                  Total:

                  {" "}

                  ₦{(item.price * item.qty)
                    .toLocaleString()}

                </p>


              </div>


            </div>


          ))}


        </div>


      </div>






      {/* Shipping Address */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">


        <h2 className="text-xl font-bold">
          Shipping Address
        </h2>


        <div className="mt-4 text-sm space-y-1">


          <p>
            {order.shippingAddress?.fullName}
          </p>


          <p>
            {order.shippingAddress?.address}
          </p>


          <p>
            {order.shippingAddress?.city}
          </p>


          <p>
            {order.shippingAddress?.country}
          </p>


          <p>
            {order.shippingAddress?.phone}
          </p>


        </div>


      </div>




      {/* Summary */}
      <div className="mt-8 flex justify-end">

        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">


          <h2 className="text-lg font-bold">
            Order Summary
          </h2>


          <div className="mt-4 space-y-2 text-sm">


            <div className="flex justify-between">

              <span>
                Items
              </span>

              <span>
                ₦{order.itemsPrice.toLocaleString()}
              </span>

            </div>


            <div className="flex justify-between">

              <span>
                Tax
              </span>

              <span>
                ₦{order.taxPrice.toLocaleString()}
              </span>

            </div>


            <div className="flex justify-between font-bold text-lg">


              <span>
                Total
              </span>


              <span>
                ₦{order.totalPrice.toLocaleString()}
              </span>


            </div>


          </div>


        </div>


      </div>



    </section>

  );

};


export default AdminOrderDetails;