import sys
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision.transforms.functional import normalize
from transformers import AutoModelForImageSegmentation
from skimage import io

# Hugging Face에서 RMBG-1.4 모델을 불러옴 (OCR 전 배경 제거)
model = AutoModelForImageSegmentation.from_pretrained("briaai/RMBG-1.4", trust_remote_code=True)

# GPU가 있으면 GPU를 사용하고 없으면 CPU를 사용
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

# RMBG-1.4 매뉴얼 그대로 적용
def preprocess_image(im: np.ndarray, model_input_size: list) -> torch.Tensor:
    if len(im.shape) < 3 or im.shape[2] == 1:  # 흑백 이미지를 RGB 이미지로 변환함
        im = np.repeat(im[:, :, np.newaxis], 3, axis=2)
    elif im.shape[2] == 4:  # RGBA이미지를 RGB 이미지로 변환함
        im = im[:, :, :3]
    im_tensor = torch.tensor(im, dtype=torch.float32).permute(2,0,1) # 이미지를 PyTorch 텐서로 변환 후 permute를 이용하여 차원 순서를 (channels, height, width)로 변경함
    im_tensor = F.interpolate(torch.unsqueeze(im_tensor,0), size=model_input_size, mode='bilinear') # 차원을 하나 추가함 (1, channels, height, width), 이미지 크기를 model_input_size로 변환함
    image = torch.divide(im_tensor,255.0) # 픽셀값을 255로 나눠서 이미지를 정규화함
    image = normalize(image,[0.5,0.5,0.5],[1.0,1.0,1.0]) # 이미지 데이터를 중심화 하기 위해서 각 채널의 값을 0.5 이동
    return image

# RMBG-1.4 매뉴얼 그대로 적용
def postprocess_image(result: torch.Tensor, im_size: list) -> np.ndarray:
    result = torch.squeeze(F.interpolate(result, size=im_size, mode='bilinear'), 0) # result 텐서를 'im_size' 크기로 조정
    ma = torch.max(result)
    mi = torch.min(result)
    result = (result - mi) / (ma - mi) # result 텐서를 정규화
    im_array = (result * 255).permute(1, 2, 0).cpu().data.numpy().astype(np.uint8) # result 텐서를 다시 [0,255] 범위로 변환하고, 차원 순서를 변경 (height, width, channels)
    im_array = np.squeeze(im_array) # 불필요한 차원을 제거함
    return im_array


# 이미지 전처리를 두 번 수행하기 위한 함수
def remove_background(image_path: str, output_path: str):
    orig_im = io.imread(image_path) # 이미지를 불러옴
    orig_im_size = orig_im.shape[0:2] # 원본 이미지의 width, height 값을 가져옴
    model_input_size = [512, 512]  # 모델 인풋 사이즈를 설정함

    image = preprocess_image(orig_im, model_input_size).to(device)
    result = model(image)
    orig_im = postprocess_image(result[0][0], orig_im_size)

    # 결과 저장
    pil_im = Image.fromarray(orig_im)
    no_bg_image = Image.new("RGBA", pil_im.size, (0, 0, 0, 0)) # 투명한 배경을 가진 RGBA 이미지를 생성
    orig_image = Image.open(image_path) # 배경을 제거하기 전 원본 이미지를 로드함
    no_bg_image.paste(orig_image, mask=pil_im) # 후처리된 이미지를 투명한 배경에 붙여 넣음
    no_bg_image.save(output_path, "PNG")

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    remove_background(input_path, output_path)
    print(output_path)