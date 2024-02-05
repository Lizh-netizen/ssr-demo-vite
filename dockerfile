# 基础镜像
FROM nginx
# author
MAINTAINER 极橙

# 挂载目录
VOLUME /home/jc/projects/orange-ortho-all-web
# 创建目录
RUN mkdir -p /home/jc/projects/orange-ortho-all-web
# 指定路径
WORKDIR /home/jc/projects/orange-ortho-all-web
# 复制conf文件到路径
COPY nginx/conf/nginx.conf /etc/nginx/nginx.conf
# 复制html文件到路径
COPY dist /home/jc/projects/orange-ortho-all-web
