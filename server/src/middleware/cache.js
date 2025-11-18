import redis from "../utils/redisClient.js";

export const cache = (key) => async (req, res, next) => {
  try {
    const data = await redis.get(key);

    if (data) {
      console.log("Cache Hit:", key);
      return res.json({
        success: true,
        fromCache: true,
        ...(JSON.parse(data)),
      });
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      console.log("Cache Set:", key);
      await redis.set(key, JSON.stringify(body), { EX: 60 }); 
      res.sendResponse(body);
    };

    next();
  } catch (err) {
    console.error(err);
    next();
  }
};
