# https://www.educative.io/courses/author-guide/N8Kqql2x0vK
# it's recomendeed to use this one
FROM node:12

COPY . .

RUN cd src && npm install
