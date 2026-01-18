import { useScribe } from "@elevenlabs/react";
import { useRef } from "react";

export function useScribeRecorder() {
  const sessionIdRef = useRef(null);
  const setActiveNodesRef = useRef(null);
  const setExecutedNodesRef = useRef(null);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: "vad",
    vadSilenceThresholdSecs: 1,
    onPartialTranscript: (data) => {
      // Partial transcripts - no logging to improve performance
    },
    onCommittedTranscript: async (data) => {
      
      // Send transcript to backend execution engine (skip empty transcripts)
      if (sessionIdRef.current && data.text.trim()) {
        try {
          const response = await fetch('http://localhost:8000/api/session/transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionIdRef.current,
              transcript: data.text
            })
          });
          
          const result = await response.json();
          
          // Update node states for visualization
          if (setActiveNodesRef.current) {
            setActiveNodesRef.current(result.active_nodes);
          }
          if (setExecutedNodesRef.current) {
            setExecutedNodesRef.current(result.executed_nodes);
            // Also update edges based on executed nodes
            if (result.executed_edges) {
              window.__executedEdges = result.executed_edges;
            }
          }
        } catch (error) {
          console.error('Failed to process transcript:', error);
        }
      }
    },
  });

  const fetchTokenFromServer = async () => {
    const response = await fetch("http://localhost:8000/scribe-token");
    const data = await response.json();
    return data.token;
  };

  const handleStart = async () => {
    const token = await fetchTokenFromServer();

    await scribe.connect({
      token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  };

  const setSessionId = (id) => {
    sessionIdRef.current = id;
  };

  const setActiveNodesCallback = (callback) => {
    setActiveNodesRef.current = callback;
  };

  const setExecutedNodesCallback = (callback) => {
    setExecutedNodesRef.current = callback;
  };

  return {
    isConnected: scribe.isConnected,
    startRecording: handleStart,
    stopRecording: scribe.disconnect,
    setSessionId,
    setActiveNodesCallback,
    setExecutedNodesCallback,
  };
}
