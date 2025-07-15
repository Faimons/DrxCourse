// src/config/redis.js
export async function connectRedis() {
  console.log('ℹ️ Redis not configured, using memory storage');
  return true;
}

export default null;
