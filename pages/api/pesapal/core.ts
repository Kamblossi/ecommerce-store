import axios, { AxiosResponse } from 'axios';

let AUTHENTICATION_URL: string | null = null;
let REGISTER_IPN_URL: string | null = null;
let GET_IPN_URL: string | null = null;
let SUBMIT_ORDER_URL: string | null = null;
let GET_TRANSACTION_STATUS: string | null = null;

let DEBUG: boolean = false;

let CONSUMER_KEY: string | null = null;
let CONSUMER_SECRET: string | null = null;

let BEARER_TOKEN: string = "";

interface AuthPayload {
  consumer_key: string | null;
  consumer_secret: string | null;
}

interface RegisterIPNPayload {
  url: string;
  ipn_notification_type: string;
}


export function setup(key: string, secret: string, debug: boolean): void {
  DEBUG = debug;

  CONSUMER_KEY = key;
  CONSUMER_SECRET = secret;

  AUTHENTICATION_URL = DEBUG
    ? "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken"
    : "https://pay.pesapal.com/v3/api/Auth/RequestToken";

  REGISTER_IPN_URL = DEBUG
    ? "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN"
    : "https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN";

  GET_IPN_URL = DEBUG
    ? "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/GetIpnList"
    : "https://pay.pesapal.com/v3/api/URLSetup/GetIpnList";

  SUBMIT_ORDER_URL = DEBUG
    ? "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest"
    : "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest";

  GET_TRANSACTION_STATUS = DEBUG
    ? "https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus"
    : "https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus";

  if (DEBUG) {
    // require("request-debug")(request);
  }
}

export async function authenticate(): Promise<any> {
  const payload: AuthPayload = {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response: AxiosResponse<any> = await axios.post(AUTHENTICATION_URL!, JSON.stringify(payload), {
    headers: headers,
  });

  BEARER_TOKEN = response.data.token;

  console.log("Bearer token:", BEARER_TOKEN);

  return response.data;
}

export async function registerIPNurl(url: string, ipn_notification_type: string): Promise<any> {
  const payload: RegisterIPNPayload = {
    url: url,
    ipn_notification_type: ipn_notification_type,
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + BEARER_TOKEN,
  };

  const response: AxiosResponse<any> = await axios.post(REGISTER_IPN_URL!, JSON.stringify(payload), {
    headers: headers,
  });

  return response.data;
}

export async function getIPNurl(): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + BEARER_TOKEN,
  };

  const response: AxiosResponse<any> = await axios.get(GET_IPN_URL!, {
    headers: headers,
  });

  return response.data;
}

export async function SubmitOrder(options: any): Promise<any> {
  const payload = JSON.stringify(options);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + BEARER_TOKEN,
  };

  const response: AxiosResponse<any> = await axios.post(SUBMIT_ORDER_URL!, payload, {
    headers: headers,
  });

  return response.data;
}

export async function getTransactionStatus(OrderTrackingId: string): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + BEARER_TOKEN,
  };

  const response: AxiosResponse<any> = await axios.get(GET_TRANSACTION_STATUS!, {
    params: {
      orderTrackingId: OrderTrackingId,
    },
    headers: headers,
  });

  return response.data;
}