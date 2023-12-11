# 基础镜像
FROM nginx
# author
MAINTAINER 极橙

# 挂载目录
VOLUME /home/jc/projects/saas-orange-ortho
# 创建目录
RUN mkdir -p /home/jc/projects/saas-orange-ortho
# 指定路径
WORKDIR /home/jc/projects/saas-orange-ortho
# 复制conf文件到路径
COPY nginx/conf/nginx.conf /etc/nginx/nginx.conf
# 复制html文件到路径
COPY development /home/jc/projects/saas-orange-ortho
