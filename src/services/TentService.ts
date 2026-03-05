import { useState, useEffect, useRef } from 'react';

export interface TentStatus {
  connected: boolean;
  memberCount: number;
  tentId: string | null;
}

export const useTentService = (initialTentId?: string) => {
  const [status, setStatus] = useState<TentStatus>({
    connected: false,
    memberCount: 0,
    tentId: initialTentId || null,
  });
  
  const [alert, setAlert] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const tentId = initialTentId || new URLSearchParams(window.location.search).get('tentId');
    
    // Always connect to WebSocket, even if no tentId is provided yet
    connect(tentId || null);

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [initialTentId]);

  const connect = (tentId: string | null) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    console.log(`Connecting to Tent Service at ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to Tent Service');
      if (tentId) {
        ws.send(JSON.stringify({ type: 'JOIN_TENT', tentId }));
        setStatus(prev => ({ ...prev, connected: true, tentId }));
      } else {
        setStatus(prev => ({ ...prev, connected: true }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Tent Message:', data);

        if (data.type === 'TENT_JOINED') {
          setStatus(prev => ({ ...prev, memberCount: data.memberCount }));
        } else if (data.type === 'SOS_ALERT') {
          setAlert(data);
        }
      } catch (e) {
        console.error('Error parsing tent message:', e);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from Tent Service');
      setStatus(prev => ({ ...prev, connected: false }));
    };
  };

  const joinTent = (tentId: string) => {
    connect(tentId);
  };

  const createTent = () => {
    const newTentId = Math.random().toString(36).substring(2, 8).toUpperCase();
    joinTent(newTentId);
    return newTentId;
  };

  return {
    status,
    alert,
    joinTent,
    createTent,
    clearAlert: () => setAlert(null)
  };
};
