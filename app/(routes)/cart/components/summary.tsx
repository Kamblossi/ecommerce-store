"use client";

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const submitOrder = async (data: any): Promise<any> => {
    const res = await fetch('/api/submitOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(res);
      throw new Error('Failed to submit order');
    }

    return await res.json();
  };

  const onCheckout = async () => {

    let result = await submitOrder({
      "id": uuidv4(),
      "currency": "KES",
      "amount": totalPrice,
      "description": "payment for masterclass",
      "callback_url": "https://some.com/home", // TODO: The URL in the front-end to redirect to after payment
      "billing_address": {
        "email_address": "johndoe@mail.com",
        "phone_number": "",
        "country_code": "KE",
        "first_name": "John",
        "middle_name": "",
        "last_name": "Doe",
        "line_1": "",
        "line_2": "",
        "city": "",
        "state": "",
        "postal_code": "",
        "zip_code": ""
      }
    });

    console.table(result);
    window.location.href = result.redirect_url;
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;