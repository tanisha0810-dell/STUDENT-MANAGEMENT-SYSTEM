let socket = null;

export const connectWebSocket = () => {
    socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
        console.log("Connected to WebSocket server");
        socket.send(JSON.stringify({ type: "REGISTER", user: "frontend-client" }));
    };

    socket.onmessage = (message) => {
        try {
            const data = JSON.parse(message.data);
            console.log("Received WS message:", data);

            if (typeof window.wsCallback === "function") {
                window.wsCallback(data);
            }
        } catch (error) {
            console.log("Invalid WS message");
        }
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting");
        setTimeout(connectWebSocket, 2000);
    };
};

export { socket };

export const sendWSMessage = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    } else {
        console.log("WebSocket not connected yet");
    }
};
