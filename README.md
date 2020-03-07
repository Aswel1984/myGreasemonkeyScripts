# greasemonkey或tampermonkey脚本

```python
import itchat
import time

itchat.auto_login(hotReload=True)
# 返回完整的公众号列表
mps = itchat.get_mps()
# 获取名字中含有特定字符的公众号，也就是按公众号名称查找,返回值为一个字典的列表
mps = itchat.search_mps(name='先锋')
# print(mps)
# 发送方法和上面一样
userName = mps[0]['UserName']
itchat.send("u1=33280", toUserName=userName)
time.sleep(8)
itchat.send("u17=188", toUserName=userName)
time.sleep(8)
itchat.send("u16=4250", toUserName=userName)

print("done")

```
