import './index.scss';

import { useRef, useState } from 'react';
import * as React from 'react';

const filterOptions = [
	'blur(3px)',
	'grayscale(1)',
	'invert(1)',
	'sepia(1)',
	'none'
];

export const Demo1 = () => {
	const videoPlayRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const bufRef = useRef<Blob[]>([]);
	const videoReplayRef = useRef<HTMLVideoElement>(null);

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [filterValue, setFilterValue] = useState<string>('none');
	const [isRecording, setIsRecording] = useState(false);

	const onToggleCamera = async () => {
		const isOpen = !isCameraOpen;
		if (isOpen) {
			videoPlayRef.current!.srcObject = await window.navigator.mediaDevices.getUserMedia({
				video: true,
			});
			await videoPlayRef.current!.play();
		}

		setIsCameraOpen(isOpen);
	};

	const onTakePhoto = () => {
		const video = videoPlayRef.current!;
		const canvas = canvasRef.current!;
		const context = canvas.getContext('2d')!;

		const { videoWidth, videoHeight } = video;
		canvas.width = videoWidth;
		canvas.height = videoHeight;

		context.filter = filterValue;
		context.drawImage(video, 0, 0, videoWidth, videoHeight);
	};

	const onFilterChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
		const value = event.target.value;
		setFilterValue(value);
	};

	const onDownloadPhoto = () => {
		const aEle = document.createElement('a');
		aEle.href = canvasRef.current!.toDataURL();
		aEle.download = 'photo';
		aEle.click();
		aEle.remove();
	};

	const onRecord = async () => {
		const nextIsRecording = !isRecording;
		const video = videoPlayRef.current!;

		if (nextIsRecording) {
			const recorder = new MediaRecorder(video.srcObject as MediaStream, {
				mimeType: 'video/webm;codecs=vp8'
			});
			recorder.ondataavailable = (event) => {
				bufRef.current.push(event.data);
			};
			recorder.start(10);
		}

		setIsRecording(nextIsRecording);
	};

	const onReplayVideo = () => {
		const blob = new Blob(bufRef.current, { type: 'video/webm' });
		const videoReplay = videoReplayRef.current!;

		videoReplay.src = window.URL.createObjectURL(blob);
		videoReplay.srcObject = null;
		videoReplay.controls = true;
		videoReplay.play();
	};

	const onDownloadVideo = () => {
		const blob = new Blob(bufRef.current, { type: 'video/webm' });
		const url = window.URL.createObjectURL(blob);
		const aEle = document.createElement('a');
		aEle.href = url;
		aEle.style.display = 'none';
		aEle.download = 'aaa.webm';
		aEle.click();
		aEle.remove();
	};

	return <div className="demo1">
		<video className="video" ref={videoPlayRef}/>
		<canvas className="canvas" ref={canvasRef}/>
		<video className="videoReplay" ref={videoReplayRef}/>

		<div className="tools">
			<button onClick={onToggleCamera}>{isCameraOpen ? '关闭' : '打开'}摄像头</button>
			<select className="filter" value={filterValue} onChange={onFilterChange}>
				{
					filterOptions.map((item, index) => {
						return <option key={index} value={item}>{item}</option>;
					})
				}
			</select>
			<button onClick={onTakePhoto}>拍照</button>
			<button onClick={onDownloadPhoto}>下载照片</button>

			<button onClick={onRecord}>{isRecording ? '结束' : '开始'}录制视频</button>
			<button onClick={onReplayVideo}>回放视频</button>
			<button onClick={onDownloadVideo}>下载视频</button>
		</div>
	</div>;
};
