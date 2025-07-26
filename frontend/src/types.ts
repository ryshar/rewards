export interface User {
  id: number;
  name: string;
  email: string;
  point_balance: number;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
}

export interface Redemption {
  id: number;
  reward: {
    name: string;
  };
  amount: number;
  created_at: string;
}
