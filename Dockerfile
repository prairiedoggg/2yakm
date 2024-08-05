FROM node:14 as base
WORKDIR /chicken_pharm
COPY server/package*.json ./server/
RUN cd server && npm install
COPY client/package*.json ./client/
RUN cd client && npm install
COPY server ./server
COPY client ./client
RUN cd client && npm run build || true
RUN cd server && npm run build
RUN apt-get update && apt-get install -y python3 python3-pip
COPY server/requirements.txt ./server/requirements.txt
RUN pip3 install -r server/requirements.txt
EXPOSE 3000 5173
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
