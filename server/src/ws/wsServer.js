import WebSocket, { WebSocketServer } from "ws";

let wss;

export const initWebSocketServer = (server) => {
    wss = new WebSocketServer({ server });
    console.log("WebSocket server started");

    wss.on("connection", (ws) => {
        console.log("Client connected");

        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message.toString());

                console.log("WS RECEIVED:", data);

                switch (data.type) {

                    case "NEW_STUDENT":
                        broadcast({
                            type: "STUDENT_ADDED",
                            payload: data.payload
                        });
                        break;

                    case "NEW_COURSE":     
                        broadcast({
                            type: "NEW_COURSE",
                            payload: data.payload
                        });
                        break;

                    case "COURSE_UPDATED":
                         broadcast({ type: "COURSE_UPDATED", payload: data.payload });
                        break;    

                    case "ANNOUNCEMENT":
                        broadcast({
                            type: "NEW_ANNOUNCEMENT",
                            payload: data.payload
                        });
                        break;

                    default:
                        console.log("Unknown message type:", data.type);
                }

            } catch (error) {
                console.log("Invalid WS JSON message");
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });
    });
};


export const broadcast = (message) => {
    if (!wss) return;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};
