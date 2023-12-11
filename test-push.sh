#!/bin/bash

#编译
#mvn -U install

# 登录
docker login -u dingtalk_grwsfu -p Jcqaz123!@# odos-registry.cn-shanghai.cr.aliyuncs.com

docker build -t odos-registry.cn-shanghai.cr.aliyuncs.com/orange-test/saas-business-orthodontic:latest ./;

docker push odos-registry.cn-shanghai.cr.aliyuncs.com/orange-test/saas-business-orthodontic:latest;
