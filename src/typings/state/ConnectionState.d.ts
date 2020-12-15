interface ConnectionState {
  requests: ConnectionRequests[];
  selectedRequest: ConnectionRequest | null;
  connections: Connection[];
}
