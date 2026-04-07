import { useState, useRef } from "react";
import { Image, Mic, X, Loader } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function MediaUploadBar({ onImageSend, onVoiceSend, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Image upload
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onImageSend(file_url);
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
      fileInputRef.current.value = "";
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setIsUploading(true);
        try {
          const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
          onVoiceSend(file_url);
        } catch (error) {
          console.error("Voice upload error:", error);
        } finally {
          setIsUploading(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-50 border-t border-gray-100 px-3 py-3 flex items-center gap-2">
      {isRecording ? (
        <>
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-red-50 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-600">Recording {formatTime(recordingTime)}</span>
          </div>
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600"
          >
            Stop
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50"
            title="Send image"
          >
            {isUploading ? <Loader className="w-5 h-5 animate-spin text-gray-400" /> : <Image className="w-5 h-5 text-[#1877F2]" />}
          </button>

          <button
            onClick={startRecording}
            disabled={isUploading}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50"
            title="Send voice note"
          >
            {isUploading ? <Loader className="w-5 h-5 animate-spin text-gray-400" /> : <Mic className="w-5 h-5 text-[#1877F2]" />}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}