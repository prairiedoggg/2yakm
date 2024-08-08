FROM node:20.3.0

# 작업 디렉토리 설정
WORKDIR /chicken_pharm

# Nginx, Python 및 필요한 도구 설치 (wget, git 추가)
RUN apt-get update && apt-get install -y nginx python3 python3-pip build-essential libssl-dev libffi-dev python3-dev wget git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Miniconda 설치
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh && \
    bash miniconda.sh -b -p /opt/conda && \
    rm miniconda.sh

# Miniconda 환경변수 설정
ENV PATH="/opt/conda/bin:${PATH}"

# Conda 초기화
RUN conda init bash && \
    echo "conda activate base" >> ~/.bashrc

# PyTorch 및 PyTorch Vision 설치
RUN conda install -y pytorch torchvision cpuonly -c pytorch

# 소스 코드 복사
COPY . .

# requirements.txt에서 Python 패키지 설치
RUN pip install -r requirements.txt

# 서버 의존성 설치
RUN cd server && npm ci

# 클라이언트 의존성 설치
RUN cd client && npm install

# .env 파일 복사 (Jenkins에서 제공)
ARG ENV_FILE=.env
COPY ${ENV_FILE} .env

# 클라이언트 빌드
RUN cd client && npm run build || echo "클라이언트 빌드 중 오류 발생"

# 서버 빌드
RUN cd server && npm run build

# NGINX 설정 복사
COPY nginx.conf /etc/nginx
COPY default /etc/nginx/sites-available/default

# 포트 설정
EXPOSE 80 3000 5173

# 시작 스크립트 권한 설정
RUN chmod +x /chicken_pharm/start.sh

# 시작 명령 설정
CMD ["/bin/bash", "-c", "source .env && /chicken_pharm/start.sh"]