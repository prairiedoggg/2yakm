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

# 원본 이미지를 불러와서 전처리 후 저장하는 함수
def process_and_save(image_path: str, output_path: str):
    orig_im = io.imread(image_path) # 이미지를 불러옴
    orig_im_size = orig_im.shape[0:2] # 원본 이미지의 width, height 값을 가져옴
    model_input_size = [512, 512]  # 모델 input 사이즈를 설정함

    image = preprocess_image(orig_im, model_input_size).to(device) # 이미지를 전처리하여 모델 input 형태로 변환함
    result = model(image)
    processed_im = postprocess_image(result[0][0], orig_im_size) # 후처리 한 후 원본 이미지 크기로 다시 변경함

    # 결과 저장
    orig_image = Image.open(image_path)  # 원본 이미지를 불러옴
    mask_image = Image.fromarray(processed_im) # 후처리된 numpy array를 image 객체로 변환함
    no_bg_image = Image.new("RGBA", mask_image.size, (0, 0, 0, 0)) # 투명한 배경의 새로운 이미지를 생성함 (Alpha 값이 0)
    no_bg_image.paste(orig_image, mask=mask_image) # 원본 이미지를 투명한 배경 위에 붙여넣음
    no_bg_image.save(output_path, "PNG")

# 배경을 제거하는 함수
def remove_background(input_path: str, final_output_path: str, num_passes: int):
    intermediate_id = uuid.uuid4().hex
    intermediate_output_path = input_path

    # src/uploads 폴더가 없으면 생성함
    uploads_dir = os.path.join("src", "uploads")
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    # 중간 과정 확인을 위해 이미지 파일을 생성함 (전처리를 몇 번까지 시행해야 하는지 확인하기 위해서)
    for i in range(num_passes):
        intermediate_output_path_next = os.path.join(uploads_dir, f"intermediate_{intermediate_id}_{i+1}.png") 
        process_and_save(intermediate_output_path, intermediate_output_path_next)
        intermediate_output_path = intermediate_output_path_next
    
    # 최종 연산 완료된 파일을 저장함
    os.rename(intermediate_output_path, final_output_path)
    print("이미지 전처리를 완료했습니다.") # stdout

    # 중간 과정 확인을 위해 생성된 파일을 삭제함
    for i in range(num_passes):
        intermediate_file = os.path.join(uploads_dir, f"intermediate_{intermediate_id}_{i+1}.png")
        if os.path.exists(intermediate_file):
            os.remove(intermediate_file)
            print(f"중간 연산 파일 삭제 : {intermediate_file}")

# 이미지가 두 장이 들어올 경우 합치는 함수
def merge_images(image_paths: list, output_path: str):
    images = [Image.open(path) for path in image_paths] # 이미지 path 리스트에서 이미지를 가져옴
    min_height = min(img.height for img in images) # 불러온 이미지 중 가장 낮은 height 값을 찾음

    # 이미지를 돌면서 크기를 조절한 후에 resized_images에 저장함
    # width는 reisze x : min_height = img.width : img.height 이므로 resize x = (img.width * min_height) / img_height
    # 이미지 크기는 정수여야 해서 int를 붙여줌
    # height는 min_height
    resized_images = [img.resize((int(img.width * min_height / img.height), min_height)) for img in images]

    total_width = sum(img.width for img in resized_images) # 두 이미지의 넓이를 합쳐서 total_width를 계산함
    new_image = Image.new('RGB', (total_width, min_height)) # resize 된 이미지를 붙여넣을 새로운 이미지를 생성함

    x_offset = 0 # x값 시작 위치 0
    for img in resized_images:
        new_image.paste(img, (x_offset, 0)) # new_image에 resize된 이미지를 붙여 넣음
        x_offset += img.width # 이미지를 붙여넣은 후 그 넓이만큼 offset 값을 이동함

    new_image.save(output_path)

if __name__ == "__main__":
    input_paths = sys.argv[1:-1]
    final_output_path = sys.argv[-1]
    num_passes = 3  # 총 전처리 횟수 (배포 후 서버 성능 고려해서 수정할 것)

    # 이미지 개수가 2개면 합친 후 전처리를 시행, 1개일 경우에는 그냥 전처리를 시행함
    if len(input_paths) == 2:
        merged_image_path = os.path.join("src", "uploads", f"merged_{uuid.uuid4().hex}.png")
        merge_images(input_paths, merged_image_path)
        remove_background(merged_image_path, final_output_path, num_passes)
        os.remove(merged_image_path)
    elif len(input_paths) == 1:
        remove_background(input_paths[0], final_output_path, num_passes)
    else:
        print("이미지 개수를 확인해주세요.")