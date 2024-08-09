FROM node:20.3.0

WORKDIR /chicken_pharm

# Nginx, Python 및 필요한 도구 설치
RUN apt-get update && apt-get install -y nginx python3 python3-pip python3-venv build-essential libssl-dev libffi-dev python3-dev wget git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Python 가상 환경 생성 및 활성화
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# pip 업그레이드 및 필요한 Python 패키지 설치
RUN pip install --upgrade pip && \
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install scikit-image transformers

# google module 설치
RUN pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client protobuf
RUN pip install 'pinecone-client[grpc]'

# 소스 코드 복사
COPY . .

# requirements.txt에서 Python 패키지 설치
RUN pip install -r requirements.txt

# 서버 의존성 설치
RUN cd server && npm ci

# 클라이언트 의존성 설치
RUN cd client && npm install

# 클라이언트 빌드
RUN cd client && npm run build

# 서버 빌드
RUN cd server && npm run build

# 포트 설정
EXPOSE 80 3000 5173

# 시작 스크립트 권한 설정
RUN chmod +x /chicken_pharm/start.sh

# 시작 명령 설정
CMD ["/bin/bash", "-c", "source .env && /chicken_pharm/start.sh"]
