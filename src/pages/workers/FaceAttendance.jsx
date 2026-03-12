import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import workerService from '../../services/workerService';
import { Link } from 'react-router-dom';

const FaceAttendance = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [workers, setWorkers] = useState([]);
    const [faceMatcher, setFaceMatcher] = useState(null);
    const [status, setStatus] = useState('Initializing Kiosk...');
    const [recognizedWorker, setRecognizedWorker] = useState(null);
    const [cooldown, setCooldown] = useState(false);

    // Cleanup active recognition interval
    const recognitionInterval = useRef(null);

    useEffect(() => {
        const init = async () => {
            try {
                setStatus('Loading Face AI Models...');
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setIsModelsLoaded(true);

                setStatus('Fetching worker data...');
                const workerData = await workerService.getWorkers();
                setWorkers(workerData);

                // Create Labeled Face Descriptors for matching
                const labeledDescriptors = [];
                for (const worker of workerData) {
                    if (worker.faceDescriptor && worker.faceDescriptor.length > 0) {
                        const floatArray = new Float32Array(worker.faceDescriptor);
                        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(worker._id, [floatArray]));
                    }
                }

                if (labeledDescriptors.length === 0) {
                    setStatus('No registered faces found in the database. Please register faces first.');
                    return; // Don't start video if no faces to match against
                }

                const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55); // 0.55 distance threshold
                setFaceMatcher(matcher);

                setStatus('Starting camera...');
                startVideo();
            } catch (err) {
                console.error("Initialization error:", err);
                setStatus('Error initializing Kiosk: ' + err.message);
            }
        };

        init();

        return () => {
            if (recognitionInterval.current) clearInterval(recognitionInterval.current);
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
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam:", err);
                setStatus('Webcam access denied. Please allow camera permissions.');
            });
    };

    const handleVideoPlay = () => {
        if (!faceMatcher) return;

        setStatus('Kiosk Active. Please look at the camera.');

        // Ensure canvas matches video size
        const displaySize = { height: videoRef.current.videoHeight, width: videoRef.current.videoWidth };
        if (canvasRef.current) {
            faceapi.matchDimensions(canvasRef.current, displaySize);
        }

        recognitionInterval.current = setInterval(async () => {
            if (cooldown) return; // Skip if in cooldown (recently recognized someone)

            if (videoRef.current && videoRef.current.readyState === 4) {
                const detections = await faceapi.detectAllFaces(videoRef.current)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                if (detections.length > 0 && canvasRef.current) {
                    // Update canvas drawing
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Optional: Draw bounding boxes for debugging
                    // faceapi.draw.drawDetections(canvas, resizedDetections);

                    // Find matches
                    for (const detection of resizedDetections) {
                        const match = faceMatcher.findBestMatch(detection.descriptor);

                        if (match.label !== 'unknown' && !cooldown) {
                            handleRecognition(match.label);
                            break; // Handle one at a time
                        }
                    }
                }
            }
        }, 500); // Check every 500ms
    };

    const handleRecognition = async (workerId) => {
        setCooldown(true);
        const worker = workers.find(w => w._id === workerId);

        if (worker) {
            setStatus(`Recognized: ${worker.name}. Marking attendance...`);
            setRecognizedWorker(worker);

            try {
                // Automatically add standard 8-hour shift
                await workerService.addShift(workerId, { hours: 8 });
                setStatus(`Success! Attendance marked for ${worker.name}.`);
            } catch (error) {
                console.error("Error marking attendance:", error);
                setStatus(`Found ${worker.name}, but failed to mark attendance.`);
            }

            // Wait 5 seconds before allowing another scan
            setTimeout(() => {
                setRecognizedWorker(null);
                setStatus('Kiosk Active. Please look at the camera.');
                setCooldown(false);
            }, 5000);
        } else {
            setCooldown(false); // Failsafe
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
            <div className="w-full max-w-4xl flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Face Recognition Attendance</h1>
                <Link to="/workers" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
                    Back to Dashboard
                </Link>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
                {/* Left Side: Camera Feed */}
                <div className="w-full md:w-2/3 bg-black relative aspect-video flex items-center justify-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                        onPlay={handleVideoPlay}
                        onLoadedMetadata={(e) => {
                            // When video size is known, set canvas size
                            if (canvasRef.current) {
                                canvasRef.current.width = e.target.videoWidth;
                                canvasRef.current.height = e.target.videoHeight;
                            }
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />

                    {/* Targeting Box UI Overlay */}
                    <div className="absolute inset-0 border-8 border-dashed border-white/20 m-12 rounded-3xl pointer-events-none"></div>

                    {/* Success Overlay */}
                    {recognizedWorker && (
                        <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center animate-pulse z-10">
                            <svg className="w-32 h-32 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <h2 className="text-4xl font-bold text-white tracking-wider text-center px-4">
                                WELCOME,<br />{recognizedWorker.name.toUpperCase()}
                            </h2>
                            <p className="text-white mt-4 text-xl">Attendance Marked</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Status Log */}
                <div className="w-full md:w-1/3 p-6 flex flex-col bg-gray-800">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-4">System Status</h3>

                    <div className="flex-1 bg-gray-900 rounded p-4 border border-gray-700 font-mono text-sm text-green-400 flex flex-col justify-end">
                        <p className={`animate-pulse ${status.includes('Error') || status.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                            &gt; {status}
                        </p>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between text-gray-300 text-sm mb-2">
                            <span>AI Models:</span>
                            <span className={isModelsLoaded ? 'text-green-400 font-bold' : 'text-yellow-400'}>
                                {isModelsLoaded ? 'ONLINE' : 'LOADING'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-300 text-sm mb-2">
                            <span>Camera:</span>
                            <span className={videoRef.current?.srcObject ? 'text-green-400 font-bold' : 'text-yellow-400'}>
                                {videoRef.current?.srcObject ? 'ACTIVE' : 'STANDBY'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-300 text-sm">
                            <span>Database Faces:</span>
                            <span className="text-blue-400 font-bold">
                                {workers.filter(w => w.faceDescriptor && w.faceDescriptor.length > 0).length} Registered
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
                Position your face clearly in the camera frame. Ensure good lighting for accurate recognition.
            </p>
        </div>
    );
};

export default FaceAttendance;
