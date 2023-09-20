import './index.scss';

import { useRef, useState } from 'react';

export const Demo2 = () => {
	const desktopVideoRef = useRef<HTMLVideoElement>(null);
	const desktopVideoReplayRef = useRef<HTMLVideoElement>(null);
	const bufCacheRef = useRef<Blob[]>([]);
	const recorderRef = useRef<MediaRecorder | null>(null);

	const [isRecording, setIsRecording] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false);
	const [isReplaying, setIsReplaying] = useState(false);

	const onCaptureDesktopClick = async () => {
		const nextIsCapturing = !isCapturing;

		if (nextIsCapturing) {
			desktopVideoRef.current!.srcObject = await window.navigator.mediaDevices.getDisplayMedia({
				video: true
			});
			await desktopVideoRef.current!.play();
		} else {
			(desktopVideoRef.current!.srcObject as MediaStream).getTracks().map((track) => track.stop());
		}

		setIsCapturing(nextIsCapturing);
	};

	const onRecordClick = () => {
		const nextIsRecording = !isRecording;

		if (nextIsRecording) {
			recorderRef.current = new MediaRecorder(desktopVideoRef.current!.srcObject as MediaStream, {
				mimeType: 'video/webm;codecs=vp8'
			});
			recorderRef.current.ondataavailable = (event) => {
				bufCacheRef.current.push(event.data);
			};
			recorderRef.current.start(10);
		} else {
			recorderRef.current?.stop();
		}

		setIsRecording(nextIsRecording);
	};

	const onReplayClick = async () => {
		const nextIsReplaying = !isReplaying;

		if (nextIsReplaying) {
			const blob = new Blob(bufCacheRef.current, {
				type: 'video/webm'
			});
			desktopVideoReplayRef.current!.src = URL.createObjectURL(blob);
			desktopVideoReplayRef.current!.srcObject = null;
			await desktopVideoReplayRef.current!.play();
		} else {
			desktopVideoReplayRef.current!.pause();
		}

		setIsReplaying(nextIsReplaying);
	};

	return <div className="demo2">
		<div className="tools">
			<button onClick={onCaptureDesktopClick}>{isCapturing ? '结束' : '开始'}采集桌面</button>
			<button onClick={onRecordClick}>{isRecording ? '结束' : '开始'}录制</button>
			<button onClick={onReplayClick}>{isReplaying ? '结束' : '开始'}回放</button>
		</div>

		<div className="shows">
			<video className="video" ref={desktopVideoRef}/>
			<video className="video" ref={desktopVideoReplayRef}></video>
		</div>
	</div>;
};
