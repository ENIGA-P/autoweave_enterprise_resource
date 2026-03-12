import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import workerService from '../services/workerService';

const FaceRegistrationModal = ({ worker, onClose, onSuccess }) => {
    const videoRef = useRef(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [status, setStatus] = useState('Loading face recognition models...');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setIsModelsLoaded(true);
                setStatus('Models loaded. Please authorize camera access.');
                startVideo();
            } catch (err) {
                console.error("Error loading models:", err);
                setStatus('Failed to load face models.');
            }
        };

        loadModels();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStatus('Align your face in the camera and click Capture.');
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam:", err);
                setStatus('Webcam access denied or unavailable.');
            });
    };

    const captureFace = async () => {
        if (!videoRef.current || !isModelsLoaded || isProcessing) return;

        setIsProcessing(true);
        setStatus('Scanning face...');

        try {
            const detection = await faceapi.detectSingleFace(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                setStatus('No face detected. Please look directly at the camera.');
                setIsProcessing(false);
                return;
            }

            setStatus('Face detected! Saving to database...');

            // Convert Float32Array to standard array for JSON
            const descriptorArray = Array.from(detection.descriptor);

            await workerService.registerFace(worker._id, descriptorArray);

            setStatus('Face registered successfully!');
            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (error) {
            console.error("Face registration error:", error);
            setStatus('Failed to register face: ' + error.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-md w-full">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-750">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Register Face for {worker.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="relative w-full max-w-sm rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center mb-4">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                            onPlaying={() => setStatus('Ready! Align face and capture.')}
                        />
                        {/* Overlay guide */}
                        <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full m-8 pointer-events-none"></div>
                    </div>

                    <p className={`text-sm mb-6 ${status.includes('Error') || status.includes('Failed') ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'} text-center px-4`}>
                        {status}
                    </p>

                    <div className="flex w-full space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={captureFace}
                            disabled={!isModelsLoaded || isProcessing || status.includes('access denied')}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition flex justify-center items-center"
                        >
                            {isProcessing ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isProcessing ? 'Processing' : 'Capture'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaceRegistrationModal;
