declare const __API_URL__: string;

const API_URL = __API_URL__;

export async function fetchCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

export async function fetchUsers() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function login(userId: number) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return response.json();
}

export async function logout(token: string) {
  const response = await fetch(`${API_URL}/users/logout`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
}

export async function fetchRewards(token: string) {
  const response = await fetch(`${API_URL}/rewards`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch rewards");
  }
  return response.json();
}

export async function fetchRedemptions(token: string) {
  const response = await fetch(`${API_URL}/redemptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch redemptions");
  }
  return response.json();
}

export async function createRedemption(token: string, rewardId: number) {
  const response = await fetch(`${API_URL}/redemptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      redemption: {
        reward_id: rewardId,
      },
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to redeem reward");
  }
  return response.json();
}
