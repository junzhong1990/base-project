#!/bin/bash

# 删除public
rm -rf public

# 合并dev分支的public代码
git checkout dev public/**
