import os
import sys
import numpy as np
import torch
from PIL import Image
import timm
import time
from pinecone.grpc import PineconeGRPC as Pinecone

# OpenMP libiomp5md.dll 에러 방지용 코드
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

# GPU 사용 여부 확인
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Big Transfer(BiT) R50x1 모델 불러옴
model = timm.create_model('resnetv2_50x1_bit.goog_in21k_ft_in1k', pretrained=True, num_classes=0, global_pool='')
model.to(device)
model.eval()

# 모델 입력 전 전처리 과정 정의
config = timm.data.resolve_data_config({}, model=model)
preprocess = timm.data.create_transform(**config)

# 이미지 벡터를 추출하는 함수
def extract_image_vector(image_path):
    image = Image.open(image_path).convert('RGB') # 이미지 모드를 RGB 모드로 변환함
    tensor = preprocess(image).unsqueeze(0).to(device) # 전처리를 한 후에 차원을 추가하고 텐서를 device로 이동함
    
    with torch.no_grad(): # gradient 계산을 비활성화
        features = model.forward_features(tensor)

    return features.squeeze().cpu().numpy() # 결과를 CPU로 이동하고 numpy 배열로 변환함

# SPoC Pooling 함수 (width + height) 
def spoc_pooling(features):
    pooled_vector = np.sum(features, axis=(1, 2))
    return pooled_vector

# Pinecone 연결
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = 'image-search'
index = pc.Index(index_name)

if __name__ == "__main__":
    image_path = sys.argv[1] # const command = [pyPath, imagePath, outputResultPath];의 1번 인자
    output_path = sys.argv[2] # const command = [pyPath, imagePath, outputResultPath];의 2번 인자

    # 이미지 벡터를 추출함
    image_vector = extract_image_vector(image_path)

    # SPoC Pooling 적용함
    image_vector = spoc_pooling(image_vector)

    # 유사 이미지 검색 (검색 결과 개수 설정 : 현재 5개)
    start_search = time.time()
    query_response = index.query(vector=image_vector.tolist(), top_k=5, include_metadata=True) # numpy array를 list로 변환
    end_search = time.time()

    # pinecone 검색 결과
    matches = query_response['matches']
    similar_image_paths = [match['metadata']['image_path'] for match in matches] # 결과들의 meta data에서 pill id를 추출함
    similarities = [match['score'] for match in matches] # 결과들의 score 값을 추출함

    # 유사도를 파일로 저장함
    with open(output_path, 'w') as f:
        for path, similarity in zip(similar_image_paths, similarities):
            similarity_percentage = similarity * 100
            f.write(f"{path} ({similarity_percentage:.2f}%)\n")

    print("이미지 유사도 검색을 완료했습니다.") # stdout
    print(f"작업 시간: {end_search - start_search}\n")