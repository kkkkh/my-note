# bash
#### 条件 if elif else
```bash
if [ $1 = "1" ]
then
  echo "Hello $1 "
elif [ $1 = "2" ]
then
  echo "hello $1"
else
  echo "hello no"
fi
```
#### func
```bash
devPush () {
    git checkout dev
    git pull
    git merge feature_v2.1.$version
    sleep 3
    echo "----push：dev,please confirm--------"
    read
    git push
}
devPush()
```
