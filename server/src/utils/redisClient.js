import { createClient } from "redis";

const client = createClient({
  url: "redis://127.0.0.1:6379",
});

client.on("error", (err) => console.error("Redis Error:", err));
// client.on("connect", () => console.log("Redis Connected"));
 
export const  connectRedis= async() =>{
  if(!client.isOpen){
    await client.connect();
    console.log("Redis Connected");
  }
}


export default client;
