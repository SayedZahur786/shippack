import subprocess
from pathlib import Path
segments=Path('docs/captions.srt').read_text().strip().split('\n\n')
def seconds(t):
 h,m,s=t.replace(',','.').split(':');return int(h)*3600+int(m)*60+float(s)
command=['ffmpeg','-y','-i','docs/recording/walkthrough.webm','-i','docs/recording-voice.aiff']
for i in range(len(segments)):command+=['-i',f'docs/recording/caption-{i}.png']
filters=['[0:v]setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=5[v0]']
for i,segment in enumerate(segments):
 a,b=segment.splitlines()[1].split(' --> ');filters.append(f"[v{i}][{i+2}:v]overlay=0:0:enable='between(t,{seconds(a)},{seconds(b)})'[v{i+1}]")
command+=['-filter_complex',';'.join(filters),'-map',f'[v{len(segments)}]','-map','1:a','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-af','apad=pad_dur=5','-t','43.64','-movflags','+faststart','docs/demo.mp4']
subprocess.run(command,check=True)
