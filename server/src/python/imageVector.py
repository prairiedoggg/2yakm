import os
import sys
import numpy as np
import torch
from torchvision import models, transforms
from PIL import Image
import faiss
import time

# OpenMP libiomp5md.dll 에러 방지용 코드
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

# efficientnet_b7 모델을 불러옴 (가볍고 높은 성능이라 모바일에 최적화되어 있음)
model = models.efficientnet_b7(weights=models.EfficientNet_B7_Weights.IMAGENET1K_V1) # 가중치로 IMAGENET1K_V1을 사용함
model.eval()

# 모델 입력 전 전처리 과정 정의
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]), # 이미지의 각 채널(RGB)을 정규화함
])

# 이미지 벡터를 추출하는 함수
def extract_image_vector(image_path):
    image = Image.open(image_path)
    if image.mode == 'RGBA':
        image = image.convert('RGB')  # RGBA 모드인 경우 RGB로 변환 (투명도 Alpha 채널 제거)
    image = preprocess(image) # 위에서 정의했던 대로 이미지를 전처리함
    image = image.unsqueeze(0) # 차원 사이즈가 1인 새로운 축을 추가 (batch_size = 1, channels, height, width)
    
    # 메모리 사용량을 줄이기 위해서 torch.no_grad()로 감싸서 gradient를 계산 안함
    with torch.no_grad(): 
        features = model(image)
    
    return features.squeeze().numpy() # 위에서 추가해준 차원을 제거하고, numpy array로 변환함

# 유사도를 구하는 함수
def calculate_similarity(distances):
    max_distance = np.max(distances)
    similarities = 100 * (1 - distances / max_distance) # 최대 거리를 이용해서 정규화 (거리가 가까울 수록 1에 가까워짐)
    return similarities

if __name__ == "__main__":
    image_path = sys.argv[1] # const command = [pyPath, imagePath, outputResultPath];의 1번 인자
    output_path = sys.argv[2] # const command = [pyPath, imagePath, outputResultPath];의 2번 인자

    # 이미지 벡터를 추출
    image_vector = extract_image_vector(image_path)

    # 스크립트의 디렉터리에서 FAISS index와 벡터 데이터를 로드함
    script_dir = os.path.dirname(os.path.realpath(__file__))
    faiss_index_path = os.path.join(script_dir, 'vector', 'faiss_index.bin')
    vectors_path = os.path.join(script_dir, 'vector', 'image_vectors.npy')
    image_paths_path = os.path.join(script_dir, 'vector', 'image_paths.npy')

    index = faiss.read_index(faiss_index_path)
    vectors = np.load(vectors_path)
    image_paths = np.load(image_paths_path, allow_pickle=True) # numpy array를 로드할 때 직렬화를 할 수 있도록 허용함

    # 유사 이미지 검색 (검색 결과 개수 설정 : 현재 5개)
    start_search = time.time()
    D, I = index.search(np.array([image_vector]), 5) # FAISS index에서 검색을 수행함, image_vector를 2차원 배열로 변환, D(유사한 이미지와의 거리), I(index) 
    end_search = time.time()

    similar_image_paths = [image_paths[i] for i in I[0]] # 유사한 이미지와의 거리를 저장함
    similarities = calculate_similarity(D[0]) # 위에서 정의한 유사도를 구하는 함수를 이용해서 유사도를 구함

    # 유사도를 파일로 저장함
    with open(output_path, 'w') as f:
        for path, similarity in zip(similar_image_paths, similarities):
            f.write(f"{path} ({similarity:.2f}%)\n")

    print("이미지 유사도 검색을 완료했습니다.") # stdout
    print(f"작업 시간: {end_search - start_search}\n")