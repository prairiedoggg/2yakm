import sys
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision.transforms.functional import normalize
from transformers import AutoModelForImageSegmentation
from skimage import io
import uuid
import os

# Hugging Face에서 RMBG-1.4 모델을 불러옴 (OCR 전 배경 제거)
model = AutoModelForImageSegmentation.from_pretrained("briaai/RMBG-1.4", trust_remote_code=True)

# GPU가 있으면 GPU를 사용하고 없으면 CPU를 사용
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

# RMBG-1.4 매뉴얼 그대로 적용
def preprocess_image(im: np.ndarray, model_input_size: list) -> torch.Tensor:
    if len(im.shape) < 3 or im.shape[2] == 1:  # 흑백 이미지를 RGB 이미지로 변환함
        im = np.repeat(im[:, :, np.newaxis], 3, axis=2)
    elif im.shape[2] == 4:  # RGBA 이미지를 RGB 이미지로 변환함
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

def save_with_transparency(mask: np.ndarray, orig_image: Image.Image, output_path: str):
    mask_image = Image.fromarray(mask)
    no_bg_image = Image.new("RGBA", mask_image.size, (0, 0, 0, 0))
    no_bg_image.paste(orig_image, mask=mask_image)
    no_bg_image.save(output_path, "PNG")

def process_and_save(image_path: str, output_path: str):
    orig_im = io.imread(image_path) # 이미지를 불러옴
    orig_im_size = orig_im.shape[0:2] # 원본 이미지의 width, height 값을 가져옴
    model_input_size = [512, 512]  # 모델 인풋 사이즈를 설정함

    image = preprocess_image(orig_im, model_input_size).to(device)
    result = model(image)
    processed_im = postprocess_image(result[0][0], orig_im_size)

    # 결과 저장
    orig_image = Image.open(image_path)  # 원본 이미지 불러오기
    save_with_transparency(processed_im, orig_image, output_path)

def remove_background(input_path: str, final_output_path: str, num_passes: int):
    unique_id = uuid.uuid4().hex
    intermediate_output_path = input_path

    # src/uploads 폴더가 없으면 생성
    uploads_dir = os.path.join("src", "uploads")
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    # 중간 과정 확인을 위해 이미지 파일을 생성함
    for i in range(num_passes):
        intermediate_output_path_next = os.path.join(uploads_dir, f"intermediate_{unique_id}_{i+1}.png") 
        process_and_save(intermediate_output_path, intermediate_output_path_next)
        intermediate_output_path = intermediate_output_path_next
    
    # 최종 연산 완료된 파일을 저장함
    os.rename(intermediate_output_path, final_output_path)
    print(f"{final_output_path}") # stdout

    # 중간 과정 확인을 위해 생성된 파일을 삭제함
    for i in range(num_passes):
        intermediate_file = os.path.join(uploads_dir, f"intermediate_{unique_id}_{i+1}.png")
        if os.path.exists(intermediate_file):
            os.remove(intermediate_file)
            print(f"중간 연산 파일 삭제 : {intermediate_file}")

if __name__ == "__main__":
    input_path = sys.argv[1]
    final_output_path = sys.argv[2]
    num_passes = 30 # 총 전처리 횟수 (배포 후 서버 성능 고려해서 수정할 것)
    
    remove_background(input_path, final_output_path, num_passes)
