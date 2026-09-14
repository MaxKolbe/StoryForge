export type Item = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description: string;
      metadata?: {
        productId: string;
      };
    };
    unit_amount: number;
  };
  quantity: number;
};

export type LineItem = Item[];
