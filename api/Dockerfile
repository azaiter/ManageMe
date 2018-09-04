FROM python:3.6-alpine3.7

# 
COPY src/ /src/

# 
RUN apk --no-cache add mariadb-dev build-base \
      && pip install -qq -r /src/requirements.txt \
      && rm -rf .cache/pip

EXPOSE  8321
CMD ["python", "/src/app.py", "-debug"]