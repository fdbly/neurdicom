FROM python:3
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip --default-timeout=100 install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
RUN pip --default-timeout=100 install pydicom -i https://mirrors.aliyun.com/pypi/simple/
RUN pip --default-timeout=100 install pynetdicom -i https://mirrors.aliyun.com/pypi/simple/
ADD . /code/
CMD python manage.py migrate
CMD python manage.py clear_dicom
CMD python manage.py store_dicom /images
EXPOSE 8080
ENTRYPOINT ["python", "app.py"]