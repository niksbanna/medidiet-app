import NetInfo from '@react-native-community/netinfo';
import { useSyncStore } from '../../stores/useSyncStore';
import { apiClient } from '../api/ApiClient';

class NetworkManager {
  private isProcessing = false;

  initialize() {
    // Listen for network state changes
    NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      useSyncStore.getState().setOnlineStatus(isOnline);

      if (isOnline) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.isProcessing) return;
    
    const { queue, removeFromQueue, incrementRetry } = useSyncStore.getState();
    if (queue.length === 0) return;

    this.isProcessing = true;

    for (const request of queue) {
      try {
        // Replay request
        if (request.method === 'POST') {
          await apiClient.post(request.endpoint, request.data);
        } else if (request.method === 'PUT') {
          await apiClient.put(request.endpoint, request.data);
        } else if (request.method === 'DELETE') {
          await apiClient.delete(request.endpoint);
        }

        // Success - remove from queue
        removeFromQueue(request.id);
      } catch (error) {
        console.error(`Failed to process sync request ${request.id}:`, error);
        incrementRetry(request.id);
        // If it fails, we keep it in the queue for next retry
        // Optional: Remove if retryCount > maxRetries
      }
    }

    this.isProcessing = false;
  }
}

export const networkManager = new NetworkManager();
