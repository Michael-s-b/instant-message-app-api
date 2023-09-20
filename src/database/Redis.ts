import { createClient } from "redis";

const createRedisClient = () => {
	const redisClient = createClient({
		password: process.env.REDIS_CLIENT_PASSWORD,
		socket: {
			host: process.env.REDIS_CLIENT_HOST,
			port: parseInt(process.env.REDIS_CLIENT_PORT as string),
		},
	});
	return redisClient;
};

export default createRedisClient;
