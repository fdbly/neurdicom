# neurdicom
# 简单操作流程
1. 先下载安装docker，并切换到国内源
2. 运行docker
3. 在终端中进入ndicom_server目录

`cd ndicom_server`

4. 运行install_and_run.sh，运行完成后关闭终端

`sh install_and_run.sh`

5. 运行run.sh，运行完成后不要关闭终端

`sh run.sh`

6. 新建一个终端，进入ndicom_client目录（前提是你已经装好了 nodejs npm，并且全局安装create-react-app）

7. 依次输入

`npm i npm@latest -g`

`npm install`

`npm run start`
