## models
### tqdm requests
```py
from tqdm import tqdm
import requests
import os

def download(url, save_dir):
    file_name = url.split("/")[-1]
    local_filename = os.path.join(save_dir, file_name)
    r = requests.get(url, stream=True)
    total = int(r.headers.get('content-length', 0))
    with open(local_filename, "wb") as f, tqdm(
        total=total, unit='B', unit_scale=True, desc=file_name
    ) as bar:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
            bar.update(len(chunk))
```
## faster_whisper
```py
# faster-whisper 是 Whisper 的高性能推理实现，适合 CPU/GPU。
from faster_whisper import WhisperModel

def generate_lrc(read_file_path, write_file_path):
    # 这里加载了 small 模型，指定使用 CPU（如果有 GPU 可以写成 device="cuda"，会快很多）。
    # 模型大小有 tiny, base, small, medium, large，模型越大识别准确率越高但速度越慢。
    model = WhisperModel("small", device="cpu")
    # segments：生成的逐句/逐段结果（包含开始时间、结束时间、文字）。
    # info：包含一些整体信息（比如语言检测结果、音频时长等）。
    segments, info = model.transcribe(
        read_file_path,
        beam_size=5,  # beam_size=5 表示使用 Beam Search 搜索时考虑 5 个候选结果，通常能提高准确率（代价是速度变慢）。
        vad_filter=True,  # 开启语音活动检测（Voice Activity Detection），会自动在停顿处切分片段
        vad_parameters=dict(min_silence_duration_ms=300),  # 停顿超过 300ms 就切分
        word_timestamps=True,  # 获取逐词时间戳
        # max_segment_length=3,  # 控制单个 segment 的最长秒数，例如 10 秒。
    )
```
