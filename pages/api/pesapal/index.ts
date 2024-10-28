import * as core from "./core";

interface RegisterIPNOptions {
  url: string;
  ipn_notification_type: string;
}


interface TransactionStatusOptions {
  OrderTrackingId: string;
}

interface InitOptions {
  debug?: boolean;
  key: string;
  secret: string;
}

const PesaPal: any = {};

PesaPal.authenticate = async function(): Promise<any> {
  return await core.authenticate();
}

PesaPal.register_ipn_url = async function (options: RegisterIPNOptions): Promise<any> {
  if (!options.url || !options.ipn_notification_type)
    throw new Error("Need to specify both IPN url and IPN notification type");

  return await core.registerIPNurl(options.url, options.ipn_notification_type);
};

PesaPal.get_ipn_list = async function (): Promise<any> {
  return await core.getIPNurl();
};

PesaPal.submit_order = async function (options: any): Promise<any> {
  if (
    !options.id ||
    !options.currency ||
    !options.amount ||
    !options.description ||
    !options.callback_url ||
    !options.notification_id ||
    !options.billing_address
  )
    throw new Error(
      "Need to specify all required fields || refer to pesapal v3 documentation"
    );

  return await core.SubmitOrder(options);
};

PesaPal.get_transaction_status = async function (options: TransactionStatusOptions): Promise<any> {
  if (!options.OrderTrackingId)
    throw new Error("Need to specify the order tracking id");

  return await core.getTransactionStatus(options.OrderTrackingId);
};

/**
 * Init the module
 * @param options {{debug: boolean, key: string, secret: string}}
 */
export async function init(options: InitOptions): Promise<any> {
  if (!options.key || !options.secret)
    throw new Error("Need to specify both consumer key and secret");

  const debug = options.debug || false;
  await core.setup(options.key, options.secret, debug);

  return PesaPal;
}

export default PesaPal;