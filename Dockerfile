FROM node:20.3.0

# 작업 디렉토리 설정
WORKDIR /chicken_pharm

# 서버 의존성 설치
COPY server/package*.json ./server/
RUN cd server && npm install

# 클라이언트 의존성 설치
COPY client/package*.json ./client/
RUN cd client && npm install

# 소스 코드 복사
COPY . .

# 클라이언트 빌드
RUN cd client && npm run build || echo "Client build failed, but continuing..."

# 서버 빌드
RUN cd server && npm run build

# Python 및 필요한 도구 설치
RUN apt-get update && \
    apt-get install -y python3 python3-pip build-essential libssl-dev libffi-dev python3-dev

# 무거운 Python 패키지 개별 설치
#RUN pip3 install --no-cache-dir torch==1.13.1
#RUN pip3 install --no-cache-dir torchvision
#RUN pip3 install --no-cache-dir transformers
#RUN pip3 install --no-cache-dir faiss-cpu
#RUN apt-get update && apt-get install -y \
 #   libblas-dev \
  #  liblapack-dev \
   # gfortran

# 나머지 Python 의존성 설치
#RUN pip3 install --no-cache-dir -r server/requirements.txt

# 포트 설정
EXPOSE 3000 5173

# 시작 스크립트 권한 설정
RUN chmod +x /chicken_pharm/start.sh

# 시작 명령 설정
CMD ["/chicken_pharm/start.sh"]
